import type { Property } from "../lib/types";
import PropertiesTable from "./properties-table";

type PropertiesListPanelProps = {
  error: string;
  isLoading: boolean;
  isSaving: boolean;
  message: string;
  onActivate: (property: Property) => void;
  onDeactivate: (property: Property) => void;
  onEdit: (property: Property) => void;
  onReload: () => void;
  properties: Property[];
};

export default function PropertiesListPanel({
  error,
  isLoading,
  isSaving,
  message,
  onActivate,
  onDeactivate,
  onEdit,
  onReload,
  properties,
}: PropertiesListPanelProps) {
  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 fw-bold mb-0">Proprietățile mele</h2>
          <button
            className="btn btn-outline-primary btn-sm"
            disabled={isLoading}
            onClick={onReload}
            type="button"
          >
            Reîncarcă
          </button>
        </div>

        {message ? <div className="alert alert-success">{message}</div> : null}
        {error ? <div className="alert alert-danger">{error}</div> : null}

        {isLoading ? (
          <p className="text-secondary mb-0">Se încarcă proprietățile...</p>
        ) : (
          <PropertiesTable
            isSaving={isSaving}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            onEdit={onEdit}
            properties={properties}
          />
        )}
      </div>
    </section>
  );
}
