import { neonConfig, neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure neon
neonConfig.fetchConnectionCache = true;

// Create connection with better error handling
const createConnection = () => {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    return drizzle(sql, { schema });
  } catch (error) {
    console.error("Failed to create database connection:", error);
    throw error;
  }
};

export const db = createConnection();