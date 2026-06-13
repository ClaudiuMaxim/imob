export type AveragePrice = {
  id: string;
  cityId: string;
  city: string;
  propertyType: "apartament" | "casa" | "teren" | "comercial";
  offerType: "vanzare" | "inchiriere";
  price: number;
};

export type AveragePricesResponse = {
  success: boolean;
  data: {
    averagePrices?: AveragePrice[];
  } | null;
  error: string | null;
};
