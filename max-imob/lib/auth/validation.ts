export type LoginInput = {
  email: string;
  password: string;
};

type LoginValidationResult =
  | {
      success: true;
      data: LoginInput;
    }
  | {
      success: false;
      error: string;
    };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginInput(input: unknown): LoginValidationResult {
  if (!input || typeof input !== "object") {
    return invalidLoginInput();
  }

  const body = input as Record<string, unknown>;
  const email = body.email;
  const password = body.password;

  if (typeof email !== "string" || typeof password !== "string") {
    return invalidLoginInput();
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!emailPattern.test(normalizedEmail) || password.length < 8) {
    return invalidLoginInput();
  }

  return {
    success: true,
    data: {
      email: normalizedEmail,
      password,
    },
  };
}

function invalidLoginInput(): LoginValidationResult {
  return {
    success: false,
    error: "Email sau parolă invalidă.",
  };
}
