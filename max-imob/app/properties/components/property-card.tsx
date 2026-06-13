import Image from "next/image";
import type { KeyboardEvent } from "react";
import type { Property, PropertyType } from "../lib/types";

type PropertyCardProps = {
  onOpen: (property: Property) => void;
  property: Property;
};

export default function PropertyCard({ onOpen, property }: PropertyCardProps) {
  const firstImage = property.images[0];

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter") {
      onOpen(property);
    }
  }

  return (
    <article
      className="card h-100 border-0 shadow-sm"
      onClick={() => onOpen(property)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="ratio ratio-4x3 bg-light">
        {firstImage ? (
          <Image
            alt={property.title}
            className="card-img-top object-fit-cover"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            src={firstImage.imageUrl}
          />
        ) : (
          <div className="d-flex align-items-center justify-content-center text-secondary">
            Fără poză
          </div>
        )}
      </div>
      <div className="card-body">
        <div className="d-flex flex-column justify-content-between gap-3 mb-2">
          <h2 className="h5 fw-bold mb-0">{property.title}</h2>
          <span className="fw-bold text-primary text-nowrap">
            {property.price.toLocaleString("ro-RO")} EUR
          </span>
        </div>
        <p className="text-secondary mb-3">
          <i className="bi bi-geo-alt-fill me-1"></i>
          {property.city}
        </p>
        <div className="d-flex flex-wrap gap-2">
          <span className={`badge border ${getBackgroundByType(property.propertyType)}`}>
            {property.propertyType}
          </span>
          <span
            className={
              "badge border text-white " +
              (property.offerType === "vanzare" ? "text-bg-warning" : "text-bg-info")
            }
          >
            {getOfferTypeLabel(property.offerType)}
          </span>
          <span className="badge text-bg-light border">
            {property.bedrooms} camere
          </span>
        </div>
      </div>
    </article>
  );
}

function getOfferTypeLabel(offerType: Property["offerType"]) {
  return offerType === "inchiriere" ? "Închiriere" : "Vânzare";
}

function getBackgroundByType(type: PropertyType) {
  if (type === "apartament") {
    return "text-bg-primary";
  }

  if (type === "casa") {
    return "text-bg-success";
  }

  if (type === "teren") {
    return "text-bg-dark";
  }

  if (type === "comercial") {
    return "text-bg-secondary";
  }

  return "";
}
