import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAdmin } from "@/lib/auth/session";
import {
  createAgent,
  isUniqueViolation,
  listAgents,
} from "@/lib/agents/agent-service";
import {
  validateAgentStatusFilter,
  validateCreateAgentInput,
} from "@/lib/agents/validation";

const routes = {
  GET: handleGetAgents,
  POST: handleCreateAgent,
};

export const GET = routes.GET;
export const POST = routes.POST;

async function handleGetAgents(request: NextRequest) {
  try {
    requireAdmin(request);

    const status = validateAgentStatusFilter(
      request.nextUrl.searchParams.get("status"),
    );
    const agents = await listAgents(status);

    return jsonOk({ agents });
  } catch (error) {
    return handleRouteError(error);
  }
}

async function handleCreateAgent(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json().catch(() => null);
    const validation = validateCreateAgentInput(body);

    if (!validation.success) {
      return jsonError(validation.error, 400);
    }

    const agent = await createAgent(validation.data);

    return jsonOk({ agent }, 201);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return jsonError("Există deja un utilizator cu acest email.", 409);
    }

    return handleRouteError(error);
  }
}

function handleRouteError(error: unknown) {
  if (error instanceof AuthError) {
    return jsonError(error.message, error.status);
  }

  console.error("Agent route failed:", error);
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
