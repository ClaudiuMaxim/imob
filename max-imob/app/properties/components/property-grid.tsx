import type { Property } from "../lib/types";
import PropertyCard from "./property-card";

type PropertyGridProps = {
  onOpen: (property: Property) => void;
  properties: Property[];
};

export default function PropertyGrid({ onOpen, properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="border rounded bg-white p-4 text-center text-secondary">
        Nu exista proprietati pentru filtrele selectate.
      </div>
    );
  }

  return (
    <div className="row g-4">
      {properties.map((property) => (
        <div className="col-md-6 col-xl-4" key={property.id}>
          <PropertyCard onOpen={onOpen} property={property} />
        </div>
      ))}
    </div>
  );
}
