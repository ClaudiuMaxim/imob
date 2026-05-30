import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAdmin } from "@/lib/auth/session";
import {
  deactivateAgent,
  getAgentById,
  updateAgent,
} from "@/lib/agents/agent-service";
import { validateUpdateAgentInput } from "@/lib/agents/validation";

type AgentRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const routes = {
  GET: handleGetAgent,
  PUT: handleUpdateAgent,
  DELETE: handleDeleteAgent,
};

export const GET = routes.GET;
export const PUT = routes.PUT;
export const DELETE = routes.DELETE;

async function handleGetAgent(
  request: NextRequest,
  context: AgentRouteContext,
) {
  try {
    requireAdmin(request);

    const { id } = await context.params;
    const agent = await getAgentById(id);

    if (!agent) {
      return jsonError("Agentul nu a fost găsit.", 404);
    }

    return jsonOk({ agent });
  } catch (error) {
    return handleRouteError(error);
  }
}

async function handleUpdateAgent(
  request: NextRequest,
  context: AgentRouteContext,
) {
  try {
    requireAdmin(request);

    const { id } = await context.params;
    const body = await request.json().catch(() => null);
    const validation = validateUpdateAgentInput(body);

    if (!validation.success) {
      return jsonError(validation.error, 400);
    }

    const agent = await updateAgent(id, validation.data);

    if (!agent) {
      return jsonError("Agentul nu a fost găsit.", 404);
    }

    return jsonOk({ agent });
  } catch (error) {
    return handleRouteError(error);
  }
}

async function handleDeleteAgent(
  request: NextRequest,
  context: AgentRouteContext,
) {
  try {
    requireAdmin(request);

    const { id } = await context.params;
    const agent = await deactivateAgent(id);

    if (!agent) {
      return jsonError("Agentul nu a fost găsit.", 404);
    }

    return jsonOk({ agent });
  } catch (error) {
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
