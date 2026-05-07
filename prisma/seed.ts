import { PrismaClient, UserRole, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

// Usamos PrismaClient directo (no el singleton del app) para el seed
const db = new PrismaClient();

function hash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

async function main() {
  console.log("Iniciando seed de base de datos...");

  try {
    // ── CATEGORÍAS ────────────────────────────────────────────
    const CATEGORIES = [
      { name: "Aire Acondicionado Split",    slug: "aire-acondicionado",  icon: "Wind" },
      { name: "Aire Acondicionado Multisplit", slug: "multisplit",         icon: "Wind" },
      { name: "Aerotermia",                  slug: "aerotermia",          icon: "Thermometer" },
      { name: "Caldera de Gas",              slug: "calderas",            icon: "Flame" },
      { name: "Accesorios y Repuestos",      slug: "accesorios",          icon: "Wrench" },
    ];

    for (const cat of CATEGORIES) {
      await db.productCategory.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, icon: cat.icon },
        create: cat,
      });
    }
    console.log("Categorías creadas");

    // ── USUARIOS ──────────────────────────────────────────────

    const adminUser = await db.user.upsert({
      where: { email: "admin@climareus.es" },
      update: {},
      create: {
        email: "admin@climareus.es",
        username: "admin",
        password: hash("Admin123!@"),
        firstName: "Admin",
        lastName: "Sistema",
        phoneNumber: "+34 900 123 456",
        address: "Calle Administración, 1",
        role: UserRole.admin,
        isActive: true,
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });
    console.log("Admin creado:", adminUser.email);

    const clienteUser = await db.user.upsert({
      where: { email: "cliente@ejemplo.es" },
      update: {},
      create: {
        email: "cliente@ejemplo.es",
        username: "cliente1",
        password: hash("Cliente123!@"),
        firstName: "Juan",
        lastName: "García",
        phoneNumber: "+34 612 345 678",
        address: "Calle Principal, 123",
        city: "Reus",
        postalCode: "43201",
        country: "España",
        role: UserRole.cliente,
        isActive: true,
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });
    console.log("Cliente creado:", clienteUser.email);

    const trabajadorUser = await db.user.upsert({
      where: { email: "trabajador@climareus.es" },
      update: {},
      create: {
        email: "trabajador@climareus.es",
        username: "trabajador1",
        password: hash("Trabajador123!@"),
        firstName: "Carlos",
        lastName: "Martínez",
        phoneNumber: "+34 623 456 789",
        address: "Calle de Trabajo, 456",
        city: "Reus",
        postalCode: "43201",
        country: "España",
        role: UserRole.trabajador,
        isActive: true,
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });
    console.log("Trabajador creado:", trabajadorUser.email);

    // ── PERFILES EXTENDIDOS ───────────────────────────────────

    const clienteRecord = await db.cliente.upsert({
      where: { userId: clienteUser.id },
      update: {},
      create: { userId: clienteUser.id },
    });

    await db.trabajador.upsert({
      where: { userId: trabajadorUser.id },
      update: {},
      create: {
        userId: trabajadorUser.id,
        specialties: ["instalación", "mantenimiento"],
        certifications: ["Certificado HVAC", "Certificado Frigorista"],
        yearsExperience: 5,
        isAvailable: true,
        hourlyRate: new Prisma.Decimal("45.00"),
      },
    });
    console.log("Trabajador extendido creado");

    // ── PRODUCTOS ─────────────────────────────────────────────

    const ac1 = await db.product.upsert({
      where: { sku: "AC-SAMSUNG-18-2024" },
      update: {},
      create: {
        name: "Samsung AR18JSNHBKX - Split 18000 BTU",
        description: "Aire acondicionado split 18000 BTU, eficiencia A++, inverter",
        shortDescription: "Split Samsung 18K BTU",
        category: "aire-acondicionado",
        sku: "AC-SAMSUNG-18-2024",
        manufacturer: "Samsung",
        modelNumber: "AR18JSNHBKX",
        price: new Prisma.Decimal("850.00"),
        discountPrice: new Prisma.Decimal("750.00"),
        stock: 15,
        warranty: "2 años",
        isActive: true,
      },
    });
    console.log("Producto 1 creado:", ac1.name);

    const ac2 = await db.product.upsert({
      where: { sku: "AC-LG-24-2024" },
      update: {},
      create: {
        name: "LG Dual Inverter 24000 BTU",
        description: "Aire acondicionado 24000 BTU, dual inverter, eficiencia A+++",
        shortDescription: "LG Dual Inverter 24K",
        category: "aire-acondicionado",
        sku: "AC-LG-24-2024",
        manufacturer: "LG",
        modelNumber: "DuaLinverter24000",
        price: new Prisma.Decimal("1200.00"),
        discountPrice: new Prisma.Decimal("1050.00"),
        stock: 8,
        warranty: "3 años",
        isActive: true,
      },
    });
    console.log("Producto 2 creado:", ac2.name);

    // ── SERVICIOS ─────────────────────────────────────────────

    const svcInstall = await db.service.upsert({
      where: { id: "svc-instalacion-1" },
      update: {},
      create: {
        id: "svc-instalacion-1",
        name: "Instalación Profesional",
        description: "Instalación completa: montaje, cableado, pruebas y limpieza",
        type: "instalacion",
        basePrice: new Prisma.Decimal("200.00"),
        estimatedDuration: 240,
        difficulty: "media",
        isActive: true,
      },
    });

    await db.service.upsert({
      where: { id: "svc-mantenimiento-1" },
      update: {},
      create: {
        id: "svc-mantenimiento-1",
        name: "Mantenimiento y Limpieza",
        description: "Limpieza de filtros, comprobación de refrigerante y ajustes",
        type: "mantenimiento",
        basePrice: new Prisma.Decimal("80.00"),
        estimatedDuration: 60,
        difficulty: "baja",
        isActive: true,
      },
    });
    console.log("Servicios creados");

    // ── PAQUETES PRODUCTO + SERVICIO ──────────────────────────

    await db.servicePackage.upsert({
      where: { productId_serviceId: { productId: ac1.id, serviceId: svcInstall.id } },
      update: {},
      create: {
        name: "Samsung 18K + Instalación",
        description: "Aire acondicionado Samsung con instalación incluida",
        productId: ac1.id,
        serviceId: svcInstall.id,
        packagePrice: new Prisma.Decimal("950.00"),
        discountPercentage: new Prisma.Decimal("5.00"),
        isActive: true,
      },
    });

    await db.servicePackage.upsert({
      where: { productId_serviceId: { productId: ac2.id, serviceId: svcInstall.id } },
      update: {},
      create: {
        name: "LG 24K + Instalación",
        description: "Aire acondicionado LG con instalación incluida",
        productId: ac2.id,
        serviceId: svcInstall.id,
        packagePrice: new Prisma.Decimal("1250.00"),
        discountPercentage: new Prisma.Decimal("5.00"),
        isActive: true,
      },
    });
    console.log("Paquetes creados");

    // ── DIRECCIÓN DEL CLIENTE ─────────────────────────────────

    const clientAddress = await db.clientAddress.upsert({
      where: { id: "addr-cliente-1" },
      update: {},
      create: {
        id: "addr-cliente-1",
        clienteId: clienteRecord.id,
        label: "principal",
        street: "Calle Principal, 123",
        city: "Reus",
        state: "Tarragona",
        postalCode: "43201",
        country: "España",
        isDefault: true,
      },
    });
    console.log("Dirección creada");

    // ── PEDIDO DE EJEMPLO ─────────────────────────────────────

    const order = await db.order.upsert({
      where: { orderNumber: "ORD-2026-001" },
      update: {},
      create: {
        orderNumber: "ORD-2026-001",
        userId: clienteUser.id,
        clientId: clienteRecord.id,
        addressId: clientAddress.id,
        status: "pendiente",
        paymentStatus: "pendiente",
        subtotal: new Prisma.Decimal("750.00"),
        taxAmount: new Prisma.Decimal("157.50"),
        shippingCost: new Prisma.Decimal("0.00"),
        totalAmount: new Prisma.Decimal("907.50"),
        installationRequired: false,
        notes: "Pedido de ejemplo",
      },
    });

    await db.orderItem.upsert({
      where: { id: "item-order-1" },
      update: {},
      create: {
        id: "item-order-1",
        orderId: order.id,
        productId: ac1.id,
        quantity: 1,
        unitPrice: new Prisma.Decimal("750.00"),
        discount: new Prisma.Decimal("0.00"),
        totalPrice: new Prisma.Decimal("750.00"),
      },
    });
    console.log("Pedido de ejemplo creado");

    console.log("\nSEED COMPLETADO CORRECTAMENTE");
    console.log("\nCUENTAS DE PRUEBA DISPONIBLES:");
    console.log("  Admin");
    console.log("     Email:    admin@climareus.es");
    console.log("     Password: Admin123!@");
    console.log("     Rol:      admin");
    console.log("\n  Cliente");
    console.log("     Email:    cliente@ejemplo.es");
    console.log("     Password: Cliente123!@");
    console.log("     Rol:      cliente");
    console.log("\n  Trabajador");
    console.log("     Email:    trabajador@climareus.es");
    console.log("     Password: Trabajador123!@");
    console.log("     Rol:      trabajador");
    console.log("\nBase de datos lista para usar en Vercel y desarrollo local.");
  } catch (error) {
    console.error("Error en seed:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();
