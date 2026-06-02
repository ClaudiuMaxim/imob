import type { MessagesResponse } from "./types";

export async function requestMessages(path: string, init?: RequestInit) {
  const headers = getJsonHeaders(init?.headers);

  const response = await fetch(path, {
    ...init,
    headers,
  });
  const payload = (await response.json()) as MessagesResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error ?? "Operația nu a reușit.");
  }

  return payload;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Operația nu a reușit.";
}

function getJsonHeaders(headers?: HeadersInit) {
  const jsonHeaders = new Headers(headers);
  jsonHeaders.set("Content-Type", "application/json");
  return jsonHeaders;
}
