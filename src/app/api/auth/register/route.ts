import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { hashPassword } from "@/utils/password";
import { validateRegisterData } from "@/utils/validation";
import { UserRole } from "@prisma/client";

/**
 * POST /api/auth/register
 * Registra un nuevo usuario
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos
    const validation = validateRegisterData(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const {
      firstName,
      lastName,
      phoneNumber,
      address,
      city,
      postalCode,
      email,
      username,
      password,
    } = validation.data!;

    // Verificar si el email ya existe
    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already registered",
          errors: { email: "Este email ya está registrado" },
        },
        { status: 409 }
      );
    }

    // Verificar si el username ya existe
    const existingUserByUsername = await db.user.findUnique({
      where: { username },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already taken",
          errors: { username: "Este nombre de usuario ya está en uso" },
        },
        { status: 409 }
      );
    }

    // Hashear contraseña
    const hashedPassword = hashPassword(password);

    // Crear usuario
    const newUser = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        address,
        city,
        postalCode,
        country: "España",
        role: UserRole.cliente,
        isActive: true,
      },
    });

    // También crear el registro en Cliente
    await db.cliente.create({
      data: {
        userId: newUser.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during registration",
      },
      { status: 500 }
    );
  }
}
