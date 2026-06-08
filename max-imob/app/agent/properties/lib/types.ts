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
  cityId: string;
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

export type City = {
  id: string;
  name: string;
  countyCode: string;
};

export type PropertiesResponse = {
  success: boolean;
  data: {
    properties?: Property[];
    property?: Property;
  } | null;
  error: string | null;
};

export type CitiesResponse = {
  success: boolean;
  data: {
    cities?: City[];
  } | null;
  error: string | null;
};
