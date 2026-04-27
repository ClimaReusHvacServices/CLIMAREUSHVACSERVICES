# GUÍA PARA AGREGAR NUEVAS CARACTERÍSTICAS

Este documento explica cómo agregar nuevas funcionalidades al proyecto manteniendo la estructura.

---

## Checklist para Nueva Característica

```
1. Actualizar schema.prisma si necesitas nuevas tablas/campos
2. Crear migraciones: npm run db:migrate
3. Actualizar tipos en src/types/index.ts si aplica
4. Crear componentes en src/components/
5. Crear páginas en src/app/[locale]/
6. Crear API routes en src/app/api/ si necesitas
7. Agregar validaciones en src/utils/validation.ts
8. Actualizar traducciones en src/i18n/messages/
9. Proteger rutas si es necesario en middleware.ts
```

---

## Ejemplo: Agregar Dashboard de Cliente

### Paso 1: Actualizar schema.prisma (si necesario)

En este caso, ya tenemos las tablas necesarias (User, Cliente, Order, etc.).

### Paso 2: Actualizar tipos

```typescript
// src/types/index.ts
export interface IClientDashboard {
  totalOrders: number;
  totalSpent: number;
  recentOrders: IOrder[];
  pendingOrders: IOrder[];
}
```

### Paso 3: Crear componentes

```typescript
// src/components/dashboard/ClientDashboard.tsx
"use client";

export function ClientDashboard({ data }: { data: IClientDashboard }) {
  return (
    <div className="space-y-6">
      {/* Contenido */}
    </div>
  );
}
```

### Paso 4: Crear página

```typescript
// src/app/[locale]/(dashboard)/dashboard/page.tsx
import { auth } from "@/auth/config";
import { db } from "@/db";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";

export default async function ClientDashboardPage() {
  const session = await auth();
  
  if (!session || session.user?.role !== "cliente") {
    redirect("/");
  }
  
  const cliente = await db.cliente.findFirst({
    where: { userId: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });
  
  return <ClientDashboard data={cliente} />;
}
```

### Paso 5: Actualizar traducciones

```json
// src/i18n/messages/es.json
{
  "dashboard": {
    "client": {
      "welcome": "Bienvenido a tu dashboard",
      "myOrders": "Mis Pedidos",
      "totalSpent": "Total Gastado"
    }
  }
}
```

---

## Ejemplo: Agregar Nueva API Route

### Crear API para obtener órdenes de cliente

```typescript
// src/app/api/orders/route.ts
import { auth } from "@/auth/config";
import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    const orders = await db.order.findMany({
      where: { userId: session.user?.id },
      include: { items: true, payment: true },
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(
      { success: true, data: orders },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
```

---

## Ejemplo: Agregar Validación Personalizada

```typescript
// src/utils/validation.ts - Agregar nuevo schema

export const orderSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().min(1),
  addressId: z.string().cuid(),
});

export type OrderInput = z.infer<typeof orderSchema>;

export function validateOrderData(data: unknown) {
  const result = orderSchema.safeParse(data);
  
  if (!result.success) {
    const errors: FormErrors = {};
    result.error.errors.forEach((err) => {
      const path = err.path[0] as string;
      errors[path] = err.message;
    });
    return { success: false, errors };
  }
  
  return { success: true, data: result.data };
}
```

---

## Ejemplo: Agregar Nueva Tabla a BD

### 1. Actualizar schema.prisma

```prisma
model CouponCode {
  id              String    @id @default(cuid())
  code            String    @unique
  discountPercent Decimal   @db.Decimal(5, 2)
  maxUses         Int?
  uses            Int       @default(0)
  expiresAt       DateTime?
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  orders          Order[]
  
  @@index([code])
  @@index([isActive])
}

// Agregar a Order si corresponde:
model Order {
  // ... campos existentes ...
  couponCodeId    String?
  couponCode      CouponCode? @relation(fields: [couponCodeId], references: [id])
}
```

### 2. Crear migración

```bash
npm run db:migrate

# El sistema preguntará nombre:
# ✔ Name of migration … add_coupon_codes_table
```

### 3. Usar en código

```typescript
const order = await db.order.create({
  data: {
    // ... datos ...
    couponCodeId: couponId,
  },
  include: { couponCode: true },
});
```

---

## 🔒 Ejemplo: Proteger Ruta por Rol

```typescript
// src/middleware.ts - Agregar nueva ruta

const roleBasedRoutes = {
  admin: ["/admin"],
  cliente: ["/dashboard", "/orders", "/profile", "/shop"],
  trabajador: ["/worker", "/worker/tasks"],
};

// El middleware automáticamente protege /shop para clientes
```

---

## Ejemplo: Agregar Nuevo Idioma

### 1. Crear archivo de mensajes

```json
// src/i18n/messages/fr.json
{
  "common": {
    "appName": "Clima Reus HVAC",
    "submit": "Soumettre",
    // ... todas las claves ...
  }
}
```

