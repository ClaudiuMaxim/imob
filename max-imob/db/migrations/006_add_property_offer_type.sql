CREATE TYPE property_offer AS ENUM ('vanzare', 'inchiriere');

ALTER TABLE properties
ADD COLUMN offer_type property_offer NOT NULL DEFAULT 'vanzare';
