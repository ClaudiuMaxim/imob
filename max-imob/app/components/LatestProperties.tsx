"use server";

import Image from "next/image";
import Link from "next/link";
import { listPublicProperties } from "@/lib/properties/property-service";

export default async function LatestProperties() {
  const properties = await listPublicProperties({});
  const latest = properties.slice(0, 5);

  return (
    <div className="row g-4">
      {latest.map((property) => (
        <div className="col-md-6 col-xl-4" key={property.id}>
          <Link href={`/properties/${property.id}`} className="text-decoration-none text-dark">
            <article className="card h-100 border-0 shadow-sm overflow-hidden">
              <div className="ratio ratio-4x3 bg-light">
                {property.images[0] ? (
                  <Image
                    alt={property.title}
                    className="object-fit-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    src={property.images[0].imageUrl}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center text-secondary">
                    Fără poză
                  </div>
                )}
              </div>
              <div className="card-body">
                <span className="badge text-bg-primary mb-2">
                  {property.offerType === "inchiriere" ? "Închiriere" : "Vânzare"}
                </span>
                <h3 className="h6 fw-bold mb-2">{property.title}</h3>
                <p className="text-secondary mb-2">{property.city}</p>
                <div className="d-flex flex-wrap gap-2 small text-secondary">
                  <span>{property.bedrooms} camere</span>
                  <span>{property.bathrooms} bai</span>
                  <span>{property.area} mp</span>
                </div>
              </div>
            </article>
          </Link>
        </div>
      ))}
    </div>
  );
}
