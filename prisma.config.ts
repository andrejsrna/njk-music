import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/njk",
  },
});
