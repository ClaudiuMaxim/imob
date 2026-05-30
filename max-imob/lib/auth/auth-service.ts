import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getPool } from "@/lib/db/pool";
import type { LoginInput } from "@/lib/auth/validation";

type UserRole = "admin" | "agent";

type AuthenticatedUser = {
  id: string;
  email: string;
  role: UserRole;
};

type LoginResult =
  | {
      success: true;
      user: AuthenticatedUser;
      token: string;
      redirectTo: "/admin" | "/agent";
    }
  | {
      success: false;
      error: string;
    };

const invalidCredentialsMessage = "Email sau parolă invalidă.";

export async function loginUser(input: LoginInput): Promise<LoginResult> {
  const user = await findUserByEmail(input.email);

  if (!user || !user.isActive) {
    return invalidCredentials();
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    return invalidCredentials();
  }

  if (user.role !== "admin" && user.role !== "agent") {
    return invalidCredentials();
  }

  const token = createAuthToken(user.id, user.role);

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    token,
    redirectTo: user.role === "admin" ? "/admin" : "/agent",
  };
}

function createAuthToken(userId: string, role: UserRole): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET lipsește din variabilele de mediu.");
  }

  return jwt.sign({ userId, role }, secret, {
    expiresIn: "1d",
  });
}

function invalidCredentials(): LoginResult {
  return {
    success: false,
    error: invalidCredentialsMessage,
  };
}

type StoredUser = {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
};

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  is_active: boolean;
};

async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const result = await getPool().query<UserRow>(
    `
      SELECT id, email, password_hash, role, is_active
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email],
  );

  const row = result.rows[0];

  if (!row || !isUserRole(row.role)) {
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    isActive: row.is_active,
  };
}

function isUserRole(role: string): role is UserRole {
  return role === "admin" || role === "agent";
}
