"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, Package, Wrench, Box, X } from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import {
  createProduct, updateProduct, deleteProduct,
  createService, updateService, deleteService,
  createPackage, updatePackage, deletePackage,
} from "@/app/[locale]/(dashboard)/admin/products/actions";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductRow {
  id: string; name: string; description: string; category: string;
  manufacturer: string | null; price: any; discountPrice: any;
  stock: number; warranty: string | null; isActive: boolean;
}
interface ServiceRow {
  id: string; name: string; description: string; type: string;
  basePrice: any; estimatedDuration: number; difficulty: string; isActive: boolean;
}
interface PackageRow {
  id: string; name: string; description: string;
  productId: string; serviceId: string;
  packagePrice: any; discountPercentage: any; isActive: boolean;
  product: { name: string }; service: { name: string };
}

type Tab = "products" | "services" | "packages";
const PAGE_SIZE = 10;

const defaultProductForm = { name: "", description: "", category: "", manufacturer: "", price: "", discountPrice: "", stock: "1", warranty: "", isActive: true };
const defaultServiceForm = { name: "", description: "", type: "instalacion", basePrice: "", estimatedDuration: "60", difficulty: "media", isActive: true };
const defaultPackageForm = { name: "", description: "", productId: "", serviceId: "", packagePrice: "", discountPercentage: "", isActive: true };

