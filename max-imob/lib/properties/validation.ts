export type PropertyType = "apartament" | "casa" | "teren" | "comercial";
export type PropertyStatus = "ciorna" | "publicata" | "vanduta" | "inchiriata";
export type PropertyOffer = "vanzare" | "inchiriere";

export type CreatePropertyInput = {
  title: string;
  description: string;
  price: number;
  cityId: string;
  address: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  offerType: PropertyOffer;
  bedrooms: number;
  bathrooms: number;
  area: number;
};

export type UpdatePropertyInput = {
  title?: string;
  description?: string;
  price?: number;
  cityId?: string;
  address?: string;
  propertyType?: PropertyType;
  status?: PropertyStatus;
  offerType?: PropertyOffer;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
};

export type PublicPropertyFilters = {
  cityId?: string;
  propertyType?: PropertyType;
  offerType?: PropertyOffer;
  bedrooms?: number;
};

type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

export function validateCreatePropertyInput(
  input: unknown,
): ValidationResult<CreatePropertyInput> {
  if (!isRecord(input)) {
    return invalid("Date invalide pentru proprietate.");
  }

  const title = getText(input.title);
  const description = getText(input.description);
  const price = getNumber(input.price);
  const cityId = getText(input.cityId);
  const address = getText(input.address);
  const propertyType = getPropertyType(input.propertyType);
  const status = getPropertyStatus(input.status);
  const offerType = getPropertyOffer(input.offerType);
  const bedrooms = getInteger(input.bedrooms);
  const bathrooms = getInteger(input.bathrooms);
  const area = getNumber(input.area);

  const basicError = validateBasicFields(title, description, cityId, address);

  if (basicError) {
    return invalid(basicError);
  }

  if (!title || !description || !cityId || !address) {
    return invalid("Datele proprietÄƒÈ›ii sunt incomplete.");
  }

  if (price === null || price < 0) {
    return invalid("PreÈ›ul trebuie sÄƒ fie un numÄƒr mai mare sau egal cu 0.");
  }

  if (!propertyType) {
    return invalid("Tipul proprietÄƒÈ›ii este invalid.");
  }

  if (!status) {
    return invalid("Statusul proprietÄƒÈ›ii este invalid.");
  }

  if (!offerType) {
    return invalid("Tipul ofertei este invalid.");
  }

  if (bedrooms === null || bedrooms < 0) {
    return invalid("NumÄƒrul de dormitoare este invalid.");
  }

  if (bathrooms === null || bathrooms < 0) {
    return invalid("NumÄƒrul de bÄƒi este invalid.");
  }

  if (area === null || area <= 0) {
    return invalid("SuprafaÈ›a trebuie sÄƒ fie mai mare decÃ¢t 0.");
  }

  return {
    success: true,
    data: {
      title,
      description,
      price,
      cityId,
      address,
      propertyType,
      status,
      offerType,
      bedrooms,
      bathrooms,
      area,
    },
  };
}

export function validateUpdatePropertyInput(
  input: unknown,
): ValidationResult<UpdatePropertyInput> {
  if (!isRecord(input)) {
    return invalid("Date invalide pentru actualizarea proprietÄƒÈ›ii.");
  }

  const data: UpdatePropertyInput = {};

  if ("title" in input) {
    const title = getText(input.title);

    if (!title || title.length < 3 || title.length > 150) {
      return invalid("Titlul trebuie sÄƒ aibÄƒ Ã®ntre 3 È™i 150 de caractere.");
    }

    data.title = title;
  }

  if ("description" in input) {
    const description = getText(input.description);

    if (!description || description.length > 2000) {
      return invalid("Descrierea este obligatorie È™i are maximum 2000 de caractere.");
    }

    data.description = description;
  }

  if ("price" in input) {
    const price = getNumber(input.price);

    if (price === null || price < 0) {
      return invalid("PreÈ›ul trebuie sÄƒ fie un numÄƒr mai mare sau egal cu 0.");
    }

    data.price = price;
  }


  if ("cityId" in input) {
    const cityId = getText(input.cityId);

    if (!cityId) {
      return invalid("Orasul este invalid.");
    }

    data.cityId = cityId;
  }

  if ("address" in input) {
    const address = getText(input.address);

    if (!address || address.length < 5 || address.length > 200) {
      return invalid("Adresa trebuie sÄƒ aibÄƒ Ã®ntre 5 È™i 200 de caractere.");
    }

    data.address = address;
  }

  if ("propertyType" in input) {
    const propertyType = getPropertyType(input.propertyType);

    if (!propertyType) {
      return invalid("Tipul proprietÄƒÈ›ii este invalid.");
    }

    data.propertyType = propertyType;
  }

  if ("status" in input) {
    const status = getPropertyStatus(input.status);

    if (!status) {
      return invalid("Statusul proprietÄƒÈ›ii este invalid.");
    }

    data.status = status;
  }

  if ("offerType" in input) {
    const offerType = getPropertyOffer(input.offerType);

    if (!offerType) {
      return invalid("Tipul ofertei este invalid.");
    }

    data.offerType = offerType;
  }

  if ("bedrooms" in input) {
    const bedrooms = getInteger(input.bedrooms);

    if (bedrooms === null || bedrooms < 0) {
      return invalid("NumÄƒrul de dormitoare este invalid.");
    }

    data.bedrooms = bedrooms;
  }

  if ("bathrooms" in input) {
    const bathrooms = getInteger(input.bathrooms);

    if (bathrooms === null || bathrooms < 0) {
      return invalid("NumÄƒrul de bÄƒi este invalid.");
    }

    data.bathrooms = bathrooms;
  }

  if ("area" in input) {
    const area = getNumber(input.area);

    if (area === null || area <= 0) {
      return invalid("SuprafaÈ›a trebuie sÄƒ fie mai mare decÃ¢t 0.");
    }

    data.area = area;
  }

  if (Object.keys(data).length === 0) {
    return invalid("Nu existÄƒ date de actualizat.");
  }

  return {
    success: true,
    data,
  };
}

