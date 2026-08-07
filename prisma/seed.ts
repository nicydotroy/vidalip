import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.SEED_SUPER_ADMIN_EMAIL ?? "admin@vidalip.test")
    .trim()
    .toLowerCase();
  const password = process.env.SEED_SUPER_ADMIN_PASSWORD ?? "Admin@12345";

  const passwordHash = await bcrypt.hash(password, 12);

  // Idempotent: re-running never downgrades or duplicates the main admin.
  const superAdmin = await prisma.user.upsert({
    where: { email },
    update: { role: "SUPER_ADMIN", status: "ACTIVE" },
    create: {
      name: "Main Admin",
      email,
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  console.log(`Main admin ready: ${superAdmin.email}`);
  console.log(`Password: ${password}`);
  console.log("Change this password after your first login.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
