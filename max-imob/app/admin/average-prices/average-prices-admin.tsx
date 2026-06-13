"use client";

import { useEffect, useState } from "react";
import AveragePricesListPanel from "./components/average-prices-list-panel";
import { getErrorMessage, requestAveragePrices } from "./lib/api";
import type { AveragePrice } from "./lib/types";

export default function AveragePricesAdmin() {
  const [averagePrices, setAveragePrices] = useState<AveragePrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadAveragePrices();
  }, []);

  async function loadAveragePrices() {
    setIsLoading(true);
    setError("");

    try {
      const payload = await requestAveragePrices("/api/average-prices");
      setAveragePrices(payload.data?.averagePrices ?? []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AveragePricesListPanel
      averagePrices={averagePrices}
      error={error}
      isLoading={isLoading}
      onReload={() => void loadAveragePrices()}
    />
  );
}
