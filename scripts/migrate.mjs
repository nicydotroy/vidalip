#!/usr/bin/env node
/**
 * Runs `prisma migrate deploy` during the build.
 *
 * The schema declares `directUrl = env("DIRECT_URL")` because connection
 * poolers can break migrations. Prisma has no way to express a default for
 * that, so a missing DIRECT_URL would fail the whole build on a schema
 * validation error — even though the pooled URL usually works fine.
 *
 * This falls back to DATABASE_URL and says so, instead of hard-failing.
 */
import { spawnSync } from "node:child_process";

const env = { ...process.env };

if (!env.DATABASE_URL) {
  console.error(
    "\n[migrate] DATABASE_URL is not set.\n" +
      "          Add it in your host's environment variables (for Neon, use the\n" +
      "          pooled connection string — the host containing '-pooler').\n",
  );
  process.exit(1);
}

if (!env.DIRECT_URL) {
  env.DIRECT_URL = env.DATABASE_URL;
  console.warn(
    "\n[migrate] DIRECT_URL is not set — falling back to DATABASE_URL.\n" +
      "          This works, but for reliable migrations set DIRECT_URL to Neon's\n" +
      "          direct (non-pooled) connection string.\n",
  );
}

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["prisma", "migrate", "deploy"],
  { stdio: "inherit", env },
);

process.exit(result.status ?? 1);
