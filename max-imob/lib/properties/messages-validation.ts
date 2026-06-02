export type MessageStatus = "unread" | "read" | "archived";

export type CreateMessageInput = {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  messageContent: string;
};

export type Message = {
  id: string;
  propertyId: string;
  agentId: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  messageContent: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function invalid(message: string): ValidationResult<never> {
  return { success: false, error: message };
}

export function validateCreateMessageInput(
  input: unknown,
): ValidationResult<CreateMessageInput> {
  if (!isRecord(input)) {
    return invalid("Date invalide pentru mesaj.");
  }

  const { contactName, contactEmail, contactPhone, messageContent } = input;

  // Validate contactName
  if (!isString(contactName) || contactName.trim().length < 2 || contactName.length > 100) {
    return invalid("Numele trebuie să aibă între 2 și 100 caractere.");
  }

  // Validate contactEmail
  if (!isString(contactEmail)) {
    return invalid("Emailul este obligatoriu.");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactEmail)) {
    return invalid("Emailul nu este valid.");
  }

  // Validate contactPhone
  if (!isString(contactPhone)) {
    return invalid("Telefonul este obligatoriu.");
  }
  const phoneRegex = /^[\d\s+\-()]+$/;
  if (contactPhone.trim().length < 10 || contactPhone.length > 20 || !phoneRegex.test(contactPhone)) {
    return invalid("Telefonul trebuie să aibă între 10 și 20 caractere și să conțină doar cifre și caractere: +, -, spațiu.");
  }

  // Validate messageContent
  if (!isString(messageContent)) {
    return invalid("Mesajul este obligatoriu.");
  }
  if (messageContent.trim().length < 10 || messageContent.length > 5000) {
    return invalid("Mesajul trebuie să aibă între 10 și 5000 caractere.");
  }

  return {
    success: true,
    data: {
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      messageContent: messageContent.trim(),
    },
  };
}
