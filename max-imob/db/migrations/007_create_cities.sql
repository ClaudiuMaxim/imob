CREATE TABLE cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  county_code VARCHAR(2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT cities_name_county_code_key UNIQUE (name, county_code)
);

CREATE INDEX cities_name_idx ON cities(name);
CREATE INDEX cities_county_code_idx ON cities(county_code);
CREATE INDEX cities_is_active_idx ON cities(is_active);
