import { NextRequest, NextResponse } from "next/server";
import { listAveragePrices } from "@/lib/average-prices/average-price-service";
import { AuthError, requireAdmin } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const averagePrices = await listAveragePrices();

    return jsonOk({ averagePrices });
  } catch (error) {
    return handleRouteError(error);
  }
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
