import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// get absolute path of current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: __dirname + "/../../.env", // absolute path to .env file
});

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
