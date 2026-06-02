import type { FormEvent } from "react";

type PropertyFiltersProps = {
  bedrooms: string;
  city: string;
  offerType: string;
  isLoading: boolean;
  onBedroomsChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onOfferTypeChange: (value: string) => void;
  onPropertyTypeChange: (value: string) => void;
  onReset: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  propertyType: string;
};

const propertyTypeOptions = [
  { label: "Toate tipurile", value: "" },
  { label: "Apartament", value: "apartament" },
  { label: "Casa", value: "casa" },
  { label: "Teren", value: "teren" },
  { label: "Comercial", value: "comercial" },
];

export default function PropertyFilters({
  bedrooms,
  city,
  isLoading,
  onBedroomsChange,
  onCityChange,
  onOfferTypeChange,
  onPropertyTypeChange,
  onReset,
  onSubmit,
  offerType,
  propertyType,
}: PropertyFiltersProps) {
  return (
    <form className="row g-3 align-items-end" onSubmit={onSubmit}>
      <div className="col-md-4">
        <label className="form-label" htmlFor="city">
          Oras
        </label>
        <input
          className="form-control"
          id="city"
          onChange={(event) => onCityChange(event.target.value)}
          placeholder="Ex: Bucuresti"
          value={city}
        />
      </div>
      <div className="col-md-3">
        <label className="form-label" htmlFor="property-type">
          Tip
        </label>
        <select
          className="form-select"
          id="property-type"
          onChange={(event) => onPropertyTypeChange(event.target.value)}
          value={propertyType}
        >
          {propertyTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-2">
        <label className="form-label" htmlFor="offer-type">
          Oferta
        </label>
        <select
          className="form-select"
          id="offer-type"
          onChange={(event) => onOfferTypeChange(event.target.value)}
          value={offerType}
        >
          <option value="">Toate</option>
          <option value="vanzare">Vânzare</option>
          <option value="inchiriere">Închiriere</option>
        </select>
      </div>
      <div className="col-md-2">
        <label className="form-label" htmlFor="bedrooms">
          Camere
        </label>
        <input
          className="form-control"
          id="bedrooms"
          min="0"
          onChange={(event) => onBedroomsChange(event.target.value)}
          type="number"
          value={bedrooms}
        />
      </div>
      <div className="col-md-3">
        <div className="d-flex gap-2">
          <button className="btn btn-primary w-100" disabled={isLoading} type="submit">
            Filtreaza
          </button>
          <button
            className="btn btn-outline-secondary"
            disabled={isLoading}
            onClick={onReset}
            type="button"
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}
