"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Info, DollarSign, Tag, Settings, Image, Search, Eye, Plus, Trash2, Wind, Flame, Droplets, Wifi, Home, Zap, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { createProduct, updateProduct } from "@/app/[locale]/(dashboard)/admin/products/actions";
import type {
  ProductFormData, ProductType, PageLocation, StockStatus,
  AcSpecs, BoilerSpecs, AerothermalSpecs,
} from "@/types/product";
import { DEFAULT_AC_SPECS, DEFAULT_BOILER_SPECS, DEFAULT_AEROTHERMAL_SPECS, PAGE_LOCATION_DEFAULT } from "@/types/product";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = "info" | "pricing" | "commercial" | "technical" | "media" | "seo" | "preview";

interface CategoryRow { id: string; name: string; slug: string; }
interface ProductRow {
  id: string; name: string; description: string; shortDescription: string | null;
  category: string; categoryId: string | null; manufacturer: string | null; brand: string | null;
  modelNumber: string | null; price: any; discountPrice: any; stock: number;
  stockStatus: string | null; warranty: string | null; isActive: boolean; isFeatured: boolean;
  images: string[]; specifications: string | null; sku: string; series: string | null;
  productType: string | null; pageLocation: string | null; ivaIncluded: boolean;
  installationIncluded: boolean; commercialTags: string[]; technicalPdf: string | null;
  seoTitle: string | null; seoDescription: string | null;
}

