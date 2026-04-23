"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Wind, Wrench, Package, Tag, Clock, Star, ShoppingCart, ArrowRight, CheckCircle2 } from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string;
  shortDescription: string | null;
  category: string;
  manufacturer: string | null;
  price: any;
  discountPrice: any | null;
  warranty: string | null;
  stock: number;
};

type Service = {
  id: string;
  name: string;
  description: string;
  type: string;
  basePrice: any;
  estimatedDuration: number;
  difficulty: string;
};

type ServicePackage = {
  id: string;
  name: string;
  description: string;
  packagePrice: any;
  discountPercentage: any | null;
  product: Product;
  service: Service;
};

const serviceIcons: Record<string, React.ReactNode> = {
  instalacion:   <Wrench size={20} className="text-primary-600" />,
  mantenimiento: <CheckCircle2 size={20} className="text-accent-500" />,
  reparacion:    <Wind size={20} className="text-orange-500" />,
};

const difficultyColors: Record<string, string> = {
  baja:  "bg-primary-50 text-primary-700",
  media: "bg-yellow-50 text-yellow-700",
  alta:  "bg-red-50 text-red-700",
};

function formatPrice(val: any): string {
  return `€${Number(val).toFixed(2)}`;
}

function handleSolicitar(name: string) {
  toast.success(`Solicitud enviada para: ${name}`, {
    description: "Nos pondremos en contacto contigo en menos de 24 horas.",
    duration: 5000,
  });
}

interface ShopCatalogProps {
  products: Product[];
  services: Service[];
  packages: ServicePackage[];
}

type Tab = "paquetes" | "productos" | "servicios";

export function ShopCatalog({ products, services, packages }: ShopCatalogProps) {
  const [activeTab, setActiveTab] = useState<Tab>("paquetes");

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "paquetes", label: "Paquetes completos", icon: <Package size={16} /> },
    { key: "productos", label: "Equipos", icon: <Wind size={16} /> },
    { key: "servicios", label: "Servicios", icon: <Wrench size={16} /> },
  ];

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? "bg-primary-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Paquetes */}
      {activeTab === "paquetes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {packages.length === 0 && <EmptyState label="No hay paquetes disponibles" />}
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              {pkg.discountPercentage && (
                <div className="bg-accent-400 text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1">
                  <Tag size={12} />
                  {Number(pkg.discountPercentage).toFixed(0)}% de descuento incluido
                </div>
              )}
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 text-base leading-snug">{pkg.name}</h3>
                  <span className="text-xl font-bold text-primary-600 whitespace-nowrap">{formatPrice(pkg.packagePrice)}</span>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{pkg.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Wind size={14} className="text-accent-400 shrink-0" />
                    <span className="truncate">{pkg.product.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Wrench size={14} className="text-primary-500 shrink-0" />
                    <span>{pkg.service.name}</span>
                  </div>
                  {pkg.product.warranty && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Star size={14} className="text-yellow-400 shrink-0" />
                      <span>Garantia {pkg.product.warranty}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-5 pb-5">
                <button
                  onClick={() => handleSolicitar(pkg.name)}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                >
                  <ShoppingCart size={15} />
                  Solicitar este paquete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Productos */}
      {activeTab === "productos" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.length === 0 && <EmptyState label="No hay productos disponibles" />}
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="h-36 bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
                <Wind size={48} className="text-primary-300" />
              </div>
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-sm leading-snug">{product.name}</h3>
                </div>
                {product.manufacturer && (
                  <p className="text-xs text-accent-500 font-semibold mb-2">{product.manufacturer}</p>
                )}
                <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.shortDescription ?? product.description}</p>
                <div className="flex items-baseline gap-2 mb-3">
                  {product.discountPrice ? (
                    <>
                      <span className="text-xl font-bold text-primary-600">{formatPrice(product.discountPrice)}</span>
                      <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-primary-600">{formatPrice(product.price)}</span>
                  )}
                </div>
                {product.warranty && (
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                    <Star size={12} className="text-yellow-400" />
                    Garantia {product.warranty}
                  </div>
                )}
              </div>
              <div className="px-5 pb-5">
                <button
                  onClick={() => handleSolicitar(product.name)}
                  className="w-full flex items-center justify-center gap-2 bg-accent-400 hover:bg-accent-500 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                >
                  <ArrowRight size={15} />
                  Solicitar informacion
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Servicios */}
      {activeTab === "servicios" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {services.length === 0 && <EmptyState label="No hay servicios disponibles" />}
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-primary-50 rounded-xl">
                  {serviceIcons[service.type] ?? <Wrench size={20} className="text-primary-600" />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{service.name}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColors[service.difficulty] ?? "bg-gray-50 text-gray-600"}`}>
                    Dificultad: {service.difficulty}
                  </span>
                </div>
              </div>
              <p className="text-gray-500 text-xs mb-4 flex-1">{service.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-primary-600">{formatPrice(service.basePrice)}</span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={12} />
                  {Math.floor(service.estimatedDuration / 60)}h {service.estimatedDuration % 60}min
                </span>
              </div>
              <button
                onClick={() => handleSolicitar(service.name)}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                <ShoppingCart size={15} />
                Solicitar servicio
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="col-span-3 text-center py-16 bg-white rounded-2xl border border-gray-100">
      <Package size={40} className="mx-auto text-gray-200 mb-3" />
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  );
}
