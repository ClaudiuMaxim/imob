import { NextRequest, NextResponse } from "next/server";
import { listAveragePrices } from "@/lib/average-prices/average-price-service";
import { AuthError, getAuthSession } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  try {
    requireAveragePricesAccess(request);

    const averagePrices = await listAveragePrices();

    return jsonOk({ averagePrices });
  } catch (error) {
    return handleRouteError(error);
  }
}

function requireAveragePricesAccess(request: NextRequest) {
  const session = getAuthSession(request);

  if (!session) {
    throw new AuthError("Autentificare necesara.", 401);
  }

  if (session.role !== "admin" && session.role !== "agent") {
    throw new AuthError("Acces interzis.", 403);
  }

  return session;
}

function handleRouteError(error: unknown) {
  if (error instanceof AuthError) {
    return jsonError(error.message, error.status);
  }

  console.error("Average prices route failed:", error);
  return jsonError("Operatia nu este disponibila momentan.", 500);
}

function jsonOk(data: unknown, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      error: null,
    },
    { status },
  );
}

function jsonError(error: string, status: number) {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error,
    },
    { status },
  );
}
