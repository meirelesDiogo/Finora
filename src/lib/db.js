import pg from "pg";

const { Pool } = pg;
const globalForPool = globalThis;
const pool = globalForPool.finoraPool || new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});
if (process.env.NODE_ENV !== "production") globalForPool.finoraPool = pool;
export default pool;
