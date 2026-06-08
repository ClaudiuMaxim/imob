"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import PropertyForm from "./components/property-form";
import PropertiesListPanel from "./components/properties-list-panel";
import { getErrorMessage, requestCities, requestProperties } from "./lib/api";
import type { City, Property } from "./lib/types";

export default function AgentProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [editPropertyId, setEditPropertyId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [cityId, setCityId] = useState("");
  const [address, setAddress] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageInputKey, setImageInputKey] = useState(0);
  const [propertyType, setPropertyType] = useState("apartament");
  const [status, setStatus] = useState("ciorna");
  const [offerType, setOfferType] = useState("vanzare");
  const [bedrooms, setBedrooms] = useState("0");
  const [bathrooms, setBathrooms] = useState("0");
  const [area, setArea] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void loadInitialData();
  }, []);

  async function loadInitialData() {
    setIsLoading(true);
    setError("");

    try {
      const [citiesPayload, propertiesPayload] = await Promise.all([
        requestCities(),
        requestProperties("/api/properties"),
      ]);
      setCities(citiesPayload.data?.cities ?? []);
      setProperties(propertiesPayload.data?.properties ?? []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  async function loadProperties() {
    setIsLoading(true);
    setError("");

    try {
      const payload = await requestProperties("/api/properties");
      setProperties(payload.data?.properties ?? []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      if (editPropertyId) {
        await updateSelectedProperty();
      } else {
        await createNewProperty();
      }

      resetForm();
      await loadProperties();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  }

  async function createNewProperty() {
    await requestProperties("/api/properties", {
      method: "POST",
      body: getPropertyFormData(),
    });
    setMessage("Proprietatea a fost creata.");
  }

  async function updateSelectedProperty() {
    await requestProperties(`/api/properties/${editPropertyId}`, {
      method: "PUT",
      body: getPropertyFormData(),
    });
    setMessage("Proprietatea a fost actualizata.");
  }

  async function deactivateProperty(property: Property) {
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      await requestProperties(`/api/properties/${property.id}`, {
        method: "DELETE",
      });
      setMessage("Proprietatea a fost dezactivata.");
      await loadProperties();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  }

  async function activateProperty(property: Property) {
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      await requestProperties(`/api/properties/${property.id}`, {
        method: "PATCH",
      });
      setMessage("Proprietatea a fost activata.");
      await loadProperties();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  }

  function startEditingProperty(property: Property) {
    setEditPropertyId(property.id);
    setTitle(property.title);
    setDescription(property.description);
    setPrice(String(property.price));
    setCityId(property.cityId);
    setAddress(property.address);
    setImageFiles([]);
    setImageInputKey((currentKey) => currentKey + 1);
    setPropertyType(property.propertyType);
    setOfferType(property.offerType);
    setStatus(property.status);
    setBedrooms(String(property.bedrooms));
    setBathrooms(String(property.bathrooms));
    setArea(String(property.area));
  }

  function resetForm() {
    setEditPropertyId("");
    setTitle("");
    setDescription("");
    setPrice("");
    setCityId("");
    setAddress("");
    setImageFiles([]);
    setImageInputKey((currentKey) => currentKey + 1);
    setPropertyType("apartament");
    setOfferType("vanzare");
    setStatus("ciorna");
    setBedrooms("0");
    setBathrooms("0");
    setArea("");
  }

  function getPropertyFormData() {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("cityId", cityId);
    formData.append("address", address);
    formData.append("propertyType", propertyType);
    formData.append("offerType", offerType);
    formData.append("status", status);
    formData.append("bedrooms", bedrooms);
    formData.append("bathrooms", bathrooms);
    formData.append("area", area);

    for (const imageFile of imageFiles) {
      formData.append("images", imageFile);
    }

    return formData;
  }

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <PropertyForm
          address={address}
          area={area}
          bathrooms={bathrooms}
          bedrooms={bedrooms}
          cities={cities}
          cityId={cityId}
          description={description}
          imageInputKey={imageInputKey}
          isEditing={Boolean(editPropertyId)}
          isSaving={isSaving}
          onAddressChange={setAddress}
          onAreaChange={setArea}
          onBathroomsChange={setBathrooms}
          onBedroomsChange={setBedrooms}
          onCancel={resetForm}
          onCityIdChange={setCityId}
          onDescriptionChange={setDescription}
          onImagesChange={setImageFiles}
          onOfferTypeChange={setOfferType}
          onPriceChange={setPrice}
          onPropertyTypeChange={setPropertyType}
          onStatusChange={setStatus}
          onSubmit={handleSubmit}
          onTitleChange={setTitle}
          offerType={offerType}
          price={price}
          propertyType={propertyType}
          selectedImageCount={imageFiles.length}
          status={status}
          title={title}
        />
      </div>
      <div className="col-lg-8">
        <PropertiesListPanel
          error={error}
          isLoading={isLoading}
          isSaving={isSaving}
          message={message}
          onActivate={activateProperty}
          onDeactivate={deactivateProperty}
          onEdit={startEditingProperty}
          onReload={() => void loadProperties()}
          properties={properties}
        />
      </div>
    </div>
  );
}