// ─── Sub-components ───────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handle);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handle);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function ConfirmDialog({ title, desc, itemName, onConfirm, onCancel, isLoading }: {
  title: string; desc: string; itemName: string;
  onConfirm: () => void; onCancel: () => void; isLoading: boolean;
}) {
  const tCommon = useTranslations("common");
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
          <div className="flex items-start gap-3">
          <div className="p-2 bg-primary-50 rounded-xl shrink-0">
            <Trash2 size={18} className="text-primary-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
            <p className="text-sm font-semibold text-gray-800 mt-2">&ldquo;{itemName}&rdquo;</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-1">
          <button onClick={onCancel} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50">
            {tCommon("cancel")}
          </button>
          <button onClick={onConfirm} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-accent-600 rounded-xl hover:bg-accent-700 transition-colors disabled:opacity-50 flex items-center gap-2">
            {isLoading && <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {tCommon("delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {label}{required && <span className="text-primary-600 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-accent-400 focus:ring-1 focus:ring-accent-100 transition-colors bg-white";

// ─── Main component ───────────────────────────────────────────────────────────

export function ProductsManager({ products, services, packages }: {
  products: ProductRow[]; services: ServiceRow[]; packages: PackageRow[];
}) {
  const t = useTranslations("adminProducts");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("products");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ mode: "create" | "edit"; entityType: Tab; id?: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; entityType: Tab } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);

  const [productForm, setProductForm] = useState({ ...defaultProductForm });
  const [serviceForm, setServiceForm] = useState({ ...defaultServiceForm });
  const [packageForm, setPackageForm] = useState({ ...defaultPackageForm });

  // Filter
  const q = search.toLowerCase();
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  const filteredServices = services.filter(s => s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q));
  const filteredPackages = packages.filter(p => p.name.toLowerCase().includes(q) || p.product.name.toLowerCase().includes(q) || p.service.name.toLowerCase().includes(q));

  const allCurrent = tab === "products" ? filteredProducts : tab === "services" ? filteredServices : filteredPackages;
  const totalPages = Math.ceil(allCurrent.length / PAGE_SIZE);
  const current = allCurrent.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalCurrent = tab === "products" ? products.length : tab === "services" ? services.length : packages.length;
  const from = allCurrent.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, allCurrent.length);

  // Modal helpers
  function openCreate(type: Tab) {
    if (type === "products") setProductForm({ ...defaultProductForm });
    if (type === "services") setServiceForm({ ...defaultServiceForm });
    if (type === "packages") setPackageForm({ ...defaultPackageForm });
    setModal({ mode: "create", entityType: type });
  }

  function openEdit(type: Tab, item: any) {
    if (type === "products") setProductForm({
      name: item.name, description: item.description, category: item.category,
      manufacturer: item.manufacturer ?? "", price: String(Number(item.price)),
      discountPrice: item.discountPrice ? String(Number(item.discountPrice)) : "",
      stock: String(item.stock), warranty: item.warranty ?? "", isActive: item.isActive,
    });
    if (type === "services") setServiceForm({
      name: item.name, description: item.description, type: item.type,
      basePrice: String(Number(item.basePrice)), estimatedDuration: String(item.estimatedDuration),
      difficulty: item.difficulty, isActive: item.isActive,
    });
    if (type === "packages") setPackageForm({
      name: item.name, description: item.description,
      productId: item.productId, serviceId: item.serviceId,
      packagePrice: String(Number(item.packagePrice)),
      discountPercentage: item.discountPercentage ? String(Number(item.discountPercentage)) : "",
      isActive: item.isActive,
    });
    setModal({ mode: "edit", entityType: type, id: item.id });
  }

  // Submit handlers
  async function handleProductSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        name: productForm.name, description: productForm.description,
        category: productForm.category,
        manufacturer: productForm.manufacturer || undefined,
        price: parseFloat(productForm.price),
        discountPrice: productForm.discountPrice ? parseFloat(productForm.discountPrice) : undefined,
        stock: parseInt(productForm.stock) || 0,
        warranty: productForm.warranty || undefined,
        isActive: productForm.isActive,
      };
      if (modal?.mode === "edit" && modal.id) await updateProduct(modal.id, data);
      else await createProduct(data);
      toast.success(t("saveSuccess"));
      setModal(null);
      router.refresh();
    } catch { toast.error(t("saveError")); }
    finally { setIsSubmitting(false); }
  }

  async function handleServiceSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        name: serviceForm.name, description: serviceForm.description,
        type: serviceForm.type, basePrice: parseFloat(serviceForm.basePrice),
        estimatedDuration: parseInt(serviceForm.estimatedDuration) || 60,
        difficulty: serviceForm.difficulty, isActive: serviceForm.isActive,
      };
      if (modal?.mode === "edit" && modal.id) await updateService(modal.id, data);
      else await createService(data);
      toast.success(t("saveSuccess"));
      setModal(null);
      router.refresh();
    } catch { toast.error(t("saveError")); }
    finally { setIsSubmitting(false); }
  }

  async function handlePackageSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        name: packageForm.name, description: packageForm.description,
        productId: packageForm.productId, serviceId: packageForm.serviceId,
        packagePrice: parseFloat(packageForm.packagePrice),
        discountPercentage: packageForm.discountPercentage ? parseFloat(packageForm.discountPercentage) : undefined,
        isActive: packageForm.isActive,
      };
      if (modal?.mode === "edit" && modal.id) await updatePackage(modal.id, data);
      else await createPackage(data);
      toast.success(t("saveSuccess"));
      setModal(null);
      router.refresh();
    } catch { toast.error(t("saveError")); }
    finally { setIsSubmitting(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      if (deleteTarget.entityType === "products") await deleteProduct(deleteTarget.id);
      if (deleteTarget.entityType === "services") await deleteService(deleteTarget.id);
      if (deleteTarget.entityType === "packages") await deletePackage(deleteTarget.id);
      toast.success(t("deleteSuccess"));
      setDeleteTarget(null);
      router.refresh();
    } catch { toast.error(t("deleteError")); }
    finally { setIsSubmitting(false); }
  }

  const statusCls = (active: boolean) =>
    active ? "bg-primary-50 text-primary-700" : "bg-gray-100 text-gray-600";

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {([
            { key: "products", label: t("tabProducts"), icon: <Package size={14} /> },
            { key: "services", label: t("tabServices"), icon: <Wrench size={14} /> },
            { key: "packages", label: t("tabPackages"), icon: <Box size={14} /> },
          ] as const).map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setSearch(""); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Search + Add */}
        <div className="flex gap-2 sm:ml-auto">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search")}
              className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-accent-400 focus:ring-1 focus:ring-accent-100 transition-colors w-44"
            />
          </div>
          <button
            onClick={() => openCreate(tab)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white rounded-xl transition-colors"
            style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
          >
            <Plus size={15} />
            {tab === "products" ? t("addProduct") : tab === "services" ? t("addService") : t("addPackage")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {tab === "products" && <>
                  <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colName")}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colCategory")}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colPrice")}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colStock")}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colStatus")}</th>
                  <th className="py-3 px-4 w-20" />
                </>}
                {tab === "services" && <>
                  <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colName")}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colType")}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colPrice")}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colDuration")}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colStatus")}</th>
                  <th className="py-3 px-4 w-20" />
                </>}
                {tab === "packages" && <>
                  <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colName")}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colProduct")}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colService")}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colPrice")}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colStatus")}</th>
                  <th className="py-3 px-4 w-20" />
                </>}
              </tr>
            </thead>
            <tbody>
              {current.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-gray-400 text-sm">
                    {tab === "products" ? <Package size={36} className="mx-auto mb-3 text-gray-200" />
                      : tab === "services" ? <Wrench size={36} className="mx-auto mb-3 text-gray-200" />
                      : <Box size={36} className="mx-auto mb-3 text-gray-200" />}
                    {search ? t("noResults") : tab === "products" ? t("noProducts") : tab === "services" ? t("noServices") : t("noPackages")}
                  </td>
                </tr>
              ) : tab === "products" ? (
                (filteredProducts as ProductRow[]).map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{p.name}</p>
                      {p.manufacturer && <p className="text-xs text-gray-400">{p.manufacturer}</p>}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{p.category}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {p.discountPrice
                        ? <span><span className="text-primary-600">€{Number(p.discountPrice).toFixed(2)}</span><span className="text-gray-400 line-through ml-1 text-xs">€{Number(p.price).toFixed(2)}</span></span>
                        : `€${Number(p.price).toFixed(2)}`}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{p.stock}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${statusCls(p.isActive)}`}>
                        {p.isActive ? t("active") : t("inactive")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit("products", p)} className="p-1.5 text-gray-400 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => setDeleteTarget({ id: p.id, name: p.name, entityType: "products" })} className="p-1.5 text-gray-400 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : tab === "services" ? (
                (filteredServices as ServiceRow[]).map((s) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{s.name}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {s.type === "instalacion" ? t("typeInstalacion") : s.type === "mantenimiento" ? t("typeMantenimiento") : t("typeReparacion")}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">€{Number(s.basePrice).toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-600">{s.estimatedDuration} {t("min")}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${statusCls(s.isActive)}`}>
                        {s.isActive ? t("active") : t("inactive")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit("services", s)} className="p-1.5 text-gray-400 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => setDeleteTarget({ id: s.id, name: s.name, entityType: "services" })} className="p-1.5 text-gray-400 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                (filteredPackages as PackageRow[]).map((pkg) => (
                  <tr key={pkg.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{pkg.name}</td>
                    <td className="py-3 px-4 text-gray-600">{pkg.product.name}</td>
                    <td className="py-3 px-4 text-gray-600">{pkg.service.name}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">€{Number(pkg.packagePrice).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${statusCls(pkg.isActive)}`}>
                        {pkg.isActive ? t("active") : t("inactive")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit("packages", pkg)} className="p-1.5 text-gray-400 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => setDeleteTarget({ id: pkg.id, name: pkg.name, entityType: "packages" })} className="p-1.5 text-gray-400 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {current.length > 0 && (
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/40 text-xs text-gray-400">
            {current.length} / {totalCurrent}
          </div>
        )}
      </div>

      {/* ─── Modal de formulario ─────────────────────────────────────────── */}
      {modal && (
        <Modal
          title={
            modal.entityType === "products"
              ? (modal.mode === "create" ? t("createProduct") : t("editProduct"))
              : modal.entityType === "services"
              ? (modal.mode === "create" ? t("createService") : t("editService"))
              : (modal.mode === "create" ? t("createPackage") : t("editPackage"))
          }
          onClose={() => setModal(null)}
        >
          {/* Product form */}
          {modal.entityType === "products" && (
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <Field label={t("fieldName")} required>
                <input required className={inputCls} value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} />
              </Field>
              <Field label={t("fieldDescription")} required>
                <textarea required className={`${inputCls} resize-none min-h-[72px]`} value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t("fieldCategory")} required>
                  <input required className={inputCls} value={productForm.category} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))} />
                </Field>
                <Field label={t("fieldManufacturer")}>
                  <input className={inputCls} value={productForm.manufacturer} onChange={e => setProductForm(f => ({ ...f, manufacturer: e.target.value }))} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t("fieldPrice")} required>
                  <input required type="number" step="0.01" min="0" className={inputCls} value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} />
                </Field>
                <Field label={t("fieldDiscountPrice")}>
                  <input type="number" step="0.01" min="0" className={inputCls} value={productForm.discountPrice} onChange={e => setProductForm(f => ({ ...f, discountPrice: e.target.value }))} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t("fieldStock")} required>
                  <input required type="number" min="0" className={inputCls} value={productForm.stock} onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))} />
                </Field>
                <Field label={t("fieldWarranty")}>
                  <input className={inputCls} value={productForm.warranty} onChange={e => setProductForm(f => ({ ...f, warranty: e.target.value }))} />
                </Field>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={productForm.isActive} onChange={e => setProductForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-primary-600" />
                <span className="text-sm font-medium text-gray-700">{t("fieldIsActive")}</span>
              </label>
              <ModalActions onCancel={() => setModal(null)} isLoading={isSubmitting} tCommon={tCommon} />
            </form>
          )}

          {/* Service form */}
          {modal.entityType === "services" && (
            <form onSubmit={handleServiceSubmit} className="space-y-4">
              <Field label={t("fieldName")} required>
                <input required className={inputCls} value={serviceForm.name} onChange={e => setServiceForm(f => ({ ...f, name: e.target.value }))} />
              </Field>
              <Field label={t("fieldDescription")} required>
                <textarea required className={`${inputCls} resize-none min-h-[72px]`} value={serviceForm.description} onChange={e => setServiceForm(f => ({ ...f, description: e.target.value }))} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t("fieldType")} required>
                  <select required className={inputCls} value={serviceForm.type} onChange={e => setServiceForm(f => ({ ...f, type: e.target.value }))}>
                    <option value="instalacion">{t("typeInstalacion")}</option>
                    <option value="mantenimiento">{t("typeMantenimiento")}</option>
                    <option value="reparacion">{t("typeReparacion")}</option>
                  </select>
                </Field>
                <Field label={t("fieldDifficulty")} required>
                  <select required className={inputCls} value={serviceForm.difficulty} onChange={e => setServiceForm(f => ({ ...f, difficulty: e.target.value }))}>
                    <option value="baja">{t("difficultyBaja")}</option>
                    <option value="media">{t("difficultyMedia")}</option>
                    <option value="alta">{t("difficultyAlta")}</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t("fieldBasePrice")} required>
                  <input required type="number" step="0.01" min="0" className={inputCls} value={serviceForm.basePrice} onChange={e => setServiceForm(f => ({ ...f, basePrice: e.target.value }))} />
                </Field>
                <Field label={t("fieldDuration")} required>
                  <input required type="number" min="1" className={inputCls} value={serviceForm.estimatedDuration} onChange={e => setServiceForm(f => ({ ...f, estimatedDuration: e.target.value }))} />
                </Field>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={serviceForm.isActive} onChange={e => setServiceForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-primary-600" />
                <span className="text-sm font-medium text-gray-700">{t("fieldIsActive")}</span>
              </label>
              <ModalActions onCancel={() => setModal(null)} isLoading={isSubmitting} tCommon={tCommon} />
            </form>
          )}

          {/* Package form */}
          {modal.entityType === "packages" && (
            <form onSubmit={handlePackageSubmit} className="space-y-4">
              <Field label={t("fieldName")} required>
                <input required className={inputCls} value={packageForm.name} onChange={e => setPackageForm(f => ({ ...f, name: e.target.value }))} />
              </Field>
              <Field label={t("fieldDescription")} required>
                <textarea required className={`${inputCls} resize-none min-h-[72px]`} value={packageForm.description} onChange={e => setPackageForm(f => ({ ...f, description: e.target.value }))} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t("fieldProduct")} required>
                  <select required className={inputCls} value={packageForm.productId} onChange={e => setPackageForm(f => ({ ...f, productId: e.target.value }))}>
                    <option value="">{t("selectProduct")}</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </Field>
                <Field label={t("fieldService")} required>
                  <select required className={inputCls} value={packageForm.serviceId} onChange={e => setPackageForm(f => ({ ...f, serviceId: e.target.value }))}>
                    <option value="">{t("selectService")}</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t("fieldPackagePrice")} required>
                  <input required type="number" step="0.01" min="0" className={inputCls} value={packageForm.packagePrice} onChange={e => setPackageForm(f => ({ ...f, packagePrice: e.target.value }))} />
                </Field>
                <Field label={t("fieldDiscountPct")}>
                  <input type="number" step="0.01" min="0" max="100" className={inputCls} value={packageForm.discountPercentage} onChange={e => setPackageForm(f => ({ ...f, discountPercentage: e.target.value }))} />
                </Field>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={packageForm.isActive} onChange={e => setPackageForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-primary-600" />
                <span className="text-sm font-medium text-gray-700">{t("fieldIsActive")}</span>
              </label>
              <ModalActions onCancel={() => setModal(null)} isLoading={isSubmitting} tCommon={tCommon} />
            </form>
          )}
        </Modal>
      )}

      {/* ─── Confirmación de borrado ─────────────────────────────────────── */}
      {deleteTarget && (
        <ConfirmDialog
          title={t("confirmDeleteTitle")}
          desc={t("confirmDeleteDesc")}
          itemName={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}

function ModalActions({ onCancel, isLoading, tCommon }: {
  onCancel: () => void;
  isLoading: boolean;
  tCommon: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
      <button type="button" onClick={onCancel} disabled={isLoading}
        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50">
        {tCommon("cancel")}
      </button>
      <button type="submit" disabled={isLoading}
        className="px-5 py-2 text-sm font-semibold text-white rounded-xl transition-opacity disabled:opacity-60 flex items-center gap-2"
        style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}>
        {isLoading && <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
        {tCommon("save")}
      </button>
    </div>
  );
}
