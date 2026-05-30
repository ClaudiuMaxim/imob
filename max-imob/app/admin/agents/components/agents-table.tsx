import type { Agent } from "../lib/types";

type AgentsTableProps = {
  agents: Agent[];
  isSaving: boolean;
  onEdit: (agent: Agent) => void;
  onToggleStatus: (agent: Agent) => void;
};

export default function AgentsTable({
  agents,
  isSaving,
  onEdit,
  onToggleStatus,
}: AgentsTableProps) {
  if (agents.length === 0) {
    return <p className="text-secondary mb-0">Nu există agenți înregistrați.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Nume</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Status</th>
            <th className="text-end">Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.id}>
              <td className="fw-semibold">{agent.name}</td>
              <td>{agent.email}</td>
              <td>{agent.phone ?? "-"}</td>
              <td>
                <span
                  className={`badge ${
                    agent.isActive ? "text-bg-success" : "text-bg-secondary"
                  }`}
                >
                  {agent.isActive ? "Activ" : "Inactiv"}
                </span>
              </td>
              <td className="text-end">
                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={isSaving}
                    onClick={() => onEdit(agent)}
                    type="button"
                  >
                    Editează
                  </button>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    disabled={isSaving}
                    onClick={() => onToggleStatus(agent)}
                    type="button"
                  >
                    {agent.isActive ? "Dezactivează" : "Reactivează"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
