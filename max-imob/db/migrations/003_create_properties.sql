CREATE TYPE property_type AS ENUM ('apartament', 'casa', 'teren', 'comercial');
CREATE TYPE property_status AS ENUM ('ciorna', 'publicata', 'vanduta', 'inchiriata');

CREATE TABLE properties (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  property_type property_type NOT NULL,
  status property_status NOT NULL DEFAULT 'ciorna',
  bedrooms INTEGER NOT NULL DEFAULT 0 CHECK (bedrooms >= 0),
  bathrooms INTEGER NOT NULL DEFAULT 0 CHECK (bathrooms >= 0),
  area NUMERIC(10, 2) NOT NULL CHECK (area > 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX properties_agent_id_idx ON properties(agent_id);
CREATE INDEX properties_public_idx ON properties(status, is_active);
