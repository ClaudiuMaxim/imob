export type PropertyType = "apartament" | "casa" | "teren" | "comercial";
export type PropertyStatus = "ciorna" | "publicata" | "vanduta" | "inchiriata";

export type CreatePropertyInput = {
  title: string;
  description: string;
  price: number;
  city: string;
  address: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  area: number;
};

export type UpdatePropertyInput = {
  title?: string;
  description?: string;
  price?: number;
  city?: string;
  address?: string;
  propertyType?: PropertyType;
  status?: PropertyStatus;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
};

export type PublicPropertyFilters = {
  city?: string;
  propertyType?: PropertyType;
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
  const city = getText(input.city);
  const address = getText(input.address);
  const propertyType = getPropertyType(input.propertyType);
  const status = getPropertyStatus(input.status);
  const bedrooms = getInteger(input.bedrooms);
  const bathrooms = getInteger(input.bathrooms);
  const area = getNumber(input.area);

  const basicError = validateBasicFields(title, description, city, address);

  if (basicError) {
    return invalid(basicError);
  }

  if (!title || !description || !city || !address) {
    return invalid("Datele proprietății sunt incomplete.");
  }

  if (price === null || price < 0) {
    return invalid("Prețul trebuie să fie un număr mai mare sau egal cu 0.");
  }

  if (!propertyType) {
    return invalid("Tipul proprietății este invalid.");
  }

  if (!status) {
    return invalid("Statusul proprietății este invalid.");
  }

  if (bedrooms === null || bedrooms < 0) {
    return invalid("Numărul de dormitoare este invalid.");
  }

  if (bathrooms === null || bathrooms < 0) {
    return invalid("Numărul de băi este invalid.");
  }

  if (area === null || area <= 0) {
    return invalid("Suprafața trebuie să fie mai mare decât 0.");
  }

  return {
    success: true,
    data: {
      title,
      description,
      price,
      city,
      address,
      propertyType,
      status,
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
    return invalid("Date invalide pentru actualizarea proprietății.");
  }

  const data: UpdatePropertyInput = {};

  if ("title" in input) {
    const title = getText(input.title);

    if (!title || title.length < 3 || title.length > 150) {
      return invalid("Titlul trebuie să aibă între 3 și 150 de caractere.");
    }

    data.title = title;
  }

  if ("description" in input) {
    const description = getText(input.description);

    if (!description || description.length > 2000) {
      return invalid("Descrierea este obligatorie și are maximum 2000 de caractere.");
    }

    data.description = description;
  }

  if ("price" in input) {
    const price = getNumber(input.price);

    if (price === null || price < 0) {
      return invalid("Prețul trebuie să fie un număr mai mare sau egal cu 0.");
    }

    data.price = price;
  }

  if ("city" in input) {
    const city = getText(input.city);

    if (!city || city.length < 2 || city.length > 100) {
      return invalid("Orașul trebuie să aibă între 2 și 100 de caractere.");
    }

    data.city = city;
  }

  if ("address" in input) {
    const address = getText(input.address);

    if (!address || address.length < 5 || address.length > 200) {
      return invalid("Adresa trebuie să aibă între 5 și 200 de caractere.");
    }

    data.address = address;
  }

  if ("propertyType" in input) {
    const propertyType = getPropertyType(input.propertyType);

    if (!propertyType) {
      return invalid("Tipul proprietății este invalid.");
    }

    data.propertyType = propertyType;
  }

  if ("status" in input) {
    const status = getPropertyStatus(input.status);

    if (!status) {
      return invalid("Statusul proprietății este invalid.");
    }

    data.status = status;
  }

  if ("bedrooms" in input) {
    const bedrooms = getInteger(input.bedrooms);

    if (bedrooms === null || bedrooms < 0) {
      return invalid("Numărul de dormitoare este invalid.");
    }

    data.bedrooms = bedrooms;
  }

  if ("bathrooms" in input) {
    const bathrooms = getInteger(input.bathrooms);

    if (bathrooms === null || bathrooms < 0) {
      return invalid("Numărul de băi este invalid.");
    }

    data.bathrooms = bathrooms;
  }

  if ("area" in input) {
    const area = getNumber(input.area);

    if (area === null || area <= 0) {
      return invalid("Suprafața trebuie să fie mai mare decât 0.");
    }

    data.area = area;
  }

  if (Object.keys(data).length === 0) {
    return invalid("Nu există date de actualizat.");
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

  if ("city" in input) {
    const city = getText(input.city);

    if (city && city.length > 100) {
      return invalid("Orasul trebuie sa aiba maximum 100 de caractere.");
    }

    if (city) {
      filters.city = city;
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
    return "Titlul trebuie să aibă între 3 și 150 de caractere.";
  }

  if (!description || description.length > 2000) {
    return "Descrierea este obligatorie și are maximum 2000 de caractere.";
  }

  if (!city || city.length < 2 || city.length > 100) {
    return "Orașul trebuie să aibă între 2 și 100 de caractere.";
  }

  if (!address || address.length < 5 || address.length > 200) {
    return "Adresa trebuie să aibă între 5 și 200 de caractere.";
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

function invalid<T>(error: string): ValidationResult<T> {
  return {
    success: false,
    error,
  };
}
