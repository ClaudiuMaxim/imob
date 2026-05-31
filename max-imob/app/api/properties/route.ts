import { NextRequest, NextResponse } from "next/server";
import { AuthError, getAuthSession, requireAgent } from "@/lib/auth/session";
import {
  createProperty,
  listAgentProperties,
  listPublicProperties,
} from "@/lib/properties/property-service";
import {
  getImageFiles,
  savePropertyImages,
  validateImageFiles,
} from "@/lib/properties/image-storage";
import {
  validateCreatePropertyInput,
  validatePublicPropertyFilters,
} from "@/lib/properties/validation";

const routes = {
  GET: handleGetProperties,
  POST: handleCreateProperty,
};

export const GET = routes.GET;
export const POST = routes.POST;

async function handleGetProperties(request: NextRequest) {
  try {
    const session = getAuthSession(request);
    const shouldReturnPublicList = request.nextUrl.searchParams.get("publicata") === "1";

    if (session?.role === "agent" && !shouldReturnPublicList) {
      const properties = await listAgentProperties(session.userId);
      return jsonOk({ properties });
    }

    const filters = getPublicFiltersFromRequest(request);
    const validation = validatePublicPropertyFilters(filters);

    if (!validation.success) {
      return jsonError(validation.error, 400);
    }

    const properties = await listPublicProperties(validation.data);
    return jsonOk({ properties });
  } catch (error) {
    return handleRouteError(error);
  }
}

function getPublicFiltersFromRequest(request: NextRequest) {
  return {
    city: request.nextUrl.searchParams.get("city") ?? "",
    propertyType: request.nextUrl.searchParams.get("propertyType") ?? "",
    bedrooms: request.nextUrl.searchParams.get("bedrooms") ?? "",
  };
}

async function handleCreateProperty(request: NextRequest) {
  try {
    const session = requireAgent(request);
    const formData = await request.formData();
    const imageFiles = getImageFiles(formData);
    const imageError = validateImageFiles(imageFiles, true);

    if (imageError) {
      return jsonError(imageError, 400);
    }

    const body = getPropertyInputFromFormData(formData);
    const validation = validateCreatePropertyInput(body);

    if (!validation.success) {
      return jsonError(validation.error, 400);
    }

    const images = await savePropertyImages(imageFiles);
    const property = await createProperty(session.userId, validation.data, images);
    return jsonOk({ property }, 201);
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
