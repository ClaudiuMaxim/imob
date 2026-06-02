"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PropertyFilters from "./property-filters";
import PropertyGrid from "./property-grid";
import {
  createPropertiesUrl,
  getErrorMessage,
  requestPublicProperties,
} from "../lib/api";
import type { Property } from "../lib/types";

export default function PropertiesBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [offerType, setOfferType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInitialProperties() {
      setIsLoading(true);
      setError("");

      const initialCity = searchParams.get("city") ?? "";
      const initialPropertyType = searchParams.get("propertyType") ?? "";
      const initialOfferType = searchParams.get("offerType") ?? "";
      const initialBedrooms = searchParams.get("bedrooms") ?? "";

      setCity(initialCity);
      setPropertyType(initialPropertyType);
      setOfferType(initialOfferType);
      setBedrooms(initialBedrooms);

      try {
        const url = createPropertiesUrl({
          city: initialCity,
          propertyType: initialPropertyType,
          offerType: initialOfferType,
          bedrooms: initialBedrooms,
        });
        const payload = await requestPublicProperties(url);
        setProperties(payload.data?.properties ?? []);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadInitialProperties();
  }, [searchParams]);

  async function loadPropertiesWithCurrentFilters() {
    setIsLoading(true);
    setError("");

    try {
      const url = createPropertiesUrl({ city, propertyType, offerType, bedrooms });
      const payload = await requestPublicProperties(url);
      setProperties(payload.data?.properties ?? []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadPropertiesWithCurrentFilters();
  }

  function resetFilters() {
    setCity("");
    setPropertyType("");
    setOfferType("");
    setBedrooms("");
    void loadPropertiesWithoutFilters();
  }

  async function loadPropertiesWithoutFilters() {
    setIsLoading(true);
    setError("");

    try {
      const payload = await requestPublicProperties("/api/properties?publicata=1");
      setProperties(payload.data?.properties ?? []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  function openProperty(property: Property) {
    router.push(`/properties/${property.id}`);
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h1 className="fw-bold mb-2">Proprietati disponibile</h1>
        <p className="text-secondary mb-0">
          Cauta proprietati publicate de agenti si deschide detaliile prin dublu click.
        </p>
      </div>

      <section className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <PropertyFilters
            bedrooms={bedrooms}
            city={city}
            offerType={offerType}
            isLoading={isLoading}
            onBedroomsChange={setBedrooms}
            onCityChange={setCity}
            onOfferTypeChange={setOfferType}
            onPropertyTypeChange={setPropertyType}
            onReset={resetFilters}
            onSubmit={handleSubmit}
            propertyType={propertyType}
          />
        </div>
      </section>

      {error ? <div className="alert alert-danger">{error}</div> : null}
      {isLoading ? (
        <div className="text-secondary">Se incarca proprietatile...</div>
      ) : (
        <PropertyGrid onOpen={openProperty} properties={properties} />
      )}
    </div>
  );
}
