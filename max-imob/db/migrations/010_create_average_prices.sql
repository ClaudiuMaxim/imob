CREATE TABLE average_prices (
  id TEXT PRIMARY KEY,
  "type" property_type NOT NULL,
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  offer_type property_offer NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT average_prices_unique_group UNIQUE ("type", city_id, offer_type)
);

CREATE INDEX average_prices_city_id_idx ON average_prices(city_id);
CREATE INDEX average_prices_group_idx ON average_prices("type", city_id, offer_type);

CREATE OR REPLACE FUNCTION recalculate_average_prices()
RETURNS void AS $$
BEGIN
  DELETE FROM average_prices;

  INSERT INTO average_prices (
    id,
    "type",
    city_id,
    offer_type,
    price,
    updated_at
  )
  SELECT
    'avg-' || md5(property_type::TEXT || '|' || city_id || '|' || offer_type::TEXT) AS id,
    property_type AS "type",
    city_id,
    offer_type,
    ROUND(AVG(price / area), 2) AS price,
    CURRENT_TIMESTAMP AS updated_at
  FROM properties
  WHERE is_active = true
    AND (
      (offer_type = 'vanzare' AND status = 'vanduta')
      OR (offer_type = 'inchiriere' AND status = 'inchiriata')
    )
  GROUP BY property_type, city_id, offer_type;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_average_prices_after_property_change()
RETURNS trigger AS $$
BEGIN
  PERFORM recalculate_average_prices();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER properties_average_prices_after_insert_update
AFTER INSERT OR UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION refresh_average_prices_after_property_change();

SELECT recalculate_average_prices();
