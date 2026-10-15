"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { BookOpen, ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";
import { createBlogPost, deleteBlogPost, updateBlogPost } from "@/app/[locale]/(dashboard)/admin/blog/actions";

type Post = {
  id: string; title: string; slug: string; excerpt: string; content: string;
  coverImage: string | null; coverGradient: string; date: string;
  category: string; readTime: number; isPublished: boolean;
};

const emptyPost = {
  title: "", slug: "", excerpt: "", content: "", coverImage: "",
  coverGradient: "linear-gradient(135deg, #0d3c4d 0%, #1d7291 55%, #008f65 100%)",
  date: new Date().toISOString().slice(0, 10), category: "Guías", readTime: 5, isPublished: true,
};
const inputClass = "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-accent-400 focus:outline-none focus:ring-1 focus:ring-accent-100";

export function BlogManager({ posts, databaseReady = true }: { posts: Post[]; databaseReady?: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Post | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyPost });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const openCreate = () => { setEditing(null); setForm({ ...emptyPost }); setModalOpen(true); };
  const openEdit = (post: Post) => { setEditing(post); setForm({ ...post, coverImage: post.coverImage ?? "" }); setModalOpen(true); };
  const setField = (field: keyof typeof form, value: string | number | boolean) =>
    setForm(current => ({ ...current, [field]: value }));

  async function uploadCover(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "blog");
      const response = await fetch("/api/upload", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "No se pudo subir la imagen");
      setField("coverImage", result.url);
      toast.success("Portada subida correctamente");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      if (editing) await updateBlogPost(editing.id, form);
      else await createBlogPost(form);
      toast.success(editing ? "Artículo actualizado" : "Artículo publicado");
      setEditing(null);
      setModalOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar el artículo");
    } finally {
      setLoading(false);
    }
  }

  async function remove(post: Post) {
    if (!window.confirm(`¿Eliminar “${post.title}”?`)) return;
    try {
      await deleteBlogPost(post.id);
      toast.success("Artículo eliminado");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar el artículo");
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <button onClick={openCreate} disabled={!databaseReady} className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50">
          <Plus size={16} /> Nuevo artículo
        </button>
      </div>
      {!databaseReady && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          La base de datos de Preview todavía no tiene la tabla del blog. Ejecuta el cambio Prisma sobre la base de datos de Preview y vuelve a desplegar para activar la creación y edición de artículos.
        </div>
      )}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {posts.length === 0 ? <p className="p-8 text-center text-sm text-gray-400">Todavía no hay artículos administrables.</p> : posts.map(post => (
          <div key={post.id} className="flex items-center gap-4 border-b border-gray-100 p-4 last:border-0">
            <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-900" style={{ background: post.coverGradient }}>
              {post.coverImage ? <img src={post.coverImage} alt="" className="h-full w-full object-cover" /> : <BookOpen className="text-white/70" size={24} />}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-semibold text-gray-900">{post.title}</h2>
              <p className="text-xs text-gray-500">{post.category} · {post.date} · {post.isPublished ? "Publicado" : "Borrador"}</p>
            </div>
            <button onClick={() => openEdit(post)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-primary-600" aria-label="Editar"><Pencil size={16} /></button>
            {!post.id.startsWith("static:") && <button onClick={() => remove(post)} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600" aria-label="Eliminar"><Trash2 size={16} /></button>}
          </div>
        ))}
      </div>
      {(editing || (form.title === "" && posts.length >= 0 && false)) && null}
      {modalOpen && <EditorModal form={form} editing={editing} loading={loading} uploading={uploading} setField={setField} uploadCover={uploadCover} onClose={() => setModalOpen(false)} onSubmit={submit} />}
    </>
  );
}

function EditorModal({ form, editing, loading, uploading, setField, uploadCover, onClose, onSubmit }: {
  form: typeof emptyPost; editing: Post | null; loading: boolean; uploading: boolean;
  setField: (field: keyof typeof emptyPost, value: string | number | boolean) => void;
  uploadCover: (file: File) => Promise<void>; onClose: () => void; onSubmit: (event: React.FormEvent) => Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={onSubmit} className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="font-bold text-gray-900">{editing ? "Editar artículo" : "Nuevo artículo"}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="grid gap-4 overflow-y-auto px-6 py-5 sm:grid-cols-2">
          <label className="space-y-1 sm:col-span-2"><span className="text-xs font-semibold uppercase text-gray-600">Título *</span><input required className={inputClass} value={form.title} onChange={e => setField("title", e.target.value)} /></label>
          <label className="space-y-1"><span className="text-xs font-semibold uppercase text-gray-600">Slug *</span><input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" className={inputClass} value={form.slug} onChange={e => setField("slug", e.target.value)} placeholder="mi-nuevo-articulo" /></label>
          <label className="space-y-1"><span className="text-xs font-semibold uppercase text-gray-600">Categoría *</span><input required className={inputClass} value={form.category} onChange={e => setField("category", e.target.value)} /></label>
          <label className="space-y-1"><span className="text-xs font-semibold uppercase text-gray-600">Fecha *</span><input required type="date" className={inputClass} value={form.date} onChange={e => setField("date", e.target.value)} /></label>
          <label className="space-y-1"><span className="text-xs font-semibold uppercase text-gray-600">Minutos de lectura *</span><input required min={1} max={120} type="number" className={inputClass} value={form.readTime} onChange={e => setField("readTime", Number(e.target.value))} /></label>
          <label className="space-y-1 sm:col-span-2"><span className="text-xs font-semibold uppercase text-gray-600">Extracto *</span><textarea required rows={2} className={inputClass} value={form.excerpt} onChange={e => setField("excerpt", e.target.value)} /></label>
          <label className="space-y-1 sm:col-span-2"><span className="text-xs font-semibold uppercase text-gray-600">Contenido HTML *</span><textarea required rows={12} className={`${inputClass} font-mono text-xs`} value={form.content} onChange={e => setField("content", e.target.value)} placeholder="<p>Escribe el contenido del artículo...</p>" /></label>
          <div className="space-y-2 sm:col-span-2">
            <span className="block text-xs font-semibold uppercase text-gray-600">Portada</span>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-2.5 text-sm text-gray-600 hover:border-primary-400">
                <ImagePlus size={16} /> {uploading ? "Subiendo..." : "Subir imagen"}
                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={e => { const file = e.target.files?.[0]; if (file) void uploadCover(file); }} />
              </label>
              {form.coverImage && <img src={form.coverImage} alt="Vista previa" className="h-12 w-20 rounded-lg object-cover" />}
            </div>
            <input className={inputClass} value={form.coverImage} onChange={e => setField("coverImage", e.target.value)} placeholder="O pega aquí la URL de la portada" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2"><input type="checkbox" checked={form.isPublished} onChange={e => setField("isPublished", e.target.checked)} /> Publicar en el blog</label>
        </div>
        <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600">Cancelar</button>
          <button disabled={loading || uploading} className="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{loading ? "Guardando..." : editing ? "Guardar cambios" : "Publicar artículo"}</button>
        </div>
      </form>
    </div>
  );
}
