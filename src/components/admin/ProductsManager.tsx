"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, Package, Wrench, Box, X, Wind, Upload, Tag, FolderOpen, CheckCircle2, XCircle } from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import {
  createProduct, updateProduct, deleteProduct,
  createService, updateService, deleteService,
  createPackage, updatePackage, deletePackage,
  setProductDiscount,
  createCategory, updateCategory, deleteCategory,
} from "@/app/[locale]/(dashboard)/admin/products/actions";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ProductRow {
  id: string; name: string; description: string; category: string; categoryId: string | null;
  manufacturer: string | null; price: any; discountPrice: any;
  stock: number; warranty: string | null; isActive: boolean; images: string[];
  specifications: string | null;
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

type Tab = "products" | "services" | "packages" | "categories";
const PAGE_SIZE = 10;

const defaultProductForm = {
  name: "", description: "", category: "", categoryId: "", manufacturer: "", price: "", discountPrice: "",
  stock: "1", warranty: "", isActive: true, imageUrl: "",
  specEnergyLabel: "", specEfficiency: "", specNoiseLevel: "", specQuality: "",
  specWifi: false, specCoverage: "",
};
const defaultServiceForm = { name: "", description: "", type: "instalacion", basePrice: "", estimatedDuration: "60", difficulty: "media", isActive: true };
const defaultPackageForm = { name: "", description: "", productId: "", serviceId: "", packagePrice: "", discountPercentage: "", isActive: true };

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function Modal({ title, onClose, wide, children }: { title: string; onClose: () => void; wide?: boolean; children: React.ReactNode }) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onCloseRef.current(); };
    document.addEventListener("keydown", handle);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handle);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-lg"} max-h-[92vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="font-bold text-gray-900 text-base">{title}</h2>
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

// ─── Componente principal ─────────────────────────────────────────────────────

interface CategoryRow { id: string; name: string; slug: string; isActive: boolean; _count?: { products: number }; }

