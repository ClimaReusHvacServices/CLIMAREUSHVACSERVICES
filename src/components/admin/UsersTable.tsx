"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Search, UserPlus, Pencil, Trash2, Users, Eye, EyeOff, X } from "lucide-react";
import { createClient, updateClient, deleteClient } from "@/app/[locale]/(dashboard)/admin/users/actions";

interface ClientRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string | null;
  isActive: boolean;
  createdAt: Date;
}

const defaultForm = { firstName: "", lastName: "", email: "", phoneNumber: "", password: "", isActive: true };

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0"
          style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}>
          <h2 className="font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 transition-colors bg-white";

export function ClientsTable({ clients, locale }: { clients: ClientRow[]; locale: string }) {
  const t = useTranslations("adminUsers");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<ClientRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClientRow | null>(null);
  const [form, setForm] = useState({ ...defaultForm });
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return q === "" ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.username.toLowerCase().includes(q);
  });

  function openCreate() {
    setForm({ ...defaultForm });
    setShowPw(false);
    setModal("create");
  }

  function openEdit(c: ClientRow) {
    setEditTarget(c);
    setForm({ firstName: c.firstName, lastName: c.lastName, email: c.email, phoneNumber: c.phoneNumber ?? "", password: "", isActive: c.isActive });
    setModal("edit");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (modal === "create") {
        await createClient({ firstName: form.firstName, lastName: form.lastName, email: form.email, phoneNumber: form.phoneNumber || undefined, password: form.password });
        toast.success("Cliente creado correctamente");
      } else if (modal === "edit" && editTarget) {
        await updateClient(editTarget.id, { firstName: form.firstName, lastName: form.lastName, email: form.email, phoneNumber: form.phoneNumber || undefined, isActive: form.isActive });
        toast.success("Cliente actualizado");
      }
      setModal(null);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message?.includes("Unique") ? "El email ya está en uso" : "Error al guardar");
    } finally { setIsLoading(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsLoading(true);
    try {
      await deleteClient(deleteTarget.id);
      toast.success("Cliente eliminado");
      setDeleteTarget(null);
      router.refresh();
    } catch (err: any) {
      toast.error(
        err?.message === "CLIENT_HAS_ORDERS"
          ? "No se puede eliminar: el cliente tiene pedidos. Desactívalo en su lugar."
          : "Error al eliminar"
      );
    } finally { setIsLoading(false); }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o usuario..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 transition-colors"
          />
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 shrink-0"
          style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
        >
          <UserPlus size={15} />
          Nuevo Cliente
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Cliente</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">Teléfono</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden lg:table-cell">Registro</th>
                <th className="py-3 px-4 w-20" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Users size={40} className="mx-auto mb-3 text-gray-200" />
                    <p className="text-gray-400 text-sm">{clients.length === 0 ? "No hay clientes registrados" : "Sin resultados"}</p>
                  </td>
                </tr>
              ) : filtered.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}>
                        {(c.firstName[0] + c.lastName[0]).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{c.firstName} {c.lastName}</p>
                        <p className="text-xs text-gray-400">@{c.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{c.email}</td>
                  <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{c.phoneNumber || <span className="text-gray-300">—</span>}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${c.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      <span className={`size-1.5 rounded-full shrink-0 ${c.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                      {c.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs hidden lg:table-cell">{new Date(c.createdAt).toLocaleDateString(locale)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Editar">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(c)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50/40">
            <span className="text-xs text-gray-400">{filtered.length} cliente{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <Modal title={modal === "create" ? "Nuevo Cliente" : "Editar Cliente"} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre" required>
                <input required className={inputCls} value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
              </Field>
              <Field label="Apellido" required>
                <input required className={inputCls} value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
              </Field>
            </div>
            <Field label="Email" required>
              <input required type="email" className={inputCls} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </Field>
            <Field label="Teléfono">
              <input type="tel" className={inputCls} value={form.phoneNumber} onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))} />
            </Field>
            {modal === "create" && (
              <Field label="Contraseña" required>
                <div className="relative">
                  <input required type={showPw ? "text" : "password"} minLength={8} className={inputCls} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Mínimo 8 caracteres" />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </Field>
            )}
            {modal === "edit" && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm font-medium text-gray-700">Cliente activo</span>
              </label>
            )}
            <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setModal(null)} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50">
                Cancelar
              </button>
              <button type="submit" disabled={isLoading} className="px-5 py-2 text-sm font-semibold text-white rounded-xl transition-opacity disabled:opacity-60 flex items-center gap-2"
                style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}>
                {isLoading && <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Guardar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 rounded-xl shrink-0"><Trash2 size={18} className="text-red-500" /></div>
              <div>
                <h3 className="font-bold text-gray-900">Eliminar cliente</h3>
                <p className="text-sm text-gray-500 mt-0.5">Esta acción no se puede deshacer.</p>
                <p className="text-sm font-semibold text-gray-800 mt-2">&ldquo;{deleteTarget.firstName} {deleteTarget.lastName}&rdquo;</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteTarget(null)} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50">
                Cancelar
              </button>
              <button onClick={handleDelete} disabled={isLoading} className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2">
                {isLoading && <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
