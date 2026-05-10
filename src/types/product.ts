export type ProductType = "air_conditioning" | "boiler" | "aerothermal";
export type PageLocation = "oferta" | "calderas" | "aerotermia";
export type StockStatus = "in_stock" | "on_request" | "consult";
export type WifiStatus = "included" | "optional" | "not_included";

export interface AcSpecs {
  installationType: "split" | "conductos" | "cassette" | "multisplit" | "suelo_techo";
  technology: string;
  composition: string;
  indoorUnit: string;
  outdoorUnit: string;
  coolingCapacityKw: number;
  heatingCapacityKw: number;
  recommendedAreaMin: number | null;
  recommendedAreaMax: number | null;
  energyLabelCooling: string;
  energyLabelHeating: string;
  seer: number | null;
  scop: number | null;
  minNoiseDb: number | null;
  refrigerant: string;
  wifiStatus: WifiStatus;
  includedController: string | null;
  staticPressure: string | null;
  indoorDimensions: string | null;
  outdoorDimensions: string | null;
  indoorOutdoorWeight: string | null;
}

export interface BoilerSpecs {
  boilerType: "condensacion" | "bajo_nox" | "estanca" | "gasoil" | "otra";
  fuelType: "gas_natural" | "propano" | "gasoil" | "electrica";
  useType: string[];
  heatingPowerKw: number;
  dhwPowerKw: number | null;
  dhwFlowRate: string | null;
  dhwProfile: string | null;
  energyLabelHeating: string | null;
  energyLabelDhw: string | null;
  efficiency: string | null;
  noxClass: string | null;
  installationType: "mural" | "suelo";
  thermostatCompatibility: "included" | "optional" | "not_included";
  flueKitIncluded: boolean;
  dimensions: string | null;
}

export interface AerothermalSpecs {
  systemType: "monobloc" | "bibloc" | "todo_en_uno";
  functions: string[];
  heatingCapacityKw: number;
  coolingCapacityKw: number | null;
  tankLiters: number | null;
  cop: number | null;
  scop: number | null;
  energyLabel: string | null;
  refrigerant: string | null;
  maxFlowTemperature: string | null;
  powerSupply: "monofasica" | "trifasica" | "no_especificado";
  compatibleUnderfloorHeating: boolean;
  compatibleRadiators: "yes" | "depends" | "no";
  compatibleFanCoils: boolean;
  minNoiseDb: number | null;
  recommendedAreaMin: number | null;
  recommendedAreaMax: number | null;
}

export interface ProductFormData {
  productType: ProductType;
  pageLocation: PageLocation;
  isActive: boolean;
  isFeatured: boolean;
  commercialName: string;
  brand: string;
  model: string;
  sku: string;
  series: string;
  category: string;
  categoryId: string;
  shortDescription: string;
  longDescription: string;
  price: string;
  discountPrice: string;
  ivaIncluded: boolean;
  installationIncluded: boolean;
  stockStatus: StockStatus;
  stockQuantity: string;
  warranty: string;
  mainImage: string;
  galleryImages: string[];
  technicalPdf: string;
  commercialTags: string[];
  seoTitle: string;
  seoDescription: string;
  acSpecs: AcSpecs;
  boilerSpecs: BoilerSpecs;
  aerothermalSpecs: AerothermalSpecs;
}

export const DEFAULT_AC_SPECS: AcSpecs = {
  installationType: "split", technology: "Inverter", composition: "", indoorUnit: "", outdoorUnit: "",
  coolingCapacityKw: 0, heatingCapacityKw: 0, recommendedAreaMin: null, recommendedAreaMax: null,
  energyLabelCooling: "", energyLabelHeating: "", seer: null, scop: null, minNoiseDb: null,
  refrigerant: "R32", wifiStatus: "not_included", includedController: null,
  staticPressure: null, indoorDimensions: null, outdoorDimensions: null, indoorOutdoorWeight: null,
};

export const DEFAULT_BOILER_SPECS: BoilerSpecs = {
  boilerType: "condensacion", fuelType: "gas_natural", useType: [], heatingPowerKw: 0,
  dhwPowerKw: null, dhwFlowRate: null, dhwProfile: null, energyLabelHeating: null, energyLabelDhw: null,
  efficiency: null, noxClass: null, installationType: "mural", thermostatCompatibility: "not_included",
  flueKitIncluded: false, dimensions: null,
};

export const DEFAULT_AEROTHERMAL_SPECS: AerothermalSpecs = {
  systemType: "monobloc", functions: [], heatingCapacityKw: 0, coolingCapacityKw: null, tankLiters: null,
  cop: null, scop: null, energyLabel: null, refrigerant: null, maxFlowTemperature: null,
  powerSupply: "monofasica", compatibleUnderfloorHeating: false, compatibleRadiators: "depends",
  compatibleFanCoils: false, minNoiseDb: null, recommendedAreaMin: null, recommendedAreaMax: null,
};

export const PAGE_LOCATION_DEFAULT: Record<ProductType, PageLocation> = {
  air_conditioning: "oferta",
  boiler: "calderas",
  aerothermal: "aerotermia",
};