export function ProductsManager({ products, services, packages, categories = [] }: {
  products: ProductRow[]; services: ServiceRow[]; packages: PackageRow[];
  categories?: CategoryRow[];
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

  const [offerModal, setOfferModal] = useState<{ id: string; name: string; price: number } | null>(null);
  const [offerPrice, setOfferPrice] = useState("");
  const [isTogglingOffer, setIsTogglingOffer] = useState(false);

  const defaultCategoryForm = { name: "", isActive: true };
  const [categoryForm, setCategoryForm] = useState({ ...defaultCategoryForm });
  const [categoryModal, setCategoryModal] = useState<{ mode: "create" | "edit"; id?: string } | null>(null);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<{ id: string; name: string } | null>(null);

  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("La imagen no puede superar 2 MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setProductForm(f => ({ ...f, imageUrl: ev.target?.result as string ?? "" }));
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function handleSetOffer(e: React.FormEvent) {
    e.preventDefault();
    if (!offerModal) return;
    const val = parseFloat(offerPrice);
    if (isNaN(val) || val <= 0 || val >= offerModal.price) {
      toast.error(t("offerError"));
      return;
    }
    setIsTogglingOffer(true);
    try {
      await setProductDiscount(offerModal.id, val);
      toast.success(t("offerSuccess"));
      setOfferModal(null);
      router.refresh();
    } catch { toast.error(t("offerError")); }
    finally { setIsTogglingOffer(false); }
  }

  async function handleRemoveOffer(id: string) {
    setIsTogglingOffer(true);
    try {
      await setProductDiscount(id, null);
      toast.success(t("offerRemoveSuccess"));
      router.refresh();
    } catch { toast.error(t("offerError")); }
    finally { setIsTogglingOffer(false); }
  }

  // Filtrar según búsqueda activa
  const q = search.toLowerCase();
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  const filteredServices = services.filter(s => s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q));
  const filteredPackages = packages.filter(p => p.name.toLowerCase().includes(q) || p.product.name.toLowerCase().includes(q) || p.service.name.toLowerCase().includes(q));

  const allCurrent = tab === "products" ? filteredProducts : tab === "services" ? filteredServices : tab === "packages" ? filteredPackages : [];
  const totalPages = Math.ceil(allCurrent.length / PAGE_SIZE);
  const current = allCurrent.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const from = allCurrent.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, allCurrent.length);

  // Funciones auxiliares del modal
  function openCreate(type: Tab) {
    if (type === "products") setProductForm({ ...defaultProductForm });
    if (type === "services") setServiceForm({ ...defaultServiceForm });
    if (type === "packages") setPackageForm({ ...defaultPackageForm });
    setModal({ mode: "create", entityType: type });
  }

  function openEdit(type: Tab, item: any) {
    if (type === "products") {
      let existingSpecs: Record<string, any> = {};
      try { if (item.specifications) existingSpecs = JSON.parse(item.specifications); } catch {}
      setProductForm({
        name: item.name, description: item.description, category: item.category,
        categoryId: item.categoryId ?? "",
        manufacturer: item.manufacturer ?? "", price: String(Number(item.price)),
        discountPrice: item.discountPrice ? String(Number(item.discountPrice)) : "",
        stock: String(item.stock), warranty: item.warranty ?? "", isActive: item.isActive,
        imageUrl: item.images?.[0] ?? "",
        specEnergyLabel: existingSpecs.energyLabel ?? "",
        specEfficiency: existingSpecs.efficiency ?? "",
        specNoiseLevel: existingSpecs.noiseLevel ?? "",
        specQuality: existingSpecs.quality ?? "",
        specWifi: existingSpecs.wifi ?? false,
        specCoverage: existingSpecs.coverage ?? "",
      });
    }
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

  // Manejadores de envío de formularios
  async function handleProductSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const specs: Record<string, any> = {};
      if (productForm.specEnergyLabel) specs.energyLabel = productForm.specEnergyLabel;
      if (productForm.specEfficiency) specs.efficiency = productForm.specEfficiency;
      if (productForm.specNoiseLevel) specs.noiseLevel = productForm.specNoiseLevel;
      if (productForm.specQuality) specs.quality = productForm.specQuality;
      if (productForm.specWifi) specs.wifi = productForm.specWifi;
      if (productForm.specCoverage) specs.coverage = productForm.specCoverage;
      const specifications = Object.keys(specs).length > 0 ? JSON.stringify(specs) : undefined;

      const data = {
        name: productForm.name, description: productForm.description,
        category: productForm.category,
        categoryId: productForm.categoryId || undefined,
        manufacturer: productForm.manufacturer || undefined,
        price: parseFloat(productForm.price),
        discountPrice: productForm.discountPrice ? parseFloat(productForm.discountPrice) : undefined,
        stock: parseInt(productForm.stock) || 0,
        warranty: productForm.warranty || undefined,
        isActive: productForm.isActive,
        imageUrl: productForm.imageUrl || undefined,
        specifications,
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

  async function handleCategorySubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (categoryModal?.mode === "edit" && categoryModal.id) {
        await updateCategory(categoryModal.id, categoryForm);
      } else {
        await createCategory(categoryForm);
      }
      toast.success(t("saveSuccess"));
      setCategoryModal(null);
      router.refresh();
    } catch { toast.error(t("saveError")); }
    finally { setIsSubmitting(false); }
  }

  async function handleCategoryDelete() {
    if (!deleteCategoryTarget) return;
    setIsSubmitting(true);
    try {
      await deleteCategory(deleteCategoryTarget.id);
      toast.success(t("deleteSuccess"));
      setDeleteCategoryTarget(null);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message === "CATEGORY_HAS_PRODUCTS" ? t("categoryHasProducts") : t("deleteError"));
    }
    finally { setIsSubmitting(false); }
  }

  const statusCls = (active: boolean) =>
    active ? "bg-primary-50 text-primary-700" : "bg-gray-100 text-gray-600";

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl flex-wrap">
          {([
            { key: "products", label: t("tabProducts"), icon: <Package size={14} /> },
            { key: "services", label: t("tabServices"), icon: <Wrench size={14} /> },
            { key: "packages", label: t("tabPackages"), icon: <Box size={14} /> },
            { key: "categories", label: t("tabCategories"), icon: <FolderOpen size={14} /> },
          ] as const).map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setSearch(""); setPage(1); }}
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
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={t("search")}
              className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-accent-400 focus:ring-1 focus:ring-accent-100 transition-colors w-44"
            />
          </div>
          <button
            onClick={() => {
              if (tab === "categories") {
                setCategoryForm({ name: "", isActive: true });
                setCategoryModal({ mode: "create" });
              } else {
                openCreate(tab);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white rounded-xl transition-colors"
            style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
          >
            <Plus size={15} />
            {tab === "products" ? t("addProduct") : tab === "services" ? t("addService") : tab === "packages" ? t("addPackage") : t("addCategory")}
          </button>
        </div>
      </div>

      {/* ─── Categories tab ───────────────────────────────────────────────── */}
      {tab === "categories" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colName")}</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Slug</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colProducts")}</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colStatus")}</th>
                <th className="py-3 px-4 w-20" />
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center text-gray-400 text-sm">
                    <FolderOpen size={36} className="mx-auto mb-3 text-gray-200" />
                    {t("noCategories")}
                  </td>
                </tr>
              ) : categories.map(cat => (
                <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <FolderOpen size={14} className="text-primary-600" />
                      </div>
                      <span className="font-medium text-gray-900">{cat.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{cat.slug}</code>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                      <Package size={11} />
                      {cat._count?.products ?? 0} {t("products").toLowerCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {cat.isActive
                      ? <span className="inline-flex items-center gap-1 text-xs font-semibold bg-primary-50 text-primary-700 px-2 py-1 rounded-lg"><CheckCircle2 size={11} />{t("active")}</span>
                      : <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded-lg"><XCircle size={11} />{t("inactive")}</span>
                    }
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setCategoryForm({ name: cat.name, isActive: cat.isActive }); setCategoryModal({ mode: "edit", id: cat.id }); }}
                        className="p-1.5 text-gray-400 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
                      ><Pencil size={14} /></button>
                      <button
                        onClick={() => setDeleteCategoryTarget({ id: cat.id, name: cat.name })}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      ><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Table */}
      {tab !== "categories" && <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                (current as ProductRow[]).map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-contain rounded-lg border border-gray-100 bg-gray-50 shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><Wind size={16} className="text-gray-300" /></div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{p.name}</p>
                          {p.manufacturer && <p className="text-xs text-gray-400">{p.manufacturer}</p>}
                        </div>
                      </div>
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
                        {p.discountPrice ? (
                          <button
                            onClick={() => handleRemoveOffer(p.id)}
                            disabled={isTogglingOffer}
                            title={t("offerRemove")}
                            className="p-1.5 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-40"
                          >
                            <Tag size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => { setOfferPrice(""); setOfferModal({ id: p.id, name: p.name, price: Number(p.price) }); }}
                            title={t("offerSet")}
                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Tag size={14} />
                          </button>
                        )}
                        <button onClick={() => openEdit("products", p)} className="p-1.5 text-gray-400 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => setDeleteTarget({ id: p.id, name: p.name, entityType: "products" })} className="p-1.5 text-gray-400 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : tab === "services" ? (
                (current as ServiceRow[]).map((s) => (
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
                (current as PackageRow[]).map((pkg) => (
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
        {allCurrent.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/40 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-gray-400">{from}–{to} / {allCurrent.length}</span>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>}


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
          wide={modal.entityType === "products"}
          onClose={() => setModal(null)}
        >
          {/* Product form */}
          {modal.entityType === "products" && (
            <form onSubmit={handleProductSubmit} className="space-y-5">

              {/* ── Sección: Información básica ── */}
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-3">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{t("sectionBasic")}</p>
                <Field label={t("fieldName")} required>
                  <input required className={inputCls} value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} placeholder="Ej. Daikin FTXC25C" />
                </Field>
                <Field label={t("fieldDescription")} required>
                  <textarea required rows={3} className={`${inputCls} resize-none`} value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} placeholder="Descripción breve del producto..." />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t("fieldCategory")} required>
                    <select
                      required
                      className={inputCls}
                      value={productForm.categoryId}
                      onChange={e => {
                        const cat = categories.find(c => c.id === e.target.value);
                        setProductForm(f => ({ ...f, categoryId: e.target.value, category: cat?.slug ?? e.target.value }));
                      }}
                    >
                      <option value="">{t("selectCategory")}</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label={t("fieldManufacturer")}>
                    <input className={inputCls} value={productForm.manufacturer} onChange={e => setProductForm(f => ({ ...f, manufacturer: e.target.value }))} placeholder="Ej. Daikin, Mitsubishi..." />
                  </Field>
                </div>
              </div>

              {/* ── Sección: Precio y stock ── */}
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-3">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{t("sectionPricing")}</p>
                <div className="grid grid-cols-3 gap-3">
                  <Field label={t("fieldPrice")} required>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">€</span>
                      <input required type="number" step="0.01" min="0" className={`${inputCls} pl-7`} value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" />
                    </div>
                  </Field>
                  <Field label={t("fieldDiscountPrice")}>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">€</span>
                      <input type="number" step="0.01" min="0" className={`${inputCls} pl-7`} value={productForm.discountPrice} onChange={e => setProductForm(f => ({ ...f, discountPrice: e.target.value }))} placeholder="0.00" />
                    </div>
                  </Field>
                  <Field label={t("fieldStock")} required>
                    <input required type="number" min="0" className={inputCls} value={productForm.stock} onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))} />
                  </Field>
                </div>
                <Field label={t("fieldWarranty")}>
                  <input className={inputCls} value={productForm.warranty} onChange={e => setProductForm(f => ({ ...f, warranty: e.target.value }))} placeholder="Ej. 2 años oficial fabricante" />
                </Field>
              </div>

              {/* ── Sección: Imagen ── */}
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-3">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{t("sectionImage")}</p>
                <div className="flex gap-3 items-start">
                  {productForm.imageUrl ? (
                    <div className="relative shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={productForm.imageUrl} alt="preview" className="h-20 w-20 object-contain rounded-xl border border-gray-200 bg-white" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      <button type="button" onClick={() => setProductForm(f => ({ ...f, imageUrl: "" }))} className="absolute -top-1.5 -right-1.5 bg-white border border-gray-200 rounded-full p-0.5 text-gray-400 hover:text-red-500 shadow-sm transition-colors">
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="h-20 w-20 rounded-xl border-2 border-dashed border-gray-200 bg-white flex items-center justify-center shrink-0 text-gray-300">
                      <Package size={24} />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <input type="url" className={inputCls} value={productForm.imageUrl.startsWith("data:") ? "" : productForm.imageUrl} onChange={e => setProductForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://... (URL de imagen)" />
                    <label className="flex items-center gap-2 cursor-pointer px-3 py-2 border border-dashed border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50/30 transition-colors text-sm text-gray-500 bg-white">
                      <Upload size={13} className="shrink-0 text-gray-400" />
                      <span>Subir imagen (máx. 2 MB)</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
                    </label>
                  </div>
                </div>
              </div>

              {/* ── Sección: Especificaciones técnicas ── */}
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-3">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{t("fieldSpecsSection")}</p>
                <div className="grid grid-cols-3 gap-3">
                  <Field label={t("fieldEnergyLabel")}>
                    <input className={inputCls} value={productForm.specEnergyLabel} onChange={e => setProductForm(f => ({ ...f, specEnergyLabel: e.target.value }))} placeholder="A++" />
                  </Field>
                  <Field label={t("fieldEfficiency")}>
                    <input className={inputCls} value={productForm.specEfficiency} onChange={e => setProductForm(f => ({ ...f, specEfficiency: e.target.value }))} placeholder="5.0 kW" />
                  </Field>
                  <Field label={t("fieldNoiseLevel")}>
                    <input className={inputCls} value={productForm.specNoiseLevel} onChange={e => setProductForm(f => ({ ...f, specNoiseLevel: e.target.value }))} placeholder="21 dB" />
                  </Field>
                  <Field label={t("fieldQuality")}>
                    <input className={inputCls} value={productForm.specQuality} onChange={e => setProductForm(f => ({ ...f, specQuality: e.target.value }))} placeholder="Premium" />
                  </Field>
                  <Field label={t("fieldCoverage")}>
                    <input className={inputCls} value={productForm.specCoverage} onChange={e => setProductForm(f => ({ ...f, specCoverage: e.target.value }))} placeholder="20 m²" />
                  </Field>
                  <div className="flex flex-col justify-end pb-0.5">
                    <label className="flex items-center gap-2 cursor-pointer h-[42px] px-3 bg-white border border-gray-200 rounded-xl hover:border-primary-300 transition-colors">
                      <input type="checkbox" checked={productForm.specWifi} onChange={e => setProductForm(f => ({ ...f, specWifi: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-primary-600 accent-primary-600" />
                      <span className="text-sm font-medium text-gray-700">{t("fieldWifi")}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* ── Footer: activo + botones ── */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={productForm.isActive} onChange={e => setProductForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-primary-600 accent-primary-600" />
                  <span className="text-sm font-medium text-gray-700">{t("fieldIsActive")}</span>
                </label>
                <ModalActions onCancel={() => setModal(null)} isLoading={isSubmitting} tCommon={tCommon} />
              </div>
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

      {/* ─── Modal para establecer precio de oferta ─────────────────────── */}
      {offerModal && (
        <Modal title={t("offerTitle")} onClose={() => setOfferModal(null)}>
          <form onSubmit={handleSetOffer} className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-gray-800">{offerModal.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t("fieldPrice")}: €{offerModal.price.toFixed(2)}</p>
            </div>
            <Field label={t("offerPriceLabel")} required>
              <input
                required
                autoFocus
                type="number"
                step="0.01"
                min="0.01"
                max={offerModal.price - 0.01}
                className={inputCls}
                value={offerPrice}
                onChange={e => setOfferPrice(e.target.value)}
                placeholder={`< €${offerModal.price.toFixed(2)}`}
              />
            </Field>
            <ModalActions onCancel={() => setOfferModal(null)} isLoading={isTogglingOffer} tCommon={tCommon} />
          </form>
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

      {/* ─── Modal de categoría ──────────────────────────────────────────── */}
      {categoryModal && (
        <Modal
          title={categoryModal.mode === "create" ? t("createCategory") : t("editCategory")}
          onClose={() => setCategoryModal(null)}
        >
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <Field label={t("fieldName")} required>
              <input
                required
                autoFocus
                className={inputCls}
                value={categoryForm.name}
                onChange={e => setCategoryForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ej. Aire Acondicionado Split"
              />
            </Field>
            {categoryForm.name && (
              <p className="text-xs text-gray-400 -mt-2 px-1">
                Slug: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{categoryForm.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")}</code>
              </p>
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={categoryForm.isActive} onChange={e => setCategoryForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-primary-600 accent-primary-600" />
              <span className="text-sm font-medium text-gray-700">{t("fieldIsActive")}</span>
            </label>
            <ModalActions onCancel={() => setCategoryModal(null)} isLoading={isSubmitting} tCommon={tCommon} />
          </form>
        </Modal>
      )}

      {/* ─── Confirmación de borrado de categoría ───────────────────────── */}
      {deleteCategoryTarget && (
        <ConfirmDialog
          title={t("confirmDeleteTitle")}
          desc={t("confirmDeleteDesc")}
          itemName={deleteCategoryTarget.name}
          onConfirm={handleCategoryDelete}
          onCancel={() => setDeleteCategoryTarget(null)}
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
