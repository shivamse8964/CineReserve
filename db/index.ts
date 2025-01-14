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

// Create connection with better error handling and retries
const createConnection = async () => {
  let retries = 3;
  let lastError;

  while (retries > 0) {
    try {
      console.log(`Attempting to connect to database (${retries} retries left)...`);
      const sql = neon(process.env.DATABASE_URL!);
      const db = drizzle(sql, { schema });

      // Test the connection with a simple query
      await sql`SELECT 1`;
      console.log("Database connection established and verified successfully");
      return { db, sql };
    } catch (error) {
      lastError = error;
      console.error(`Failed to create database connection (${retries} retries left):`, error);
      retries--;
      if (retries > 0) {
        // Wait for 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  throw new Error(`Failed to connect to database after multiple attempts: ${lastError}`);
};

// Export a single database connection promise
let connectionPromise: ReturnType<typeof createConnection> | null = null;

export const getConnection = async () => {
  if (!connectionPromise) {
    connectionPromise = createConnection();
  }
  return connectionPromise;
};

// Export the database instance
export const db = async () => {
  const { db } = await getConnection();
  return db;
};

// Export the SQL query function
export const sql = async () => {
  const { sql } = await getConnection();
  return sql;
};