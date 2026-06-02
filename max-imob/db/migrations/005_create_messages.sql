CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  message_content TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'unread',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX messages_property_id_idx ON messages(property_id);
CREATE INDEX messages_agent_id_idx ON messages(agent_id);
CREATE INDEX messages_status_idx ON messages(status);
