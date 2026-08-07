import { existsSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Run directly by tsx, outside the Prisma CLI, so nothing loads .env for us —
// and since prisma.config.ts exists, Prisma no longer loads it implicitly
// either. Hosts inject real environment variables and have no .env file.
if (existsSync(".env")) {
  try {
    process.loadEnvFile(".env");
  } catch {
    // Node < 20.12 has no loadEnvFile; set the variables in your shell instead.
  }
}

const prisma = new PrismaClient();

const MIN_PASSWORD_LENGTH = 12;

async function main() {
  const email = (process.env.SEED_SUPER_ADMIN_EMAIL ?? "").trim().toLowerCase();
  const password = process.env.SEED_SUPER_ADMIN_PASSWORD ?? "";

  // No fallback credentials. A default password here would end up being the
  // real login for a live site, and anyone reading this repo would know it.
  if (!email) {
    throw new Error(
      "SEED_SUPER_ADMIN_EMAIL is not set. Add it to .env before seeding.",
    );
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `SEED_SUPER_ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters. ` +
        "Generate one with: openssl rand -base64 24",
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    // Only ever repair the role/status. Overwriting passwordHash would silently
    // reset a password the admin has since changed.
    await prisma.user.update({
      where: { email },
      data: { role: "SUPER_ADMIN", status: "ACTIVE" },
    });
    console.log(`Main admin already existed: ${email}`);
    console.log("Role and status confirmed. Password left unchanged.");
    return;
  }

  await prisma.user.create({
    data: {
      name: "Main Admin",
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "SUPER_ADMIN",
    },
  });

  // The password is deliberately not printed — build logs are not private.
  console.log(`Main admin created: ${email}`);
  console.log("Sign in with the password from SEED_SUPER_ADMIN_PASSWORD.");
}

main()
  .catch((err) => {
    console.error(`\nSeed failed: ${err instanceof Error ? err.message : err}\n`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
