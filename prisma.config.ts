import path from "node:path";
import { existsSync } from "node:fs";
import { defineConfig } from "prisma/config";

// Once this config file exists, the Prisma CLI no longer loads .env by itself,
// so DATABASE_URL would come back "not found" on every local command. Hosts
// inject real environment variables and have no .env, hence the guard.
if (existsSync(".env")) {
  try {
    process.loadEnvFile(".env");
  } catch {
    // Node < 20.12 has no loadEnvFile. Set the variables in your shell instead.
  }
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