interface Props {
  initial?: ProductRow | null;
  categories: CategoryRow[];
  onClose: () => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_FORM: ProductFormData = {
  productType: "air_conditioning", pageLocation: "oferta",
  isActive: true, isFeatured: false,
  commercialName: "", brand: "", model: "", sku: "", series: "", category: "", categoryId: "",
  shortDescription: "", longDescription: "",
  price: "", discountPrice: "",
  ivaIncluded: true, installationIncluded: false,
  stockStatus: "in_stock", stockQuantity: "0", warranty: "",
  mainImage: "", galleryImages: [], technicalPdf: "", commercialTags: [],
  seoTitle: "", seoDescription: "",
  acSpecs: { ...DEFAULT_AC_SPECS },
  boilerSpecs: { ...DEFAULT_BOILER_SPECS },
  aerothermalSpecs: { ...DEFAULT_AEROTHERMAL_SPECS },
};

function productToForm(p: ProductRow): ProductFormData {
  let acSpecs = { ...DEFAULT_AC_SPECS };
  let boilerSpecs = { ...DEFAULT_BOILER_SPECS };
  let aerothermalSpecs = { ...DEFAULT_AEROTHERMAL_SPECS };
  try {
    const specs = JSON.parse(p.specifications ?? "{}");
    if (p.productType === "air_conditioning") acSpecs = { ...acSpecs, ...specs };
    else if (p.productType === "boiler") boilerSpecs = { ...boilerSpecs, ...specs };
    else if (p.productType === "aerothermal") aerothermalSpecs = { ...aerothermalSpecs, ...specs };
  } catch {}
  return {
    productType: (p.productType as ProductType) ?? "air_conditioning",
    pageLocation: (p.pageLocation as PageLocation) ?? "oferta",
    isActive: p.isActive, isFeatured: p.isFeatured ?? false,
    commercialName: p.name, brand: p.brand ?? p.manufacturer ?? "",
    model: p.modelNumber ?? "", sku: p.sku, series: p.series ?? "",
    category: p.category, categoryId: p.categoryId ?? "",
    shortDescription: p.shortDescription ?? "", longDescription: p.description,
    price: String(Number(p.price)), discountPrice: p.discountPrice ? String(Number(p.discountPrice)) : "",
    ivaIncluded: p.ivaIncluded ?? true, installationIncluded: p.installationIncluded ?? false,
    stockStatus: (p.stockStatus as StockStatus) ?? "in_stock",
    stockQuantity: String(p.stock ?? 0), warranty: p.warranty ?? "",
    mainImage: p.images?.[0] ?? "", galleryImages: p.images?.slice(1) ?? [],
    technicalPdf: p.technicalPdf ?? "", commercialTags: p.commercialTags ?? [],
    seoTitle: p.seoTitle ?? "", seoDescription: p.seoDescription ?? "",
    acSpecs, boilerSpecs, aerothermalSpecs,
  };
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 transition-colors bg-white";
const selectCls = inputCls + " cursor-pointer";

function Field({ label, helper, required, children, span2 }: {
  label: string; helper?: string; required?: boolean; children: React.ReactNode; span2?: boolean;
}) {
  return (
    <div className={span2 ? "col-span-2" : ""}>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {helper && <p className="text-[11px] text-gray-400 mt-1 leading-snug">{helper}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-3">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${checked ? "bg-primary-500" : "bg-gray-200"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
  );
}

function NumInput({ value, onChange, placeholder, min = "0", step = "0.01" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; min?: string; step?: string;
}) {
  return (
    <input type="number" min={min} step={step} className={inputCls} value={value}
      onChange={e => onChange(e.target.value)} placeholder={placeholder} />
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "info",       label: "Principal",  icon: <Info size={12} /> },
  { id: "pricing",    label: "Precio",     icon: <DollarSign size={12} /> },
  { id: "commercial", label: "Comercial",  icon: <Tag size={12} /> },
  { id: "technical",  label: "Técnico",    icon: <Settings size={12} /> },
  { id: "media",      label: "Imágenes",   icon: <Image size={12} /> },
  { id: "seo",        label: "SEO",        icon: <Search size={12} /> },
  { id: "preview",    label: "Vista Previa", icon: <Eye size={12} /> },
];

// ─── Main component ───────────────────────────────────────────────────────────

export function ProductFormModal({ initial, categories, onClose }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("info");
  const [form, setForm] = useState<ProductFormData>(initial ? productToForm(initial) : { ...DEFAULT_FORM });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onCloseRef.current(); };
    document.addEventListener("keydown", handle);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handle); document.body.style.overflow = ""; };
  }, []);

  const set = useCallback(<K extends keyof ProductFormData>(key: K, val: ProductFormData[K]) => {
    setForm(f => ({ ...f, [key]: val }));
  }, []);

  const setAc = useCallback((patch: Partial<AcSpecs>) => {
    setForm(f => ({ ...f, acSpecs: { ...f.acSpecs, ...patch } }));
  }, []);
  const setBoiler = useCallback((patch: Partial<BoilerSpecs>) => {
    setForm(f => ({ ...f, boilerSpecs: { ...f.boilerSpecs, ...patch } }));
  }, []);
  const setAero = useCallback((patch: Partial<AerothermalSpecs>) => {
    setForm(f => ({ ...f, aerothermalSpecs: { ...f.aerothermalSpecs, ...patch } }));
  }, []);

  function onTypeChange(t: ProductType) {
    setForm(f => ({ ...f, productType: t, pageLocation: PAGE_LOCATION_DEFAULT[t] }));
  }

  function addTag(raw: string) {
    const tag = raw.trim();
    if (tag && !form.commercialTags.includes(tag)) {
      set("commercialTags", [...form.commercialTags, tag]);
    }
    setTagInput("");
  }

  function validate(): string[] {
    const e: string[] = [];
    if (!form.commercialName.trim()) e.push("El nombre comercial es obligatorio.");
    if (!form.brand.trim()) e.push("La marca es obligatoria.");
    if (!form.category.trim()) e.push("La categoría es obligatoria.");
    if (!form.shortDescription.trim()) e.push("La descripción corta es obligatoria.");
    if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) e.push("El precio debe ser mayor que 0.");
    if (form.discountPrice && parseFloat(form.discountPrice) >= parseFloat(form.price)) e.push("El precio de oferta debe ser menor que el precio normal.");
    return e;
  }

  async function handleSubmit() {
    const errs = validate();
    if (errs.length > 0) { setErrors(errs); setActiveTab("info"); return; }
    setErrors([]);
    setLoading(true);

    let typeSpecs: Record<string, any> = {};
    if (form.productType === "air_conditioning") typeSpecs = { ...form.acSpecs };
    else if (form.productType === "boiler") typeSpecs = { ...form.boilerSpecs };
    else typeSpecs = { ...form.aerothermalSpecs };

    const images = [form.mainImage, ...form.galleryImages].filter(Boolean);

    const data = {
      name: form.commercialName.trim(),
      description: form.longDescription.trim() || form.shortDescription.trim(),
      shortDescription: form.shortDescription.trim(),
      category: form.category,
      categoryId: form.categoryId || undefined,
      manufacturer: form.brand,
      brand: form.brand,
      modelNumber: form.model,
      series: form.series,
      price: parseFloat(form.price),
      discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : undefined,
      stock: form.stockStatus === "in_stock" ? (parseInt(form.stockQuantity) || 0) : 0,
      stockStatus: form.stockStatus,
      warranty: form.warranty || undefined,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      productType: form.productType,
      pageLocation: form.pageLocation,
      ivaIncluded: form.ivaIncluded,
      installationIncluded: form.installationIncluded,
      imageUrl: images[0] || undefined,
      images,
      specifications: JSON.stringify(typeSpecs),
      commercialTags: form.commercialTags,
      technicalPdf: form.technicalPdf || undefined,
      seoTitle: form.seoTitle || undefined,
      seoDescription: form.seoDescription || undefined,
      sku: form.sku || undefined,
    };

    try {
      if (initial?.id) await updateProduct(initial.id, data);
      else await createProduct(data);
      toast.success("Producto guardado correctamente.");
      onClose();
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message ?? "Error al guardar el producto.");
    } finally { setLoading(false); }
  }

  // ─── Tab renders ─────────────────────────────────────────────────────────────

  function InfoTab() {
    return (
      <div className="space-y-4">
        {/* Product type */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Tipo de producto *</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { val: "air_conditioning" as ProductType, label: "Aire Acondicionado", icon: <Wind size={20} /> },
              { val: "boiler" as ProductType, label: "Caldera", icon: <Flame size={20} /> },
              { val: "aerothermal" as ProductType, label: "Aerotermia", icon: <Droplets size={20} /> },
            ]).map(({ val, label, icon }) => (
              <button
                key={val} type="button"
                onClick={() => onTypeChange(val)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                  form.productType === val
                    ? "border-primary-400 bg-primary-50 text-primary-700 shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-primary-200"
                }`}
              >
                <span className={form.productType === val ? "text-primary-600" : "text-gray-400"}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        <Section title="Publicación">
          <Field label="Página donde aparece" required>
            <select className={selectCls} value={form.pageLocation} onChange={e => set("pageLocation", e.target.value as PageLocation)}>
              <option value="oferta">Oferta / Catálogo</option>
              <option value="calderas">Calderas</option>
              <option value="aerotermia">Aerotermia</option>
            </select>
          </Field>
          <div className="flex flex-col gap-2 pt-1">
            <Toggle label="Activo (visible en la web)" checked={form.isActive} onChange={v => set("isActive", v)} />
            <Toggle label="Destacado (aparece primero)" checked={form.isFeatured} onChange={v => set("isFeatured", v)} />
          </div>
        </Section>

        <Section title="Identificación del producto">
          <Field label="Nombre comercial" required span2>
            <input className={inputCls} value={form.commercialName}
              onChange={e => set("commercialName", e.target.value)}
              placeholder="Ej. Mitsubishi Heavy Conductos Smart 100, 10 kW" />
          </Field>
          <Field label="Marca" required>
            <input className={inputCls} value={form.brand} onChange={e => set("brand", e.target.value)} placeholder="Ej. Mitsubishi Heavy Industries" />
          </Field>
          <Field label="Modelo / Referencia">
            <input className={inputCls} value={form.model} onChange={e => set("model", e.target.value)} placeholder="Ej. FDUM100VHNP-W" />
          </Field>
          <Field label="SKU interno">
            <input className={inputCls} value={form.sku} onChange={e => set("sku", e.target.value)} placeholder="Ej. CL39027" />
          </Field>
          <Field label="Serie / Gama">
            <input className={inputCls} value={form.series} onChange={e => set("series", e.target.value)} placeholder="Ej. Smart" />
          </Field>
          <Field label="Categoría" required>
            <select className={selectCls} value={form.categoryId}
              onChange={e => {
                const cat = categories.find(c => c.id === e.target.value);
                setForm(f => ({ ...f, categoryId: e.target.value, category: cat?.slug ?? "" }));
              }}
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
        </Section>
      </div>
    );
  }

  function PricingTab() {
    return (
      <div className="space-y-4">
        <Section title="Precios">
          <Field label="Precio normal (€)" required>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
              <input type="number" min="0" step="0.01" className={`${inputCls} pl-7`} value={form.price}
                onChange={e => set("price", e.target.value)} placeholder="5400.00" />
            </div>
          </Field>
          <Field label="Precio de oferta (€)" helper="Deja vacío si no hay oferta">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
              <input type="number" min="0" step="0.01" className={`${inputCls} pl-7`} value={form.discountPrice}
                onChange={e => set("discountPrice", e.target.value)} placeholder="5000.00" />
            </div>
          </Field>
          <div className="flex flex-col gap-2 col-span-2 pt-1">
            <Toggle label="IVA incluido en el precio" checked={form.ivaIncluded} onChange={v => set("ivaIncluded", v)} />
            <Toggle label="Instalación incluida en el precio" checked={form.installationIncluded} onChange={v => set("installationIncluded", v)} />
          </div>
        </Section>

        <Section title="Stock y disponibilidad">
          <Field label="Estado de stock" required>
            <select className={selectCls} value={form.stockStatus} onChange={e => set("stockStatus", e.target.value as StockStatus)}>
              <option value="in_stock">En stock</option>
              <option value="on_request">Bajo pedido</option>
              <option value="consult">Consultar disponibilidad</option>
            </select>
          </Field>
          {form.stockStatus === "in_stock" && (
            <Field label="Unidades en stock">
              <NumInput value={form.stockQuantity} onChange={v => set("stockQuantity", v)} step="1" placeholder="10" />
            </Field>
          )}
          <Field label="Garantía" span2>
            <input className={inputCls} value={form.warranty} onChange={e => set("warranty", e.target.value)} placeholder="Ej. 3 años oficial fabricante" />
          </Field>
        </Section>
      </div>
    );
  }

  function CommercialTab() {
    return (
      <div className="space-y-4">
        <Section title="Descripciones para el cliente">
          <Field label="Descripción corta" required span2
            helper="Máx. 200 caracteres. Se muestra en la tarjeta del producto.">
            <textarea rows={2} className={`${inputCls} resize-none`} value={form.shortDescription} maxLength={200}
              onChange={e => set("shortDescription", e.target.value)}
              placeholder="Ej. Aire acondicionado por conductos Inverter de 10 kW con bomba de calor." />
            <p className="text-[11px] text-gray-400 text-right">{form.shortDescription.length}/200</p>
          </Field>
          <Field label="Descripción completa" span2>
            <textarea rows={5} className={`${inputCls} resize-y`} value={form.longDescription}
              onChange={e => set("longDescription", e.target.value)}
              placeholder="Descripción detallada para la página del producto..." />
          </Field>
        </Section>

        <Section title="Etiquetas comerciales">
          <div className="col-span-2">
            <div className="flex flex-wrap gap-1.5 mb-2 min-h-[32px]">
              {form.commercialTags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-lg">
                  {tag}
                  <button type="button" onClick={() => set("commercialTags", form.commercialTags.filter(t => t !== tag))}
                    className="text-primary-400 hover:text-primary-700">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input className={inputCls} value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); } }}
                placeholder="Ej. Inverter (Enter para añadir)" />
              <button type="button" onClick={() => addTag(tagInput)}
                className="px-3 py-2 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors">
                <Plus size={16} />
              </button>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  function TechnicalTab() {
    if (form.productType === "air_conditioning") return <AcTechnicalTab />;
    if (form.productType === "boiler") return <BoilerTechnicalTab />;
    return <AeroTechnicalTab />;
  }

  function AcTechnicalTab() {
    const ac = form.acSpecs;
    return (
      <div className="space-y-4">
        <Section title="Tipo e instalación">
          <Field label="Tipo de instalación" required>
            <select className={selectCls} value={ac.installationType} onChange={e => setAc({ installationType: e.target.value as any })}>
              <option value="split">Split 1x1</option>
              <option value="conductos">Por conductos</option>
              <option value="cassette">Cassette</option>
              <option value="multisplit">Multi-Split</option>
              <option value="suelo_techo">Suelo-techo</option>
            </select>
          </Field>
          <Field label="Tecnología">
            <input className={inputCls} value={ac.technology} onChange={e => setAc({ technology: e.target.value })} placeholder="Inverter" />
          </Field>
          <Field label="Composición del equipo">
            <input className={inputCls} value={ac.composition} onChange={e => setAc({ composition: e.target.value })} placeholder="Equipo 1x1" />
          </Field>
          <Field label="Refrigerante">
            <input className={inputCls} value={ac.refrigerant} onChange={e => setAc({ refrigerant: e.target.value })} placeholder="R32" />
          </Field>
        </Section>

        <Section title="Unidades">
          <Field label="Unidad interior (ref.)">
            <input className={inputCls} value={ac.indoorUnit} onChange={e => setAc({ indoorUnit: e.target.value })} placeholder="FDUM100VH" />
          </Field>
          <Field label="Unidad exterior (ref.)">
            <input className={inputCls} value={ac.outdoorUnit} onChange={e => setAc({ outdoorUnit: e.target.value })} placeholder="FDC100VNP-W" />
          </Field>
        </Section>

        <Section title="Potencia y superficie">
          <Field label="Potencia frío (kW)" helper="Capacidad en kW, no eficiencia">
            <NumInput value={String(ac.coolingCapacityKw ?? "")} onChange={v => setAc({ coolingCapacityKw: parseFloat(v) || 0 })} placeholder="10.0" />
          </Field>
          <Field label="Potencia calor (kW)">
            <NumInput value={String(ac.heatingCapacityKw ?? "")} onChange={v => setAc({ heatingCapacityKw: parseFloat(v) || 0 })} placeholder="10.0" />
          </Field>
          <Field label="Superficie mín. recomendada (m²)" helper="Orientativo según aislamiento">
            <NumInput value={String(ac.recommendedAreaMin ?? "")} onChange={v => setAc({ recommendedAreaMin: parseFloat(v) || null })} step="1" placeholder="100" />
          </Field>
          <Field label="Superficie máx. recomendada (m²)">
            <NumInput value={String(ac.recommendedAreaMax ?? "")} onChange={v => setAc({ recommendedAreaMax: parseFloat(v) || null })} step="1" placeholder="140" />
          </Field>
        </Section>

        <Section title="Eficiencia energética">
          <Field label="Etiqueta energética frío" helper="Ej. A++, A+">
            <input className={inputCls} value={ac.energyLabelCooling} onChange={e => setAc({ energyLabelCooling: e.target.value })} placeholder="A++" />
          </Field>
          <Field label="Etiqueta energética calor">
            <input className={inputCls} value={ac.energyLabelHeating} onChange={e => setAc({ energyLabelHeating: e.target.value })} placeholder="A+" />
          </Field>
          <Field label="SEER (eficiencia estacional frío)">
            <NumInput value={String(ac.seer ?? "")} onChange={v => setAc({ seer: parseFloat(v) || null })} placeholder="6.11" />
          </Field>
          <Field label="SCOP (eficiencia estacional calor)">
            <NumInput value={String(ac.scop ?? "")} onChange={v => setAc({ scop: parseFloat(v) || null })} placeholder="4.13" />
          </Field>
        </Section>

        <Section title="Confort y conectividad">
          <Field label="Ruido mínimo interior (dB)" helper="Nivel en funcionamiento mínimo">
            <NumInput value={String(ac.minNoiseDb ?? "")} onChange={v => setAc({ minNoiseDb: parseFloat(v) || null })} step="1" placeholder="30" />
          </Field>
          <Field label="WiFi">
            <select className={selectCls} value={ac.wifiStatus} onChange={e => setAc({ wifiStatus: e.target.value as any })}>
              <option value="included">Incluido</option>
              <option value="optional">Opcional (accesorio adicional)</option>
              <option value="not_included">No incluido</option>
            </select>
          </Field>
          <Field label="Mando / Control incluido">
            <input className={inputCls} value={ac.includedController ?? ""} onChange={e => setAc({ includedController: e.target.value || null })} placeholder="RC-EX3A" />
          </Field>
          <Field label="Presión estática">
            <input className={inputCls} value={ac.staticPressure ?? ""} onChange={e => setAc({ staticPressure: e.target.value || null })} placeholder="60 Pa estándar / 100 Pa máx." />
          </Field>
        </Section>

        <Section title="Dimensiones y pesos (opcional)">
          <Field label="Dimensiones unidad interior">
            <input className={inputCls} value={ac.indoorDimensions ?? ""} onChange={e => setAc({ indoorDimensions: e.target.value || null })} placeholder="280 x 1370 x 740 mm" />
          </Field>
          <Field label="Dimensiones unidad exterior">
            <input className={inputCls} value={ac.outdoorDimensions ?? ""} onChange={e => setAc({ outdoorDimensions: e.target.value || null })} placeholder="750 x 880 x 340 mm" />
          </Field>
          <Field label="Peso interior / exterior" span2>
            <input className={inputCls} value={ac.indoorOutdoorWeight ?? ""} onChange={e => setAc({ indoorOutdoorWeight: e.target.value || null })} placeholder="54 / 57 kg" />
          </Field>
        </Section>
      </div>
    );
  }

  function BoilerTechnicalTab() {
    const b = form.boilerSpecs;
    const toggleUseType = (val: string) => {
      const arr = b.useType.includes(val) ? b.useType.filter(x => x !== val) : [...b.useType, val];
      setBoiler({ useType: arr });
    };
    return (
      <div className="space-y-4">
        <Section title="Tipo de caldera">
          <Field label="Tipo de caldera" required>
            <select className={selectCls} value={b.boilerType} onChange={e => setBoiler({ boilerType: e.target.value as any })}>
              <option value="condensacion">Condensación</option>
              <option value="bajo_nox">Bajo NOx</option>
              <option value="estanca">Estanca</option>
              <option value="gasoil">Gasoil</option>
              <option value="otra">Otra</option>
            </select>
          </Field>
          <Field label="Combustible" required>
            <select className={selectCls} value={b.fuelType} onChange={e => setBoiler({ fuelType: e.target.value as any })}>
              <option value="gas_natural">Gas natural</option>
              <option value="propano">Propano</option>
              <option value="gasoil">Gasóleo</option>
              <option value="electrica">Eléctrica</option>
            </select>
          </Field>
          <Field label="Instalación">
            <select className={selectCls} value={b.installationType} onChange={e => setBoiler({ installationType: e.target.value as any })}>
              <option value="mural">Mural (pared)</option>
              <option value="suelo">Suelo</option>
            </select>
          </Field>
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Uso</p>
            {["calefaccion", "acs"].map(v => (
              <label key={v} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={b.useType.includes(v)} onChange={() => toggleUseType(v)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 accent-primary-600" />
                <span className="text-sm text-gray-700">{v === "calefaccion" ? "Calefacción" : "ACS (agua caliente)"}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section title="Potencias">
          <Field label="Potencia calefacción (kW)" required>
            <NumInput value={String(b.heatingPowerKw ?? "")} onChange={v => setBoiler({ heatingPowerKw: parseFloat(v) || 0 })} placeholder="24" />
          </Field>
          <Field label="Potencia ACS (kW)">
            <NumInput value={String(b.dhwPowerKw ?? "")} onChange={v => setBoiler({ dhwPowerKw: parseFloat(v) || null })} placeholder="28" />
          </Field>
          <Field label="Caudal ACS (l/min)">
            <input className={inputCls} value={b.dhwFlowRate ?? ""} onChange={e => setBoiler({ dhwFlowRate: e.target.value || null })} placeholder="14 l/min" />
          </Field>
          <Field label="Perfil ACS">
            <input className={inputCls} value={b.dhwProfile ?? ""} onChange={e => setBoiler({ dhwProfile: e.target.value || null })} placeholder="XL" />
          </Field>
        </Section>

        <Section title="Eficiencia y etiquetas">
          <Field label="Etiqueta energética calefacción">
            <input className={inputCls} value={b.energyLabelHeating ?? ""} onChange={e => setBoiler({ energyLabelHeating: e.target.value || null })} placeholder="A" />
          </Field>
          <Field label="Etiqueta energética ACS">
            <input className={inputCls} value={b.energyLabelDhw ?? ""} onChange={e => setBoiler({ energyLabelDhw: e.target.value || null })} placeholder="A" />
          </Field>
          <Field label="Eficiencia (%)">
            <input className={inputCls} value={b.efficiency ?? ""} onChange={e => setBoiler({ efficiency: e.target.value || null })} placeholder="109%" />
          </Field>
          <Field label="Clase NOx">
            <input className={inputCls} value={b.noxClass ?? ""} onChange={e => setBoiler({ noxClass: e.target.value || null })} placeholder="6" />
          </Field>
        </Section>

        <Section title="Accesorios y dimensiones">
          <Field label="Termostato">
            <select className={selectCls} value={b.thermostatCompatibility} onChange={e => setBoiler({ thermostatCompatibility: e.target.value as any })}>
              <option value="included">Incluido</option>
              <option value="optional">Compatible (opcional)</option>
              <option value="not_included">No compatible</option>
            </select>
          </Field>
          <div className="flex flex-col gap-2 pt-1">
            <Toggle label="Kit de evacuación incluido" checked={b.flueKitIncluded} onChange={v => setBoiler({ flueKitIncluded: v })} />
          </div>
          <Field label="Dimensiones" span2>
            <input className={inputCls} value={b.dimensions ?? ""} onChange={e => setBoiler({ dimensions: e.target.value || null })} placeholder="400 x 700 x 350 mm" />
          </Field>
        </Section>
      </div>
    );
  }

  function AeroTechnicalTab() {
    const a = form.aerothermalSpecs;
    const toggleFn = (val: string) => {
      const arr = a.functions.includes(val) ? a.functions.filter(x => x !== val) : [...a.functions, val];
      setAero({ functions: arr });
    };
    return (
      <div className="space-y-4">
        <Section title="Sistema y funciones">
          <Field label="Tipo de sistema" required>
            <select className={selectCls} value={a.systemType} onChange={e => setAero({ systemType: e.target.value as any })}>
              <option value="monobloc">Monobloc (todo exterior)</option>
              <option value="bibloc">Bíbloc (interior + exterior)</option>
              <option value="todo_en_uno">Todo en uno</option>
            </select>
          </Field>
          <Field label="Alimentación eléctrica">
            <select className={selectCls} value={a.powerSupply} onChange={e => setAero({ powerSupply: e.target.value as any })}>
              <option value="monofasica">Monofásica 230V</option>
              <option value="trifasica">Trifásica 400V</option>
              <option value="no_especificado">No especificado</option>
            </select>
          </Field>
          <div className="col-span-2 flex gap-4">
            {["calefaccion", "refrigeracion", "acs"].map(v => (
              <label key={v} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={a.functions.includes(v)} onChange={() => toggleFn(v)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 accent-primary-600" />
                <span className="text-sm text-gray-700">{v === "calefaccion" ? "Calefacción" : v === "refrigeracion" ? "Refrigeración" : "ACS"}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section title="Potencias y capacidades">
          <Field label="Potencia calefacción (kW)" required>
            <NumInput value={String(a.heatingCapacityKw ?? "")} onChange={v => setAero({ heatingCapacityKw: parseFloat(v) || 0 })} placeholder="12" />
          </Field>
          <Field label="Potencia refrigeración (kW)">
            <NumInput value={String(a.coolingCapacityKw ?? "")} onChange={v => setAero({ coolingCapacityKw: parseFloat(v) || null })} placeholder="10" />
          </Field>
          <Field label="Depósito ACS integrado (litros)">
            <NumInput value={String(a.tankLiters ?? "")} onChange={v => setAero({ tankLiters: parseFloat(v) || null })} step="1" placeholder="180" />
          </Field>
          <Field label="Temperatura máx. impulsión">
            <input className={inputCls} value={a.maxFlowTemperature ?? ""} onChange={e => setAero({ maxFlowTemperature: e.target.value || null })} placeholder="60°C" />
          </Field>
          <Field label="Superficie mín. recomendada (m²)">
            <NumInput value={String(a.recommendedAreaMin ?? "")} onChange={v => setAero({ recommendedAreaMin: parseFloat(v) || null })} step="1" placeholder="100" />
          </Field>
          <Field label="Superficie máx. recomendada (m²)">
            <NumInput value={String(a.recommendedAreaMax ?? "")} onChange={v => setAero({ recommendedAreaMax: parseFloat(v) || null })} step="1" placeholder="200" />
          </Field>
        </Section>

        <Section title="Eficiencia y nivel sonoro">
          <Field label="COP (rendimiento agua caliente)">
            <NumInput value={String(a.cop ?? "")} onChange={v => setAero({ cop: parseFloat(v) || null })} placeholder="4.5" />
          </Field>
          <Field label="SCOP (estacional calefacción)">
            <NumInput value={String(a.scop ?? "")} onChange={v => setAero({ scop: parseFloat(v) || null })} placeholder="4.0" />
          </Field>
          <Field label="Etiqueta energética">
            <input className={inputCls} value={a.energyLabel ?? ""} onChange={e => setAero({ energyLabel: e.target.value || null })} placeholder="A+++" />
          </Field>
          <Field label="Refrigerante">
            <input className={inputCls} value={a.refrigerant ?? ""} onChange={e => setAero({ refrigerant: e.target.value || null })} placeholder="R32" />
          </Field>
          <Field label="Ruido mínimo (dB)">
            <NumInput value={String(a.minNoiseDb ?? "")} onChange={v => setAero({ minNoiseDb: parseFloat(v) || null })} step="1" placeholder="38" />
          </Field>
        </Section>

        <Section title="Compatibilidad de emisores">
          <Field label="Suelo radiante">
            <div className="pt-1"><Toggle label="Compatible" checked={a.compatibleUnderfloorHeating} onChange={v => setAero({ compatibleUnderfloorHeating: v })} /></div>
          </Field>
          <Field label="Radiadores">
            <select className={selectCls} value={a.compatibleRadiators} onChange={e => setAero({ compatibleRadiators: e.target.value as any })}>
              <option value="yes">Sí, directamente</option>
              <option value="depends">Depende del tipo</option>
              <option value="no">No compatible</option>
            </select>
          </Field>
          <Field label="Fan-coils">
            <div className="pt-1"><Toggle label="Compatible" checked={a.compatibleFanCoils} onChange={v => setAero({ compatibleFanCoils: v })} /></div>
          </Field>
        </Section>
      </div>
    );
  }

  function MediaTab() {
    return (
      <div className="space-y-4">
        <Section title="Imagen principal">
          <div className="col-span-2 flex gap-3 items-start">
            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
              {form.mainImage
                ? <img src={form.mainImage} alt="" className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                : <Wind size={28} className="text-gray-200" />}
            </div>
            <div className="flex-1">
              <input className={inputCls} value={form.mainImage} onChange={e => set("mainImage", e.target.value)}
                placeholder="https://... URL de imagen principal" />
              <p className="text-[11px] text-gray-400 mt-1">Pega la URL directa de la imagen (JPG, PNG, WebP).</p>
            </div>
          </div>
        </Section>

        <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Galería de imágenes adicionales</p>
          {form.galleryImages.map((url, i) => (
            <div key={i} className="flex gap-2">
              <input className={inputCls} value={url} onChange={e => {
                const arr = [...form.galleryImages]; arr[i] = e.target.value; set("galleryImages", arr);
              }} placeholder={`Imagen ${i + 2}: https://...`} />
              <button type="button" onClick={() => set("galleryImages", form.galleryImages.filter((_, j) => j !== i))}
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          <button type="button"
            onClick={() => set("galleryImages", [...form.galleryImages, ""])}
            className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium px-1">
            <Plus size={14} /> Añadir imagen
          </button>
        </div>

        <Section title="Documentos">
          <Field label="PDF ficha técnica (URL)" span2>
            <input className={inputCls} value={form.technicalPdf} onChange={e => set("technicalPdf", e.target.value)}
              placeholder="https://... URL del PDF" />
          </Field>
        </Section>
      </div>
    );
  }

  function SeoTab() {
    const autoTitle = form.commercialName ? `${form.commercialName} | Clima HVAC Service` : "";
    const autoDesc = form.shortDescription || "";
    return (
      <div className="space-y-4">
        <Section title="SEO para buscadores">
          <Field label="Título SEO" span2 helper="Aparece en Google como título del resultado. Máx. 60 caracteres.">
            <input className={inputCls} value={form.seoTitle} onChange={e => set("seoTitle", e.target.value)}
              placeholder={autoTitle} maxLength={70} />
            {!form.seoTitle && autoTitle && (
              <button type="button" className="text-[11px] text-primary-500 hover:text-primary-700 mt-1"
                onClick={() => set("seoTitle", autoTitle)}>
                Usar automático: &ldquo;{autoTitle.slice(0, 60)}...&rdquo;
              </button>
            )}
          </Field>
          <Field label="Meta descripción" span2 helper="Aparece bajo el título en Google. Máx. 155 caracteres.">
            <textarea rows={3} className={`${inputCls} resize-none`} value={form.seoDescription}
              onChange={e => set("seoDescription", e.target.value)} placeholder={autoDesc} maxLength={160} />
            <p className="text-[11px] text-gray-400 text-right">{form.seoDescription.length}/155</p>
            {!form.seoDescription && autoDesc && (
              <button type="button" className="text-[11px] text-primary-500 hover:text-primary-700"
                onClick={() => set("seoDescription", autoDesc)}>
                Usar descripción corta
              </button>
            )}
          </Field>
        </Section>
      </div>
    );
  }

  function PreviewTab() {
    const price = parseFloat(form.price) || 0;
    const discount = parseFloat(form.discountPrice) || null;
    const displayPrice = discount && discount < price ? discount : price;
    const ac = form.acSpecs;
    const boiler = form.boilerSpecs;
    const aero = form.aerothermalSpecs;

    const badges: string[] = [];
    if (form.productType === "air_conditioning") {
      if (ac.coolingCapacityKw) badges.push(`${ac.coolingCapacityKw} kW`);
      if (ac.recommendedAreaMin && ac.recommendedAreaMax) badges.push(`${ac.recommendedAreaMin}–${ac.recommendedAreaMax} m²`);
      if (ac.energyLabelCooling) badges.push(ac.energyLabelHeating ? `${ac.energyLabelCooling} / ${ac.energyLabelHeating}` : ac.energyLabelCooling);
      if (ac.minNoiseDb) badges.push(`Desde ${ac.minNoiseDb} dB`);
      if (ac.wifiStatus !== "not_included") badges.push(ac.wifiStatus === "included" ? "WiFi incluido" : "WiFi opcional");
    } else if (form.productType === "boiler") {
      if (boiler.heatingPowerKw) badges.push(`${boiler.heatingPowerKw} kW`);
      const fuel: Record<string, string> = { gas_natural: "Gas natural", propano: "Propano", gasoil: "Gasóleo", electrica: "Eléctrica" };
      if (fuel[boiler.fuelType]) badges.push(fuel[boiler.fuelType]);
      if (boiler.energyLabelHeating) badges.push(`Clase ${boiler.energyLabelHeating}`);
    } else {
      if (aero.heatingCapacityKw) badges.push(`${aero.heatingCapacityKw} kW`);
      if (aero.functions.includes("refrigeracion")) badges.push("Frío + Calor");
      if (aero.tankLiters) badges.push(`Depósito ${aero.tankLiters} L`);
      if (aero.scop) badges.push(`SCOP ${aero.scop}`);
      if (aero.energyLabel) badges.push(aero.energyLabel);
    }

    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-400 text-center">Así se verá la tarjeta del producto en la web</p>
        <div className="max-w-xs mx-auto bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="bg-gray-50 h-40 flex items-center justify-center border-b border-gray-100">
            {form.mainImage
              ? <img src={form.mainImage} alt="" className="h-32 object-contain" />
              : <Wind size={48} className="text-gray-200" />}
          </div>
          <div className="p-4">
            {form.brand && <p className="text-xs text-gray-400 font-medium mb-0.5">{form.brand}</p>}
            <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 mb-2">
              {form.commercialName || "Nombre del producto"}
            </h3>
            {form.shortDescription && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{form.shortDescription}</p>}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {badges.map(b => (
                  <span key={b} className="px-2 py-0.5 bg-primary-50 text-primary-700 text-[10px] font-semibold rounded-lg">{b}</span>
                ))}
              </div>
            )}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-xl font-bold text-amber-500">€{displayPrice.toLocaleString("es")}</span>
              {discount && discount < price && <span className="text-sm text-gray-400 line-through">€{price.toLocaleString("es")}</span>}
            </div>
            <button className="w-full py-2.5 rounded-xl text-white text-xs font-bold"
              style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}>
              Pedir presupuesto
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  const typeLabel: Record<ProductType, string> = {
    air_conditioning: "Aire Acondicionado",
    boiler: "Caldera",
    aerothermal: "Aerotermia",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col mb-8">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-bold text-gray-900 text-base">
              {initial ? "Editar producto" : "Nuevo producto"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{typeLabel[form.productType]} · {form.pageLocation}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex overflow-x-auto gap-1 px-4 pt-3 pb-0 border-b border-gray-100 shrink-0">
          {TABS.map(tab => (
            <button
              key={tab.id} type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold whitespace-nowrap rounded-t-lg border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600 bg-primary-50/50"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
            {errors.map(e => <p key={e} className="text-xs text-red-600 font-medium">{e}</p>)}
          </div>
        )}

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === "info"       && <InfoTab />}
          {activeTab === "pricing"    && <PricingTab />}
          {activeTab === "commercial" && <CommercialTab />}
          {activeTab === "technical"  && <TechnicalTab />}
          {activeTab === "media"      && <MediaTab />}
          {activeTab === "seo"        && <SeoTab />}
          {activeTab === "preview"    && <PreviewTab />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
          <div className="flex gap-3">
            {TABS.findIndex(t => t.id === activeTab) > 0 && (
              <button type="button" onClick={() => {
                const i = TABS.findIndex(t => t.id === activeTab);
                setActiveTab(TABS[i - 1].id);
              }} className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                ← Anterior
              </button>
            )}
            {TABS.findIndex(t => t.id === activeTab) < TABS.length - 1 && (
              <button type="button" onClick={() => {
                const i = TABS.findIndex(t => t.id === activeTab);
                setActiveTab(TABS[i + 1].id);
              }} className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
                Siguiente →
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50">
              Cancelar
            </button>
            <button type="button" onClick={handleSubmit} disabled={loading}
              className="px-6 py-2 text-sm font-semibold text-white rounded-xl flex items-center gap-2 disabled:opacity-60 transition-opacity"
              style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}>
              {loading && <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Guardar producto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
