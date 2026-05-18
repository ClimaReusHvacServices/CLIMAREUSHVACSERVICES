"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Search, UserPlus, Pencil, Trash2, Wrench, Eye, EyeOff, X } from "lucide-react";
import { createWorker, updateWorker, deleteWorker } from "@/app/[locale]/(dashboard)/admin/workers/actions";

interface WorkerRow {
  id: string;
  isAvailable: boolean;
  specialties: string[];
  totalJobsCompleted: number;
  user: { firstName: string; lastName: string; email: string; username: string; isActive: boolean };
}

const defaultCreate = { firstName: "", lastName: "", email: "", password: "", specialties: "" };
const defaultEdit = { firstName: "", lastName: "", isActive: true, specialties: "", isAvailable: true };

// El efecto usa ref para onClose → deps vacías → sin cleanup en cada render → sin pérdida de foco
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onCloseRef.current(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, []);

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

export function WorkersTable({ workers }: { workers: WorkerRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<WorkerRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkerRow | null>(null);
  const [createForm, setCreateForm] = useState({ ...defaultCreate });
  const [editForm, setEditForm] = useState({ ...defaultEdit });
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filtered = workers.filter((w) => {
    const q = search.toLowerCase();
    return q === "" ||
      `${w.user.firstName} ${w.user.lastName}`.toLowerCase().includes(q) ||
      w.user.email.toLowerCase().includes(q) ||
      w.specialties.some(s => s.toLowerCase().includes(q));
  });

  function openCreate() {
    setCreateForm({ ...defaultCreate });
    setShowPw(false);
    setModal("create");
  }

  function openEdit(w: WorkerRow) {
    setEditTarget(w);
    setEditForm({
      firstName: w.user.firstName,
      lastName: w.user.lastName,
      isActive: w.user.isActive,
      specialties: w.specialties.join(", "),
      isAvailable: w.isAvailable,
    });
    setModal("edit");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const specialties = createForm.specialties.split(",").map(s => s.trim()).filter(Boolean);
      const result = await createWorker({
        firstName: createForm.firstName,
        lastName: createForm.lastName,
        email: createForm.email,
        password: createForm.password,
        specialties,
      });
      toast.success(
        `Trabajador creado. Login: ${result.username} | Email: ${createForm.email}`,
        { duration: 8000 }
      );
      setModal(null);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message?.includes("Unique") ? "El email ya está en uso" : "Error al crear");
    } finally { setIsLoading(false); }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editTarget) return;
    setIsLoading(true);
    try {
      const specialties = editForm.specialties.split(",").map(s => s.trim()).filter(Boolean);
      await updateWorker(editTarget.id, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        isActive: editForm.isActive,
        specialties,
        isAvailable: editForm.isAvailable,
      });
      toast.success("Trabajador actualizado");
      setModal(null);
      router.refresh();
    } catch { toast.error("Error al actualizar"); }
    finally { setIsLoading(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsLoading(true);
    try {
      await deleteWorker(deleteTarget.id);
      toast.success("Trabajador eliminado");
      setDeleteTarget(null);
      router.refresh();
    } catch { toast.error("Error al eliminar"); }
    finally { setIsLoading(false); }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o especialidad..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 transition-colors"
          />
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 shrink-0"
          style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
        >
          <UserPlus size={15} />
          Nuevo Trabajador
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Trabajador</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">Especialidades</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">Completados</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Disponible</th>
                <th className="py-3 px-4 w-20" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Wrench size={40} className="mx-auto mb-3 text-gray-200" />
                    <p className="text-gray-400 text-sm">{workers.length === 0 ? "No hay trabajadores registrados" : "Sin resultados"}</p>
                  </td>
                </tr>
              ) : filtered.map((w) => (
                <tr key={w.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: "linear-gradient(to right, #1d7291, #083a57)" }}>
                        {(w.user.firstName[0] + w.user.lastName[0]).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{w.user.firstName} {w.user.lastName}</p>
                        <span className={`text-[10px] font-semibold ${w.user.isActive ? "text-green-600" : "text-gray-400"}`}>
                          {w.user.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <p className="text-gray-600 text-sm">{w.user.email}</p>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">@{w.user.username}</p>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    {w.specialties.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {w.specialties.slice(0, 2).map((s) => (
                          <span key={s} className="bg-primary-50 text-primary-700 px-2 py-0.5 rounded-md text-xs font-medium">{s}</span>
                        ))}
                        {w.specialties.length > 2 && <span className="text-gray-400 text-xs">+{w.specialties.length - 2}</span>}
                      </div>
                    ) : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-50 text-primary-700">
                      {w.totalJobsCompleted}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${w.isAvailable ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${w.isAvailable ? "bg-green-500" : "bg-gray-400"}`} />
                      {w.isAvailable ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(w)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Editar">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(w)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
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
            <span className="text-xs text-gray-400">{filtered.length} trabajador{filtered.length !== 1 ? "es" : ""}</span>
          </div>
        )}
      </div>

      {/* Modal crear */}
      {modal === "create" && (
        <Modal title="Nuevo Trabajador" onClose={() => setModal(null)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre" required>
                <input required className={inputCls} value={createForm.firstName} onChange={e => setCreateForm(f => ({ ...f, firstName: e.target.value }))} />
              </Field>
              <Field label="Apellido" required>
                <input required className={inputCls} value={createForm.lastName} onChange={e => setCreateForm(f => ({ ...f, lastName: e.target.value }))} />
              </Field>
            </div>
            <Field label="Email" required>
              <input required type="email" className={inputCls} value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))} />
            </Field>
            <Field label="Contraseña" required>
              <div className="relative">
                <input required type={showPw ? "text" : "password"} minLength={8} className={inputCls} value={createForm.password} onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))} placeholder="Mínimo 8 caracteres" />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </Field>
            <Field label="Especialidades (separadas por coma)">
              <input className={inputCls} value={createForm.specialties} onChange={e => setCreateForm(f => ({ ...f, specialties: e.target.value }))} placeholder="ej: Instalación, Mantenimiento" />
            </Field>
            <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setModal(null)} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50">Cancelar</button>
              <button type="submit" disabled={isLoading} className="px-5 py-2 text-sm font-semibold text-white rounded-xl disabled:opacity-60 flex items-center gap-2" style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}>
                {isLoading && <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Guardar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal editar */}
      {modal === "edit" && (
        <Modal title="Editar Trabajador" onClose={() => setModal(null)}>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre" required>
                <input required className={inputCls} value={editForm.firstName} onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))} />
              </Field>
              <Field label="Apellido" required>
                <input required className={inputCls} value={editForm.lastName} onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))} />
              </Field>
            </div>
            <Field label="Especialidades (separadas por coma)">
              <input className={inputCls} value={editForm.specialties} onChange={e => setEditForm(f => ({ ...f, specialties: e.target.value }))} placeholder="ej: Instalación, Mantenimiento" />
            </Field>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editForm.isAvailable} onChange={e => setEditForm(f => ({ ...f, isAvailable: e.target.checked }))} className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm font-medium text-gray-700">Disponible</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editForm.isActive} onChange={e => setEditForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm font-medium text-gray-700">Activo</span>
              </label>
            </div>
            <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setModal(null)} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50">Cancelar</button>
              <button type="submit" disabled={isLoading} className="px-5 py-2 text-sm font-semibold text-white rounded-xl disabled:opacity-60 flex items-center gap-2" style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}>
                {isLoading && <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Guardar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirmación borrado */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 rounded-xl shrink-0"><Trash2 size={18} className="text-red-500" /></div>
              <div>
                <h3 className="font-bold text-gray-900">Eliminar trabajador</h3>
                <p className="text-sm text-gray-500 mt-0.5">Esta acción no se puede deshacer.</p>
                <p className="text-sm font-semibold text-gray-800 mt-2">&ldquo;{deleteTarget.user.firstName} {deleteTarget.user.lastName}&rdquo;</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteTarget(null)} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50">Cancelar</button>
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
