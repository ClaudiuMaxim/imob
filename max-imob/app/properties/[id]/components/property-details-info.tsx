"use client";

import type { Property } from "../../lib/types";
import ContactAgentModal from "./contact-agent-modal";
import PropertyMap from "./property-map";

type PropertyDetailsInfoProps = {
  property: Property;
};

export default function PropertyDetailsInfo({ property }: PropertyDetailsInfoProps) {
  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between gap-3 mb-3">
          <div>
            <h1 className="h2 fw-bold mb-2">{property.title}</h1>
            <p className="text-secondary mb-0">{property.city}</p>
          </div>
          <div className="text-end">
            <div className="h4 fw-bold text-primary mb-0">{property.price} EUR</div>
            <span className="badge text-bg-success">{property.status}</span>
          </div>
        </div>

        <div className="mb-3">
          <ContactAgentModal propertyId={property.id} />
        </div>

        <div className="row g-3 mb-3">
          <InfoItem label="Tip" value={property.propertyType} />
          <InfoItem label="Oferta" value={property.offerType} />
          <InfoItem label="Dormitoare" value={String(property.bedrooms)} />
          <InfoItem label="Bai" value={String(property.bathrooms)} />
          <InfoItem label="Suprafata" value={`${property.area} mp`} />
        </div>

        <div className="border-top pt-3">
          <h2 className="h6 fw-bold">Adresa</h2>
          <p className="mb-3 text-secondary">{property.address}</p>

          <PropertyMap address={property.address} />
        </div>
      </div>
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="col-6 col-md-6">
      <div className="border rounded p-3 h-100">
        <div className="small text-secondary">{label}</div>
        <div className="fw-semibold">{value}</div>
      </div>
    </div>
  );
}
