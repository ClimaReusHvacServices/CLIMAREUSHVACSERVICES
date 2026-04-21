# Clima Reus HVAC - Plataforma de Servicios

Plataforma profesional para venta e instalación de sistemas de aire acondicionado.

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Styles**: Tailwind CSS v4
- **Database**: PostgreSQL (Neon)
- **Auth**: NextAuth.js v5
- **ORM**: Prisma
- **i18n**: next-intl
- **Validation**: Zod

### Estructura de Carpetas

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # Rutas API
│   │   └── auth/                 # Rutas de autenticación
│   │       └── [...nextauth]/    # NextAuth handler
│   ├── [locale]/                 # Soporte multiidioma
│   │   ├── (auth)/               # Grupo de rutas públicas
│   │   │   ├── login/            # Página de login
│   │   │   └── register/         # Página de registro
│   │   └── (dashboard)/          # Grupo de rutas protegidas
│   │       └── admin/            # Dashboard de admin
│   ├── globals.css               # Estilos globales
│   └── layout.tsx                # Layout raíz
├── auth/                         # Configuración de autenticación
│   └── config.ts                 # Configuración de NextAuth
├── components/                   # Componentes React
│   ├── auth/                     # Componentes de autenticación
│   ├── dashboard/                # Componentes de dashboard
│   └── common/                   # Componentes reutilizables
├── db/                           # Configuración de base de datos
│   └── index.ts                  # Cliente de Prisma
├── hooks/                        # React hooks personalizados
├── i18n/                         # Configuración de i18n
│   ├── messages/                 # Traducciones JSON
│   │   ├── es.json               # Español
│   │   ├── en.json               # Inglés
│   │   └── ca.json               # Catalán
│   ├── request.ts                # Configuración de next-intl
│   └── routing.ts                # Rutas con i18n
├── lib/                          # Funciones utilitarias
├── middleware.ts                 # Middleware de Next.js
├── types/                        # Tipos TypeScript
│   └── index.ts                  # Tipos globales
└── utils/                        # Funciones auxiliares
    ├── password.ts               # Hashing y verificación de contraseñas
    └── validation.ts             # Validación de formularios

prisma/
├── schema.prisma                 # Esquema de base de datos
└── migrations/                   # Migraciones de BD

.env.local.example                # Ejemplo de variables de entorno
.gitignore                        # Archivos ignorados por git
```

## 🔐 Seguridad

### Autenticación

- **Hashing de contraseñas**: bcryptjs (SALT_ROUNDS = 10)
- **Sesiones seguras**: JWT con NextAuth.js
- **Recordar sesión**: Token hasheado almacenado seguramente
- **OAuth**: Google OAuth2 integrado
- **HTTPS requerido** en producción

### Protección de Rutas

El middleware `src/middleware.ts` protege las rutas automáticamente:

```typescript
// Rutas públicas: /login, /register
// Rutas admin: requieren role === 'admin'
// Rutas cliente: requieren role === 'cliente'
// Rutas trabajador: requieren role === 'trabajador'
```

## 🗄️ Base de Datos

### Tablas Principales

#### User
- Información de todos los usuarios del sistema
- Campos: id, email, username, password, firstName, lastName, phoneNumber, address, role, isActive, emailVerified, lastLoginAt, rememberTokenHash, createdAt, updatedAt

#### Cliente
- Extensión de User para clientes
- Campos: id, userId, companyName, businessRegNumber, totalOrders, totalSpent, averageRating, preferredLanguage, isBlacklisted

#### Trabajador
- Extensión de User para trabajadores
- Campos: id, userId, specialties, certifications, yearsExperience, isAvailable, availability, hourlyRate, averageRating, totalJobsCompleted, verificationStatus

#### Order
- Pedidos de clientes
- Estados: pendiente, confirmada, en_progreso, completada, cancelada
- Campos: id, orderNumber, userId, clientId, addressId, status, paymentStatus, subtotal, taxAmount, shippingCost, totalAmount, installationRequired, notes, scheduledDate, completedDate

#### Product
- Productos (aires acondicionados, repuestos, etc.)
- Categorías: aire-acondicionado, repuestos, etc.
- Campos: id, name, description, category, sku, price, discountPrice, stock, images, specifications, warranty, isActive

#### Service
- Servicios (instalación, mantenimiento, reparación)
- Campos: id, name, description, type, basePrice, estimatedDuration, difficulty, requirements, isActive

#### ServicePackage
- Combinación Producto + Servicio
- Campos: id, name, productId, serviceId, packagePrice, discountPercentage, isActive

#### Task
- Tareas asignadas a trabajadores
- Estados: pendiente, en_progreso, completada, cancelada
- Campos: id, orderId, assignedToId, status, priority, description, startDate, endDate, completedAt

#### Payment
- Información de pagos
- Estados: pendiente, pagado, fallido, reembolsado
- Campos: id, orderId, amount, currency, paymentMethod, transactionId, status, paidAt, refundedAt

#### Invoice
- Facturas de pedidos
- Campos: id, orderId, invoiceNumber, issueDate, dueDate, paidDate, totalAmount, taxAmount

#### Review
- Reseñas y calificaciones
- Campos: id, orderId, clienteId, trabajadorId, rating, title, comment, verified, createdAt

#### Notification
- Notificaciones a usuarios
- Campos: id, userId, type, title, message, relatedId, isRead, readAt

## 🔄 Flujos de Negocio

### Registro e Login

```
1. Usuario llena formulario de registro
   ↓
