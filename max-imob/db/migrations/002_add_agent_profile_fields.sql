ALTER TABLE users
ADD COLUMN name TEXT,
ADD COLUMN phone TEXT;

UPDATE users
SET name = 'Administrator'
WHERE role = 'admin' AND name IS NULL;
