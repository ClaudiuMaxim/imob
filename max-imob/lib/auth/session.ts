import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

export type UserRole = "admin" | "agent";

export type AuthSession = {
  userId: string;
  role: UserRole;
};

type JwtPayload = {
  userId?: unknown;
  role?: unknown;
};

const cookieName = "auth_token";

export function requireAdmin(request: NextRequest): AuthSession {
  const session = getAuthSession(request);

  if (!session) {
    throw new AuthError("Autentificare necesară.", 401);
  }

  if (session.role !== "admin") {
    throw new AuthError("Acces interzis.", 403);
  }

  return session;
}

export function getAuthSession(request: NextRequest): AuthSession | null {
  const token = request.cookies.get(cookieName)?.value;
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    return null;
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;

    if (typeof payload.userId !== "string" || !isUserRole(payload.role)) {
      return null;
    }

    return {
      userId: payload.userId,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly status: 401 | 403,
  ) {
    super(message);
  }
}

function isUserRole(role: unknown): role is UserRole {
  return role === "admin" || role === "agent";
}
