import type { AveragePricesResponse } from "./types";

export async function requestAveragePrices(path: string) {
  const response = await fetch(path);
  const payload = (await response.json()) as AveragePricesResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error ?? "Operatia nu a reusit.");
  }

  return payload;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Operatia nu a reusit.";
}
