import { NextRequest, NextResponse } from "next/server";
import { AuthError, getAuthSession, requireAgent } from "@/lib/auth/session";
import {
  activateProperty,
  deactivateProperty,
  getAgentPropertyById,
  getPublicPropertyById,
  updateProperty,
} from "@/lib/properties/property-service";
import {
  getImageFiles,
  savePropertyImages,
  validateImageFiles,
} from "@/lib/properties/image-storage";
import { validateUpdatePropertyInput } from "@/lib/properties/validation";

type PropertyRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const routes = {
  GET: handleGetProperty,
  PUT: handleUpdateProperty,
  PATCH: handleActivateProperty,
  DELETE: handleDeleteProperty,
};

export const GET = routes.GET;
export const PUT = routes.PUT;
export const PATCH = routes.PATCH;
export const DELETE = routes.DELETE;

async function handleGetProperty(
  request: NextRequest,
  context: PropertyRouteContext,
) {
  try {
    const { id } = await context.params;
    const session = getAuthSession(request);
    const shouldReturnPublicProperty =
      request.nextUrl.searchParams.get("publicata") === "1";
    const property =
      session?.role === "agent" && !shouldReturnPublicProperty
        ? await getAgentPropertyById(session.userId, id)
        : await getPublicPropertyById(id);

    if (!property) {
      return jsonError("Proprietatea nu a fost gasita.", 404);
    }

    return jsonOk({ property });
  } catch (error) {
    return handleRouteError(error);
  }
}

async function handleUpdateProperty(
  request: NextRequest,
  context: PropertyRouteContext,
) {
  try {
    const session = requireAgent(request);
    const { id } = await context.params;
    const formData = await request.formData();
    const imageFiles = getImageFiles(formData);
    const imageError = validateImageFiles(imageFiles, false);

    if (imageError) {
      return jsonError(imageError, 400);
    }

    const body = getPropertyInputFromFormData(formData);
    const validation = validateUpdatePropertyInput(body);

    if (!validation.success) {
      return jsonError(validation.error, 400);
    }

    const images = await savePropertyImages(imageFiles);
    const property = await updateProperty(session.userId, id, validation.data, images);

    if (!property) {
      return jsonError("Proprietatea nu a fost gasita.", 404);
    }

    return jsonOk({ property });
  } catch (error) {
    return handleRouteError(error);
  }
}

async function handleActivateProperty(
  request: NextRequest,
  context: PropertyRouteContext,
) {
  try {
    const session = requireAgent(request);
    const { id } = await context.params;
    const property = await activateProperty(session.userId, id);

    if (!property) {
      return jsonError("Proprietatea nu a fost gasita.", 404);
    }

    return jsonOk({ property });
  } catch (error) {
    return handleRouteError(error);
  }
}

async function handleDeleteProperty(
  request: NextRequest,
  context: PropertyRouteContext,
) {
  try {
    const session = requireAgent(request);
    const { id } = await context.params;
    const property = await deactivateProperty(session.userId, id);

    if (!property) {
      return jsonError("Proprietatea nu a fost gasita.", 404);
    }

    return jsonOk({ property });
  } catch (error) {
    return handleRouteError(error);
  }
}

function getPropertyInputFromFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    city: formData.get("city"),
    address: formData.get("address"),
    propertyType: formData.get("propertyType"),
    offerType: formData.get("offerType"),
    status: formData.get("status"),
    bedrooms: formData.get("bedrooms"),
    bathrooms: formData.get("bathrooms"),
    area: formData.get("area"),
  };
}

function handleRouteError(error: unknown) {
  if (error instanceof AuthError) {
    return jsonError(error.message, error.status);
  }

  console.error("Property route failed:", error);
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
