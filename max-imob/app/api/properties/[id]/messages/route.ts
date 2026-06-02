import { NextRequest, NextResponse } from "next/server";
import { saveMessage, getPropertyById } from "@/lib/properties/messages-service";
import { validateCreateMessageInput } from "@/lib/properties/messages-validation";

export async function POST(
  request: NextRequest,
  context: { params?: { id?: string } },
) {
  try {
    const body = await request.json();
    const propertyId = context.params?.id ?? body?.propertyId;

    if (!propertyId || typeof propertyId !== "string") {
      return jsonError("ID-ul proprietății lipsește din cerere.", 400);
    }

    // Validate input
    const validation = validateCreateMessageInput(body);
    if (!validation.success) {
      return jsonError(validation.error, 400);
    }

    // Check if property exists and is published
    const property = await getPropertyById(propertyId);
    if (!property) {
      return jsonError("Proprietatea nu a fost găsită.", 404);
    }

    if (property.status !== "publicata") {
      return jsonError("Proprietatea nu este disponibilă.", 400);
    }

    // Save message
    const message = await saveMessage(propertyId, property.agent_id, validation.data);

    return jsonOk({ message }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}

function handleRouteError(error: unknown) {
  console.error("Message route failed:", error);
  return jsonError("Operația nu este disponibilă momentan.", 500);
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
