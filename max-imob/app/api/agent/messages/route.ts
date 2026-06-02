import { NextRequest, NextResponse } from "next/server";
import { requireAgent } from "@/lib/auth/session";
import { getMessagesByAgentId } from "@/lib/properties/messages-service";

export async function GET(request: NextRequest) {
  try {
    const session = requireAgent(request);
    const messages = await getMessagesByAgentId(session.userId);

    return NextResponse.json(
      {
        success: true,
        data: { messages },
        error: null,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleRouteError(error);
  }
}

function handleRouteError(error: unknown) {
  if (error instanceof Error && "status" in error && typeof (error as any).status === "number") {
    return jsonError(error.message, (error as any).status as number);
  }

  console.error("Agent messages route failed:", error);
  return jsonError("Operația nu este disponibilă momentan.", 500);
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
