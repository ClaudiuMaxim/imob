import type { FormEvent } from "react";
import PropertyDescription from "./property-description";
import PropertyImagesInput from "./property-images-input";
import PropertySelect from "./property-select";
import PropertyTextInput from "./property-text-input";
import type { City } from "../lib/types";

type PropertyFormProps = {
  address: string;
  area: string;
  bathrooms: string;
  bedrooms: string;
  cities: City[];
  cityId: string;
  description: string;
  imageInputKey: number;
  isEditing: boolean;
  isSaving: boolean;
  onAddressChange: (value: string) => void;
  onAreaChange: (value: string) => void;
  onBathroomsChange: (value: string) => void;
  onBedroomsChange: (value: string) => void;
  onCancel: () => void;
  onCityIdChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onImagesChange: (files: File[]) => void;
  onPriceChange: (value: string) => void;
  onPropertyTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onOfferTypeChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onTitleChange: (value: string) => void;
  offerType: string;
  price: string;
  propertyType: string;
  selectedImageCount: number;
  status: string;
  title: string;
};

const propertyTypeOptions = [
  { label: "Apartament", value: "apartament" },
  { label: "Casa", value: "casa" },
  { label: "Teren", value: "teren" },
  { label: "Comercial", value: "comercial" },
];

const statusOptions = [
  { label: "Ciorna", value: "ciorna" },
  { label: "Publicata", value: "publicata" },
  { label: "Vanduta", value: "vanduta" },
  { label: "Inchiriata", value: "inchiriata" },
];

export default function PropertyForm({
  address,
  area,
  bathrooms,
  bedrooms,
  cities,
  cityId,
  description,
  imageInputKey,
  isEditing,
  isSaving,
  onAddressChange,
  onAreaChange,
  onBathroomsChange,
  onBedroomsChange,
  onCancel,
  onCityIdChange,
  onDescriptionChange,
  onImagesChange,
  onPriceChange,
  onPropertyTypeChange,
  onStatusChange,
  onOfferTypeChange,
  onSubmit,
  onTitleChange,
  offerType,
  price,
  propertyType,
  selectedImageCount,
  status,
  title,
}: PropertyFormProps) {
  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body">
        <h2 className="h5 fw-bold mb-3">
          {isEditing ? "Editeaza proprietate" : "Proprietate noua"}
        </h2>
        <form onSubmit={onSubmit}>
          <PropertyTextInput
            label="Titlu"
            name="title"
            onChange={onTitleChange}
            required
            value={title}
          />
          <PropertyDescription
            onChange={onDescriptionChange}
            value={description}
          />
          <PropertyTextInput
            label="Pret"
            name="price"
            onChange={onPriceChange}
            required
            type="number"
            value={price}
          />
          <PropertySelect
            label="Oras"
            name="cityId"
            onChange={onCityIdChange}
            options={[
              { label: "Alege orasul", value: "" },
              ...cities.map((city) => ({
                label: `${city.name} (${city.countyCode})`,
                value: city.id,
              })),
            ]}
            required
            value={cityId}
          />
          <PropertyTextInput
            label="Adresa"
            name="address"
            onChange={onAddressChange}
            required
            value={address}
          />
          <PropertyImagesInput
            inputKey={imageInputKey}
            isEditing={isEditing}
            onChange={onImagesChange}
            selectedCount={selectedImageCount}
          />
          <PropertySelect
            label="Tip proprietate"
            name="property-type"
            onChange={onPropertyTypeChange}
            options={propertyTypeOptions}
            value={propertyType}
          />
          <PropertySelect
            label="Tip oferta"
            name="offer-type"
            onChange={onOfferTypeChange}
            options={[
              { label: "Vanzare", value: "vanzare" },
              { label: "Inchiriere", value: "inchiriere" },
            ]}
            value={offerType}
          />
          <PropertySelect
            label="Status"
            name="status"
            onChange={onStatusChange}
            options={statusOptions}
            value={status}
          />
          <div className="row">
            <div className="col-md-4">
              <PropertyTextInput
                label="Dormitoare"
                name="bedrooms"
                onChange={onBedroomsChange}
                required
                type="number"
                value={bedrooms}
              />
            </div>
            <div className="col-md-4">
              <PropertyTextInput
                label="Bai"
                name="bathrooms"
                onChange={onBathroomsChange}
                required
                type="number"
                value={bathrooms}
              />
            </div>
            <div className="col-md-4">
              <PropertyTextInput
                label="Suprafata"
                name="area"
                onChange={onAreaChange}
                required
                type="number"
                value={area}
              />
            </div>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-primary" disabled={isSaving} type="submit">
              {isEditing ? "Salveaza" : "Creeaza"}
            </button>
            {isEditing ? (
              <button
                className="btn btn-outline-secondary"
                onClick={onCancel}
                type="button"
              >
                Anuleaza
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}
