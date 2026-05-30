export type CreateAgentInput = {
  name: string;
  email: string;
  phone: string | null;
  password: string;
};

export type UpdateAgentInput = {
  name?: string;
  phone?: string | null;
  isActive?: boolean;
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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCreateAgentInput(
  input: unknown,
): ValidationResult<CreateAgentInput> {
  if (!isRecord(input)) {
    return invalid("Date invalide pentru agent.");
  }

  const name = normalizeText(input.name);
  const email = normalizeEmail(input.email);
  const phone = normalizeOptionalText(input.phone);
  const password = input.password;

  if (!name || name.length < 2 || name.length > 100) {
    return invalid("Numele agentului trebuie să aibă între 2 și 100 de caractere.");
  }

  if (!email || !emailPattern.test(email)) {
    return invalid("Emailul agentului este invalid.");
  }

  if (phone && phone.length > 30) {
    return invalid("Telefonul agentului trebuie să aibă maximum 30 de caractere.");
  }

  if (typeof password !== "string" || password.length < 8) {
    return invalid("Parola trebuie să aibă minimum 8 caractere.");
  }

  return {
    success: true,
    data: {
      name,
      email,
      phone,
      password,
    },
  };
}

export function validateUpdateAgentInput(
  input: unknown,
): ValidationResult<UpdateAgentInput> {
  if (!isRecord(input)) {
    return invalid("Date invalide pentru actualizarea agentului.");
  }

  const data: UpdateAgentInput = {};

  if ("name" in input) {
    const name = normalizeText(input.name);

    if (!name || name.length < 2 || name.length > 100) {
      return invalid("Numele agentului trebuie să aibă între 2 și 100 de caractere.");
    }

    data.name = name;
  }

  if ("phone" in input) {
    const phone = normalizeOptionalText(input.phone);

    if (phone && phone.length > 30) {
      return invalid("Telefonul agentului trebuie să aibă maximum 30 de caractere.");
    }

    data.phone = phone;
  }

  if ("isActive" in input) {
    if (typeof input.isActive !== "boolean") {
      return invalid("Statusul agentului este invalid.");
    }

    data.isActive = input.isActive;
  }

  if (Object.keys(data).length === 0) {
    return invalid("Nu există date de actualizat.");
  }

  return {
    success: true,
    data,
  };
}

export function validateAgentStatusFilter(status: string | null) {
  if (!status) {
    return null;
  }

  if (status === "active" || status === "inactive") {
    return status;
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : null;
}

function normalizeOptionalText(value: unknown) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : null;
}

function invalid<T>(error: string): ValidationResult<T> {
  return {
    success: false,
    error,
  };
}
