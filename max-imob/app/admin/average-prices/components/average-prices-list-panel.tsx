import type { AveragePrice } from "../lib/types";
import AveragePricesTable from "./average-prices-table";

type AveragePricesListPanelProps = {
  averagePrices: AveragePrice[];
  error: string;
  isLoading: boolean;
  onReload: () => void;
};

export default function AveragePricesListPanel({
  averagePrices,
  error,
  isLoading,
  onReload,
}: AveragePricesListPanelProps) {
  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 fw-bold mb-0">Preturi medii</h2>
          <button
            className="btn btn-outline-primary btn-sm"
            disabled={isLoading}
            onClick={onReload}
            type="button"
          >
            Reincarca
          </button>
        </div>

        {error ? <div className="alert alert-danger">{error}</div> : null}

        {isLoading ? (
          <p className="text-secondary mb-0">Se incarca preturile medii...</p>
        ) : (
          <AveragePricesTable averagePrices={averagePrices} />
        )}
      </div>
    </section>
  );
}
