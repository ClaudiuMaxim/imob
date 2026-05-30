import { Pool } from "pg";

const globalForPg = globalThis as unknown as {
  pgPool?: Pool;
};

export function getPool() {
  if (globalForPg.pgPool) {
    return globalForPg.pgPool;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL lipsește din variabilele de mediu.");
  }

  const pool = new Pool({
    connectionString,
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPg.pgPool = pool;
  }

  return pool;
}
