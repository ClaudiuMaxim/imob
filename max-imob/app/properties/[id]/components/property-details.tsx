"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PropertyDetailsInfo from "./property-details-info";
import PropertyGallery from "./property-gallery";
import { getErrorMessage, requestPublicProperties } from "../../lib/api";
import type { Property } from "../../lib/types";

type PropertyDetailsProps = {
  propertyId: string;
};

export default function PropertyDetails({ propertyId }: PropertyDetailsProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProperty() {
      setIsLoading(true);
      setError("");

      try {
        const payload = await requestPublicProperties(
          `/api/properties/${propertyId}?publicata=1`,
        );
        setProperty(payload.data?.property ?? null);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadProperty();
  }, [propertyId]);

  if (isLoading) {
    return <div className="container py-5 text-secondary">Se încarcă proprietatea...</div>;
  }

  if (error || !property) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error || "Proprietatea nu a fost găsită."}
        </div>
        <Link className="btn btn-outline-primary" href="/properties">
          Înapoi la proprietăți
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link className="btn btn-outline-secondary btn-sm" href="/properties">
          Înapoi la listă
        </Link>
      </div>
      <div className="row g-4">
        <div className="col-lg-7">
          <PropertyGallery images={property.images} title={property.title} />
          {property.description && (
            <p className="text-secondary">{property.description}</p>
          )}
        </div>
        <div className="col-lg-5">
          <PropertyDetailsInfo property={property} />
        </div>
      </div>
    </div>
  );
}
