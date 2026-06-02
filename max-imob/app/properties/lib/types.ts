export type PropertyType = "apartament" | "casa" | "teren" | "comercial";
export type PropertyStatus = "ciorna" | "publicata" | "vanduta" | "inchiriata";

export type PropertyImage = {
  id: string;
  imageUrl: string;
  fileName: string;
  sortOrder: number;
};

export type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  address: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  offerType: "vanzare" | "inchiriere";
  bedrooms: number;
  bathrooms: number;
  area: number;
  isActive: boolean;
  images: PropertyImage[];
};

export type PropertiesResponse = {
  success: boolean;
  data: {
    properties?: Property[];
    property?: Property;
  } | null;
  error: string | null;
};

export type PropertyFilters = {
  city: string;
  propertyType: string;
  offerType: string;
  bedrooms: string;
};
