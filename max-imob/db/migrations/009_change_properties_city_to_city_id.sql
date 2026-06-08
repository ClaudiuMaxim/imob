ALTER TABLE properties
ADD COLUMN city_id TEXT;

UPDATE properties
SET city_id = cities.id
FROM cities
WHERE LOWER(translate(properties.city, 'ăâîșşțţĂÂÎȘŞȚŢ', 'aaissttAAISSTT')) =
  LOWER(translate(cities.name, 'ăâîșşțţĂÂÎȘŞȚŢ', 'aaissttAAISSTT'));

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM properties WHERE city_id IS NULL) THEN
    RAISE EXCEPTION 'Some properties could not be matched to cities.city_id';
  END IF;
END $$;

ALTER TABLE properties
ALTER COLUMN city_id SET NOT NULL;

ALTER TABLE properties
ADD CONSTRAINT properties_city_id_fkey
FOREIGN KEY (city_id) REFERENCES cities(id);

CREATE INDEX properties_city_id_idx ON properties(city_id);

ALTER TABLE properties
DROP COLUMN city;
