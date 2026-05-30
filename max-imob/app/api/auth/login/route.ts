import { NextResponse } from "next/server";
import { loginUser } from "@/lib/auth/auth-service";
import { validateLoginInput } from "@/lib/auth/validation";

const cookieName = "auth_token";

const routes = {
  POST: handleLogin,
};

export const POST = routes.POST;

async function handleLogin(request: Request) {
  const body = await request.json().catch(() => null);
  const validation = validateLoginInput(body);

  if (!validation.success) {
    return unauthorized(validation.error);
  }

  try {
    const result = await loginUser(validation.data);

    if (!result.success) {
      return unauthorized(result.error);
    }

    const response = NextResponse.json({
      success: true,
      data: {
        user: result.user,
        redirectTo: result.redirectTo,
      },
      error: null,
    });

    response.cookies.set(cookieName, result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Login failed:", error);

    return NextResponse.json(
      {
        success: false,
        data: null,
        error: "Autentificarea nu este disponibilă momentan.",
      },
      { status: 500 },
    );
  }
}

function unauthorized(error: string) {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error,
    },
    { status: 401 },
  );
}
