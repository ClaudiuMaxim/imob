import type { CitiesResponse, PropertiesResponse, PropertyFilters } from "./types";

export async function requestPublicProperties(path: string) {
  const response = await fetch(path);
  const payload = (await response.json()) as PropertiesResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error ?? "Operatia nu a reusit.");
  }

  return payload;
}

export async function requestCities() {
  const response = await fetch("/api/cities");
  const payload = (await response.json()) as CitiesResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error ?? "Lista oraselor nu a putut fi incarcata.");
  }

  return payload;
}

export function createPropertiesUrl(filters: PropertyFilters) {
  const searchParams = new URLSearchParams();
  searchParams.set("publicata", "1");

  if (filters.cityId) {
    searchParams.set("cityId", filters.cityId);
  }

  if (filters.propertyType) {
    searchParams.set("propertyType", filters.propertyType);
  }

  if (filters.offerType) {
    searchParams.set("offerType", filters.offerType);
  }

  if (filters.bedrooms) {
    searchParams.set("bedrooms", filters.bedrooms);
  }

  return `/api/properties?${searchParams.toString()}`;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Operatia nu a reusit.";
}
