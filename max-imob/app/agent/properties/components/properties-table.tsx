import Image from "next/image";
import type { Property } from "../lib/types";

type PropertiesTableProps = {
  isSaving: boolean;
  onActivate: (property: Property) => void;
  onDeactivate: (property: Property) => void;
  onEdit: (property: Property) => void;
  properties: Property[];
};

export default function PropertiesTable({
  isSaving,
  onActivate,
  onDeactivate,
  onEdit,
  properties,
}: PropertiesTableProps) {
  if (properties.length === 0) {
    return <p className="text-secondary mb-0">Nu exista proprietati.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Poza</th>
            <th>Titlu</th>
            <th>Oras</th>
            <th>Oferta</th>
            <th>Pret</th>
            <th>Status</th>
            <th>Activa</th>
            <th className="text-end">Actiuni</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id}>
              <td>{renderImage(property)}</td>
              <td className="fw-semibold">{property.title}</td>
              <td>{property.city}</td>
              <td>{getOfferTypeLabel(property.offerType)}</td>
              <td>{property.price} EUR</td>
              <td>
                <span className="badge text-bg-primary">{property.status}</span>
              </td>
              <td>{property.isActive ? "Da" : "Nu"}</td>
              <td className="text-end">
                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={isSaving}
                    onClick={() => onEdit(property)}
                    type="button"
                  >
                    Editeaza
                  </button>
                  {property.isActive ? (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      disabled={isSaving}
                      onClick={() => onDeactivate(property)}
                      type="button"
                    >
                      Dezactiveaza
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-success btn-sm"
                      disabled={isSaving}
                      onClick={() => onActivate(property)}
                      type="button"
                    >
                      Activeaza
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getOfferTypeLabel(offerType: Property["offerType"]) {
  return offerType === "inchiriere" ? "Închiriere" : "Vânzare";
}

function renderImage(property: Property) {
  const firstImage = property.images[0];

  if (!firstImage) {
    return <span className="text-secondary">-</span>;
  }

  return (
    <Image
      alt={property.title}
      className="rounded object-fit-cover"
      height={52}
      src={firstImage.imageUrl}
      width={72}
    />
  );
}
