import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const db = new PrismaClient();

const TEMP_PASSWORD = "ClimaReus2025!";

async function main() {
  const targets = [
    "ariel@climahvacservice.es",
    "wanda@climahvacservice.es",
  ];

  const hashed = bcryptjs.hashSync(TEMP_PASSWORD, 10);

  for (const email of targets) {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`❌  No encontrado: ${email}`);
      continue;
    }
    await db.user.update({
      where: { email },
      data: {
        password: hashed,
        requiresPasswordChange: true,
        role: "admin",
        isActive: true,
      },
    });
    console.log(`✅  Actualizado: ${email}`);
  }

  console.log(`\nContraseña temporal: ${TEMP_PASSWORD}`);
  console.log("Los usuarios deberán cambiarla en su primer inicio de sesión.");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
