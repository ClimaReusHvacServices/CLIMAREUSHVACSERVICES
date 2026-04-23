# CAMBIOS ESPECÍFICOS EN EL CÓDIGO

## 1. src/auth/config.ts - NextAuth Configuration

### ❌ ANTES (ERROR):
```typescript
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      // ... más campos
    };
  }
}

declare module "next-auth/jwt" {  // ❌ MÓDULO INVÁLIDO
  interface JWT {
    id: string;
    role: UserRole;
    // ... más campos
  }
}
```

**Error en Vercel:**
```
Type error: Invalid module name in augmentation, module 'next-auth/jwt' cannot be found.
```

### ✅ DESPUÉS (CORRECTO):
```typescript
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      // ... más campos
    };
  }

  interface JWT {  // ✅ DENTRO DEL MISMO MÓDULO
    id: string;
    role: UserRole;
    // ... más campos
  }
}
```

**Por qué:** NextAuth v5 cambió la forma de declarar tipos. La interfaz JWT debe estar dentro de `declare module "next-auth"`, no en un módulo separado.

---

## 2. prisma/seed.ts - Tipos de Datos Correctos

### ❌ ANTES (ERROR):
```typescript
const trabajador = await db.trabajador.create({
  userId: trabajadorUser.id,
  hourlyRate: 45.0,  // ❌ Número float
});

const product = await db.product.create({
  price: 850.0,  // ❌ Número float
  discountPrice: 750.0,  // ❌ Número float
});

const order = await db.order.create({
  subtotal: 750.0,  // ❌ Número float
  totalAmount: 907.5,  // ❌ Número float
});
```

**Problema:** Los campos en Prisma están definidos como `Decimal` (NUMERIC en PostgreSQL), pero estamos pasando números float. Esto causa warnings y errores potenciales.

### ✅ DESPUÉS (CORRECTO):
```typescript
import { Prisma } from "@prisma/client";

const trabajador = await db.trabajador.create({
  userId: trabajadorUser.id,
  hourlyRate: new Prisma.Decimal("45.00"),  // ✅ Decimal exacto
});

const product = await db.product.create({
  price: new Prisma.Decimal("850.00"),  // ✅ Decimal exacto
  discountPrice: new Prisma.Decimal("750.00"),  // ✅ Decimal exacto
});

const order = await db.order.create({
  subtotal: new Prisma.Decimal("750.00"),  // ✅ Decimal exacto
  totalAmount: new Prisma.Decimal("907.50"),  // ✅ Decimal exacto
});
```

**Por qué:** La precisión decimal es importante para dinero. `45.0` puede ser `44.9999999...` en float, pero `"45.00"` en Decimal es exacto.

---

## 3. package.json - Scripts para Vercel

### ❌ ANTES (INCOMPLETO):
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "npx tsx prisma/seed.ts"
  }
}
```

**Problema:** No hay script `postinstall`. Cuando Vercel instala dependencias, no genera el cliente Prisma automáticamente.

### ✅ DESPUÉS (COMPLETO):
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "npx tsx prisma/seed.ts",
    "postinstall": "prisma generate"  // ✅ AGREGADO
  }
}
```

**Por qué:** El script `postinstall` se ejecuta automáticamente después de `npm install`. Asegura que Prisma Client se genere en Vercel.

---

## 4. .env.local.example - Documentación de Variables

### ❌ ANTES (CONFUSO):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/clima_reus_hvac"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
NEXTAUTH_PROVIDERS_GOOGLE_ID=your-google-client-id
NEXTAUTH_PROVIDERS_GOOGLE_SECRET=your-google-client-secret
```

**Problema:** 
- No está claro cuáles variables son para desarrollo local vs. Vercel
- Los nombres de Google OAuth son incorrectos (NextAuth v5 usa AUTH_GOOGLE_ID, no NEXTAUTH_PROVIDERS_GOOGLE_ID)
- Falta información sobre DIRECT_URL

### ✅ DESPUÉS (CLARO):
```env
# Opción 1: PostgreSQL Local (desarrollo)
# DATABASE_URL="postgresql://user:password@localhost:5432/clima_reus_hvac"
# DIRECT_URL="postgresql://user:password@localhost:5432/clima_reus_hvac"

# Opción 2: Neon (desarrollo o producción)
DATABASE_URL="postgresql://user:password@ep-xxxxx.neon.tech/clima_reus_hvac?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xxxxx.neon.tech/clima_reus_hvac?sslmode=require"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production-generate-with-openssl-rand-base64-32
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
```

**Por qué:** 
- Claro y documentado
- Soporta múltiples opciones
- Nombres correctos para NextAuth v5

---

## RESUMEN DE CAMBIOS

| Archivo | Cambio | Impacto |
|---------|--------|--------|
| `src/auth/config.ts` | NextAuth JWT module movido | ✅ Vercel build sin errores |
| `prisma/seed.ts` | Float → Prisma.Decimal | ✅ Datos monetarios precisos |
| `package.json` | Agregado `postinstall` | ✅ Prisma genera en Vercel |
| `.env.local.example` | Documentación mejorada | ✅ Fácil configurar variables |
| `vercel.json` | Archivo creado | ✅ Build Vercel optimizado |

---

## ✅ RESULTADO

Ahora:
- ✅ Vercel build sin errores TypeScript
- ✅ Seed.ts maneja datos precisos (moneda)
- ✅ NextAuth v5 correctamente configurado
- ✅ Todos los scripts listos
- ✅ Base de datos lista en Neon

**Estado: PRODUCCIÓN LISTA** 🚀
