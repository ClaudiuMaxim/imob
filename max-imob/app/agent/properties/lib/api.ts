import type { PropertiesResponse } from "./types";

export async function requestProperties(path: string, init?: RequestInit) {
  const headers =
    init?.body instanceof FormData
      ? init?.headers
      : getJsonHeaders(init?.headers);

  const response = await fetch(path, {
    ...init,
    headers,
  });
  const payload = (await response.json()) as PropertiesResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error ?? "Operatia nu a reusit.");
  }

  return payload;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Operatia nu a reusit.";
}

function getJsonHeaders(headers?: HeadersInit) {
  const jsonHeaders = new Headers(headers);
  jsonHeaders.set("Content-Type", "application/json");
  return jsonHeaders;
}