### 2. Actualizar routing

```typescript
// src/i18n/routing.ts
export const routing = defineRouting({
  locales: ["es", "en", "ca", "fr"], // ← Agregar "fr"
  defaultLocale: "es",
  // ... resto ...
});
```

### 3. Actualizar request.ts

```typescript
// src/i18n/request.ts
const messages = {
  es: () => import("./messages/es.json").then((m) => m.default),
  en: () => import("./messages/en.json").then((m) => m.default),
  ca: () => import("./messages/ca.json").then((m) => m.default),
  fr: () => import("./messages/fr.json").then((m) => m.default), // ← Agregar
};
```

---

## 🎨 Ejemplo: Crear Nuevo Componente Reutilizable

```typescript
// src/components/common/Modal.tsx
"use client";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ isOpen, title, children, onClose }: ModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="border-b p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
```

---

## 🔄 Flujo Recomendado para Desarrollo

### 1. Planificar (5 min)
- ¿Qué tablas necesito?
- ¿Qué componentes necesito?
- ¿Qué páginas necesito?

### 2. Base de datos (10 min)
```bash
# Actualizar schema.prisma
npm run db:migrate
npm run db:studio  # Verificar
```

### 3. API (10 min)
```bash
# Crear rutas API
# Crear validaciones
```

### 4. Componentes (20 min)
```bash
# Crear componentes reutilizables
# Usar Tailwind CSS
```

### 5. Páginas (15 min)
```bash
# Crear páginas
# Conectar a BD y API
```

### 6. Traducciones (5 min)
```bash
# Agregar a todos los idiomas
```

### 7. Testing (10 min)
```bash
npm run dev
# Probar en navegador
# Probar en diferentes idiomas
```

---

## 📦 Estructura Recomendada para Feature Completa

```
Feature: Carrito de Compra
├── Base de datos
│   ├── Model: Cart (si lo necesitas persistido)
│   └── Relaciones: User → Cart → CartItem → Product
├── 🔌 API
│   ├── POST /api/cart/items       → Agregar al carrito
│   ├── DELETE /api/cart/items/:id → Quitar del carrito
│   └── GET /api/cart              → Obtener carrito
├── 🎨 Componentes
│   ├── CartSummary.tsx            → Resumen del carrito
│   ├── CartItem.tsx               → Item individual
│   └── CartCheckout.tsx           → Checkout
├── 📄 Páginas
│   └── /[locale]/checkout         → Página de carrito
├── Traducciones
│   └── Agregar keys para carrito
└── 🔒 Seguridad
    └── Validar permisos en API
```

---

## Cosas a Evitar

### NO hacer

```typescript
// Usar fetch en servidor sin async
const data = fetch(...);

// Exponer secrets en cliente
const apiKey = process.env.SECRET_KEY;

// Ignorar tipos TypeScript
const data: any = ...;

// Validar solo en cliente
// Siempre validar en servidor también

// Crear estilos inline
<div style={{ color: "red" }}>

// Hardcodear textos
<p>Hola Usuario</p>
```

### SÍ hacer

```typescript
// Usar async/await
const data = await fetch(...);

// Usar variables de entorno
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

// Usar tipos específicos
const data: Order = ...;

// Validar siempre en servidor
const validation = validateOrderData(body);

// Usar Tailwind CSS
<div className="text-red-500">

// Usar traducciones
<p>{t("greeting.hello")}</p>
```

---

## Checklist Antes de Hacer Commit

```
□ Código funciona localmente
□ No hay errores en terminal
□ TypeScript compila sin warnings
□ ESLint pasa (npm run lint)
□ Probé con diferentes idiomas
□ Base de datos creada correctamente
□ API valida datos en servidor
□ Componentes son reutilizables
□ Traducciones actualizadas
□ Git .gitignore actualizado
```

---

## 💡 Tips Útiles

### Genera tipos desde Prisma
```bash
npm run db:generate
# Luego puedes importar tipos de @prisma/client
```

### Visualiza cambios en BD
```bash
npm run db:studio
# Se abre http://localhost:5555
```

### Resetea BD (Pierde datos)
```bash
npm run db:push -- --force-reset
npm run db:seed
```

### Hot reload en desarrollo
```bash
npm run dev
# Los cambios se reflejan automáticamente
```

---

## 📚 Recursos Rápidos

| Necesidad | Dónde Buscar |
|---|---|
| Tipos disponibles | `src/types/index.ts` |
| Esquema BD | `prisma/schema.prisma` |
| Traducciones | `src/i18n/messages/es.json` |
| Componentes reutilizables | `src/components/common/` |
| Validaciones | `src/utils/validation.ts` |
| Configuración Auth | `src/auth/config.ts` |
| Rutas protegidas | `src/middleware.ts` |

---

**¡Ahora estás listo para agregar nuevas características!**
