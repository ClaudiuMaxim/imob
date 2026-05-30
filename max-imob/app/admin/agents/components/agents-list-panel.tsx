import type { Agent } from "../lib/types";
import AgentsTable from "./agents-table";

type AgentsListPanelProps = {
  agents: Agent[];
  error: string;
  isLoading: boolean;
  isSaving: boolean;
  message: string;
  onEdit: (agent: Agent) => void;
  onReload: () => void;
  onToggleStatus: (agent: Agent) => void;
};

export default function AgentsListPanel({
  agents,
  error,
  isLoading,
  isSaving,
  message,
  onEdit,
  onReload,
  onToggleStatus,
}: AgentsListPanelProps) {
  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 fw-bold mb-0">Agenți</h2>
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
          <p className="text-secondary mb-0">Se încarcă agenții...</p>
        ) : (
          <AgentsTable
            agents={agents}
            isSaving={isSaving}
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
          />
        )}
      </div>
    </section>
  );
}
