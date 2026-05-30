import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { getPool } from "@/lib/db/pool";
import type { CreateAgentInput, UpdateAgentInput } from "@/lib/agents/validation";

export type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type AgentRow = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

type AgentStatusFilter = "active" | "inactive" | null;

export async function listAgents(status: AgentStatusFilter) {
  const params: boolean[] = [];
  let whereClause = "WHERE role = 'agent'";

  if (status) {
    params.push(status === "active");
    whereClause += " AND is_active = $1";
  }

  const result = await getPool().query<AgentRow>(
    `
      SELECT id, name, email, phone, is_active, created_at, updated_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
    `,
    params,
  );

  return result.rows.map(mapAgentRow);
}

export async function createAgent(input: CreateAgentInput) {
  const passwordHash = await bcrypt.hash(input.password, 10);
  const result = await getPool().query<AgentRow>(
    `
      INSERT INTO users (
        id,
        name,
        email,
        phone,
        password_hash,
        role,
        is_active,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, 'agent', true, CURRENT_TIMESTAMP)
      RETURNING id, name, email, phone, is_active, created_at, updated_at
    `,
    [randomUUID(), input.name, input.email, input.phone, passwordHash],
  );

  return mapAgentRow(result.rows[0]);
}

export async function getAgentById(id: string) {
  const result = await getPool().query<AgentRow>(
    `
      SELECT id, name, email, phone, is_active, created_at, updated_at
      FROM users
      WHERE id = $1 AND role = 'agent'
      LIMIT 1
    `,
    [id],
  );

  const row = result.rows[0];
  return row ? mapAgentRow(row) : null;
}

export async function updateAgent(id: string, input: UpdateAgentInput) {
  const currentAgent = await getAgentById(id);

  if (!currentAgent) {
    return null;
  }

  const nextName = input.name ?? currentAgent.name;
  const nextPhone = "phone" in input ? input.phone ?? null : currentAgent.phone;
  const nextIsActive = input.isActive ?? currentAgent.isActive;

  const result = await getPool().query<AgentRow>(
    `
      UPDATE users
      SET name = $2,
          phone = $3,
          is_active = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND role = 'agent'
      RETURNING id, name, email, phone, is_active, created_at, updated_at
    `,
    [id, nextName, nextPhone, nextIsActive],
  );

  return mapAgentRow(result.rows[0]);
}

export async function deactivateAgent(id: string) {
  return updateAgent(id, {
    isActive: false,
  });
}

export function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

function mapAgentRow(row: AgentRow): Agent {
  return {
    id: row.id,
    name: row.name ?? "",
    email: row.email,
    phone: row.phone,
    isActive: row.is_active,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}
