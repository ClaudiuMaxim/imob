import Image from "next/image";
import type { KeyboardEvent } from "react";
import type { Property } from "../lib/types";

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
      onDoubleClick={() => onOpen(property)}
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
            Fara poza
          </div>
        )}
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between gap-3 mb-2">
          <h2 className="h5 fw-bold mb-0">{property.title}</h2>
          <span className="fw-bold text-primary text-nowrap">{property.price} EUR</span>
        </div>
        <p className="text-secondary mb-3">{property.city}</p>
        <div className="d-flex flex-wrap gap-2">
          <span className="badge text-bg-light border">{property.propertyType}</span>
          <span className="badge text-bg-light border">{getOfferTypeLabel(property.offerType)}</span>
          <span className="badge text-bg-light border">
            {property.bedrooms} camere
          </span>
          <span className="badge text-bg-light border">{property.bathrooms} bai</span>
          <span className="badge text-bg-light border">{property.area} mp</span>
        </div>
      </div>
    </article>
  );
}

function getOfferTypeLabel(offerType: Property["offerType"]) {
  return offerType === "inchiriere" ? "Închiriere" : "Vânzare";
}
