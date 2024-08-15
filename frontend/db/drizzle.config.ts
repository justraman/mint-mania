import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.PG_URL as string
  },
  verbose: true,
  strict: true
});
