import type { AgentsResponse } from "./types";

export async function requestAgents(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const payload = (await response.json()) as AgentsResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error ?? "Operația nu a reușit.");
  }

  return payload;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Operația nu a reușit.";
}
