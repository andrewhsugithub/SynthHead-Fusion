import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import "dotenv/config";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
