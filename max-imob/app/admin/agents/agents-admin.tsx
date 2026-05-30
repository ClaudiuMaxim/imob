"use client";

import { FormEvent, useEffect, useState } from "react";
import CreateAgentForm from "./components/create-agent-form";
import EditAgentForm from "./components/edit-agent-form";
import AgentsListPanel from "./components/agents-list-panel";
import { getErrorMessage, requestAgents } from "./lib/api";
import type { Agent } from "./lib/types";

export default function AgentsAdmin() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [editAgentId, setEditAgentId] = useState("");
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editIsActive, setEditIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void loadAgents();
  }, []);

  async function loadAgents() {
    setIsLoading(true);
    setError("");

    try {
      const payload = await requestAgents("/api/agents");
      setAgents(payload.data?.agents ?? []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateAgent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      await requestAgents("/api/agents", {
        method: "POST",
        body: JSON.stringify({
          name: createName,
          email: createEmail,
          phone: createPhone,
          password: createPassword,
        }),
      });
      resetCreateFields();
      setMessage("Agentul a fost creat cu succes.");
      await loadAgents();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdateAgent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editAgentId) {
      return;
    }

    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      await requestAgents(`/api/agents/${editAgentId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          isActive: editIsActive,
        }),
      });
      resetEditFields();
      setMessage("Agentul a fost actualizat.");
      await loadAgents();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleAgentStatus(agent: Agent) {
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      if (agent.isActive) {
        await requestAgents(`/api/agents/${agent.id}`, {
          method: "DELETE",
        });
      } else {
        await requestAgents(`/api/agents/${agent.id}`, {
          method: "PUT",
          body: JSON.stringify({ isActive: true }),
        });
      }

      setMessage(
        agent.isActive
          ? "Agentul a fost dezactivat."
          : "Agentul a fost reactivat.",
      );
      await loadAgents();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  }

  function resetCreateFields() {
    setCreateName("");
    setCreateEmail("");
    setCreatePhone("");
    setCreatePassword("");
  }

  function startEditingAgent(agent: Agent) {
    setEditAgentId(agent.id);
    setEditName(agent.name);
    setEditPhone(agent.phone ?? "");
    setEditIsActive(agent.isActive);
  }

  function resetEditFields() {
    setEditAgentId("");
    setEditName("");
    setEditPhone("");
    setEditIsActive(false);
  }

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        {!editAgentId ? (
        <CreateAgentForm
          createEmail={createEmail}
          createName={createName}
          createPassword={createPassword}
          createPhone={createPhone}
          isSaving={isSaving}
          onCreateEmailChange={setCreateEmail}
          onCreateNameChange={setCreateName}
          onCreatePasswordChange={setCreatePassword}
          onCreatePhoneChange={setCreatePhone}
          onSubmit={handleCreateAgent}
        />
        ):null}

        {editAgentId ? (
          <EditAgentForm
            editIsActive={editIsActive}
            editName={editName}
            editPhone={editPhone}
            isSaving={isSaving}
            onCancel={resetEditFields}
            onEditIsActiveChange={setEditIsActive}
            onEditNameChange={setEditName}
            onEditPhoneChange={setEditPhone}
            onSubmit={handleUpdateAgent}
          />
        ) : null}
      </div>

      <div className="col-lg-8">
        
        <AgentsListPanel
          agents={agents}
          error={error}
          isLoading={isLoading}
          isSaving={isSaving}
          message={message}
          onEdit={startEditingAgent}
          onReload={() => void loadAgents()}
          onToggleStatus={toggleAgentStatus}
        />
      </div>
    </div>
  );
}
