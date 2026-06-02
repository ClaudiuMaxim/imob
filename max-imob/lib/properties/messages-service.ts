import { randomUUID } from "node:crypto";
import { getPool } from "@/lib/db/pool";
import type { Message, CreateMessageInput } from "@/lib/properties/messages-validation";

type MessageRow = {
  id: string;
  property_id: string;
  agent_id: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  message_content: string;
  status: string;
  created_at: Date;
  updated_at: Date;
};

function mapMessageRow(row: MessageRow): Message {
  return {
    id: row.id,
    propertyId: row.property_id,
    agentId: row.agent_id,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    messageContent: row.message_content,
    status: row.status as "unread" | "read" | "archived",
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function saveMessage(
  propertyId: string,
  agentId: string,
  input: CreateMessageInput,
): Promise<Message> {
  const id = randomUUID();
  const now = new Date();

  const result = await getPool().query<MessageRow>(
    `
      INSERT INTO messages (
        id,
        property_id,
        agent_id,
        contact_name,
        contact_email,
        contact_phone,
        message_content,
        status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `,
    [
      id,
      propertyId,
      agentId,
      input.contactName,
      input.contactEmail,
      input.contactPhone,
      input.messageContent,
      "unread",
      now,
      now,
    ],
  );

  if (result.rows.length === 0) {
    throw new Error("Eroare la salvarea mesajului");
  }

  return mapMessageRow(result.rows[0]);
}

export async function getPropertyById(propertyId: string) {
  const result = await getPool().query(
    `
      SELECT id, agent_id, status
      FROM properties
      WHERE id = $1
    `,
    [propertyId],
  );

  return result.rows[0] as { id: string; agent_id: string; status: string } | undefined;
}

export async function getMessagesByPropertyId(propertyId: string) {
  const result = await getPool().query<MessageRow>(
    `
      SELECT *
      FROM messages
      WHERE property_id = $1
      ORDER BY created_at DESC
    `,
    [propertyId],
  );

  return result.rows.map(mapMessageRow);
}

export async function getMessagesByAgentId(agentId: string) {
  const result = await getPool().query<MessageRow>(
    `
      SELECT *
      FROM messages
      WHERE agent_id = $1
      ORDER BY created_at DESC
    `,
    [agentId],
  );

  return result.rows.map(mapMessageRow);
}

export async function markMessageAsRead(messageId: string): Promise<Message> {
  const now = new Date();

  const result = await getPool().query<MessageRow>(
    `
      UPDATE messages
      SET status = 'read', updated_at = $1
      WHERE id = $2
      RETURNING *
    `,
    [now, messageId],
  );

  if (result.rows.length === 0) {
    throw new Error("Mesajul nu a fost găsit");
  }

  return mapMessageRow(result.rows[0]);
}
