import { defineConfig } from "drizzle-kit";
import config from "../config";

export default defineConfig({
  schema: "./app/db/schema.ts",
  out: "./app/db/drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    uri: config.dbUrl
  },
  verbose: true,
  strict: true
});
