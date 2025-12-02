import { defineConfig } from "drizzle-kit";

/**
 * Drizzle ORM Configuration
 * 
 * Run migrations with: npm run db:push
 * Generate migrations: npm run db:generate
 */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
