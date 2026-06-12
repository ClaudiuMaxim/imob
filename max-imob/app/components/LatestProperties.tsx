"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PropertyCard from "../properties/components/property-card";
import { getErrorMessage, requestPublicProperties } from "../properties/lib/api";
import type { Property } from "../properties/lib/types";

export default function LatestProperties() {
  const router = useRouter();
  const [latest, setLatest] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLatestProperties() {
      setIsLoading(true);
      setError("");

      try {
        const payload = await requestPublicProperties("/api/properties?publicata=1");
        setLatest(payload.data?.properties ?? []);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadLatestProperties();
  }, []);

  function openProperty(property: Property): void {
    router.push(`/properties/${property.id}`);
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (isLoading) {
    return <div className="text-secondary">Se incarca proprietatile...</div>;
  }

  return (
    <div className="row g-4">
      {latest.map((property) => (
        <div className="col-md-6 col-xl-4" key={property.id}>
          <PropertyCard property={property} onOpen={openProperty} />
        </div>
      ))}
    </div>
  );
}
