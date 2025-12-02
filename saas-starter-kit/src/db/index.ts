import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Database connection using Drizzle ORM
 * 
 * Uses connection pooling for optimal performance
 */

// Connection string from environment
const connectionString = process.env.DATABASE_URL!;

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });

// Create Drizzle instance with schema
export const db = drizzle(client, { schema });

// Export schema for easy access
export * from "./schema";
