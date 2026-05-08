import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const db = new PrismaClient();

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

async function main() {
  const admins = [
    { firstName: "Ariel", lastName: "Admin", email: "ariel@climahvacservice.es", username: "ariel.admin" },
    { firstName: "Wanda", lastName: "Admin", email: "wanda@climahvacservice.es", username: "wanda.admin" },
    { firstName: "Juan",  lastName: "Admin", email: "juan@climahvacservice.es",  username: "juan.admin"  },
  ];

  const tempPassword = "ClimaReus2025!";

  for (const admin of admins) {
    const existing = await db.user.findUnique({ where: { email: admin.email } });
    if (existing) {
      console.log(`⏭  ${admin.email} ya existe, omitido.`);
      continue;
    }
    await db.user.create({
      data: {
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        username: admin.username,
        password: hashPassword(tempPassword),
        role: "admin",
        isActive: true,
        requiresPasswordChange: true,
      },
    });
    console.log(`✅  Admin creado: ${admin.email}`);
  }

  console.log(`\nContraseña temporal para todos los admins nuevos: ${tempPassword}`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