export function validatePublicPropertyFilters(
  input: unknown,
): ValidationResult<PublicPropertyFilters> {
  if (!isRecord(input)) {
    return invalid("Filtre invalide.");
  }

  const filters: PublicPropertyFilters = {};

  if ("cityId" in input) {
    const cityId = getText(input.cityId);

    if (cityId) {
      filters.cityId = cityId;
    }
  }

  if ("propertyType" in input) {
    const propertyType = getPropertyType(input.propertyType);

    if (input.propertyType && !propertyType) {
      return invalid("Tipul proprietatii este invalid.");
    }

    if (propertyType) {
      filters.propertyType = propertyType;
    }
  }

  if ("offerType" in input) {
    const offerType = getPropertyOffer(input.offerType);

    if (input.offerType && !offerType) {
      return invalid("Tipul ofertei este invalid.");
    }

    if (offerType) {
      filters.offerType = offerType;
    }
  }

  if ("bedrooms" in input) {
    const bedrooms = getInteger(input.bedrooms);

    if (input.bedrooms && (bedrooms === null || bedrooms < 0)) {
      return invalid("Numarul de camere este invalid.");
    }

    if (bedrooms !== null) {
      filters.bedrooms = bedrooms;
    }
  }

  return {
    success: true,
    data: filters,
  };
}

function validateBasicFields(
  title: string | null,
  description: string | null,
  city: string | null,
  address: string | null,
) {
  if (!title || title.length < 3 || title.length > 150) {
    return "Titlul trebuie sÄƒ aibÄƒ Ã®ntre 3 È™i 150 de caractere.";
  }

  if (!description || description.length > 2000) {
    return "Descrierea este obligatorie È™i are maximum 2000 de caractere.";
  }

  if (!city || city.length < 2 || city.length > 100) {
    return "OraÈ™ul trebuie sÄƒ aibÄƒ Ã®ntre 2 È™i 100 de caractere.";
  }

  if (!address || address.length < 5 || address.length > 200) {
    return "Adresa trebuie sÄƒ aibÄƒ Ã®ntre 5 È™i 200 de caractere.";
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getText(value: unknown) {
  return typeof value === "string" ? value.trim() : null;
}

function getNumber(value: unknown) {
  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function getInteger(value: unknown) {
  const numberValue = getNumber(value);
  return numberValue !== null && Number.isInteger(numberValue) ? numberValue : null;
}

function getPropertyType(value: unknown): PropertyType | null {
  if (
    value === "apartament" ||
    value === "casa" ||
    value === "teren" ||
    value === "comercial"
  ) {
    return value;
  }

  return null;
}

function getPropertyStatus(value: unknown): PropertyStatus | null {
  if (
    value === "ciorna" ||
    value === "publicata" ||
    value === "vanduta" ||
    value === "inchiriata"
  ) {
    return value;
  }

  return null;
}

function getPropertyOffer(value: unknown): PropertyOffer | null {
  if (value === "vanzare" || value === "inchiriere") {
    return value;
  }

  return null;
}

function invalid<T>(error: string): ValidationResult<T> {
  return {
    success: false,
    error,
  };
}