2. Validación en cliente (Zod)
   ↓
3. POST /api/auth/register
   - Validar datos de nuevo
   - Verificar email/username únicos
   - Hashear contraseña
   - Crear User y Cliente
   ↓
4. Redirigir a login
   ↓
5. Usuario inicia sesión
   - Credenciales → NextAuth
   - Verificar contraseña
   - Crear sesión JWT
   - Actualizar lastLoginAt
   ↓
6. Redirigir a dashboard según role
```

### Compra de Producto

```
1. Cliente ve productos
   ↓
2. Selecciona:
   - Solo aire acondicionado
   - Aire + instalación (ServicePackage)
   ↓
3. Crear Order
   - status: pendiente
   - paymentStatus: pendiente
   - installationRequired: true/false
   ↓
4. Procesar pago
   - Crear Payment
   - Si pagado: status → confirmada
   ↓
5. Admin ve orden
   ↓
6. Si requiere instalación:
   - Crear Task
   - Asignar a trabajador
   ↓
7. Trabajador completa tarea
   - Task status → completada
   - Order status → completada
   ↓
8. Cliente deja reseña (Review)
```

## 🛠️ Instalación y Configuración

### Prerequisitos

- Node.js 18+
- npm o yarn
- PostgreSQL (local o Neon)

### Pasos de Instalación

1. **Clonar repositorio**
```bash
git clone <url>
cd clima-reus-hvac
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.local.example .env.local
# Editar .env.local con tus valores
```

4. **Configurar base de datos**
```bash
# Generar cliente de Prisma
npm run db:generate

# Crear tabla s en BD
npm run db:push

# O hacer migraciones
npm run db:migrate
```

5. **Crear usuario admin (opcional)**
```bash
npm run db:seed  # Si tienes script de seed
```

6. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

7. **Abrir en navegador**
```
http://localhost:3000
```

## 📝 Variables de Entorno

```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/clima_reus_hvac"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_PROVIDERS_GOOGLE_ID=your-google-id
NEXTAUTH_PROVIDERS_GOOGLE_SECRET=your-google-secret

# Aplicación
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=Clima Reus HVAC
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🌐 Idiomas Soportados

- **Español (es)** - Predeterminado
- **Inglés (en)**
- **Catalán (ca)**

Cambiar idioma automáticamente redirige a la ruta correspondiente.

## 👥 Roles y Permisos

### Admin
- ✅ Ver dashboard
- ✅ Gestionar usuarios
- ✅ Registrar trabajadores
- ✅ Ver todas las órdenes
- ✅ Asignar tareas
- ✅ Gestionar productos y servicios

### Cliente
- ✅ Ver dashboard
- ✅ Ver productos
- ✅ Hacer compras
- ✅ Ver pedidos
- ✅ Dejar reseñas
- ✅ Gestionar perfil

### Trabajador
- ✅ Ver tareas asignadas
- ✅ Actualizar estado de tareas
- ✅ Ver detalles de órdenes
- ✅ Registrar comentarios en tareas
- ✅ Ver evaluaciones

## 📱 Componentes Reutilizables

### InputField
```tsx
<InputField
  label="Email"
  type="email"
  error={errors.email}
  placeholder="usuario@ejemplo.com"
  required
/>
```

### Button
```tsx
<Button
  variant="primary" | "secondary" | "outline" | "danger"
  size="sm" | "md" | "lg"
  isLoading={false}
  fullWidth={false}
>
  Texto del botón
</Button>
```

### LanguageSwitcher
```tsx
<LanguageSwitcher />
```

## 🚀 Despliegue a Producción

### Hostinger

1. **Clonar en servidor**
2. **Configurar variables de entorno** con Neon
3. **Build**: `npm run build`
4. **Start**: `npm start`
5. **Configurar PM2 o forever** para mantener el proceso activo
6. **Nginx/Apache** como reverse proxy
7. **SSL/TLS** (Let's Encrypt)

### Checklist Preproducción

- [ ] NEXTAUTH_SECRET seguro y aleatorio
- [ ] DATABASE_URL apunta a Neon
- [ ] NEXTAUTH_URL con dominio producción
- [ ] Variantes de OAuth configuradas para dominio
- [ ] Logs de error configurados
- [ ] Backups automáticos de BD
- [ ] Monitoreo de rendimiento
- [ ] CDN para assets estáticos

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app)

## 📞 Soporte

Para reportar bugs o sugerir mejoras, crear un issue en el repositorio.

## 📄 Licencia

Privado - Clima Reus HVAC
