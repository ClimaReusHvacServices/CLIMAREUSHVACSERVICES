# 🚀 Guía de Despliegue en Vercel + Neon

## Paso 1: Configurar Base de Datos Neon

### 1.1 Limpiar BD (si es necesario)
Si ya hay datos o errores en tu BD Neon:

1. Abre el panel de Neon → SQL Editor
2. Copia y ejecuta todo el contenido de `prisma/reset.sql`
   - Esto elimina todas las tablas y tipos ENUM
3. Confirma que ves el mensaje: "Reset completado"

### 1.2 Variables de Entorno en Neon
- Obtén tu **DATABASE_URL** del panel de Neon
- Nota: No necesitas DIRECT_URL en Vercel (solo en desarrollo local)

---

## Paso 2: Configurar Vercel

### 2.1 Variables de Entorno
En tu proyecto Vercel, ve a **Settings → Environment Variables** y añade:

```
DATABASE_URL=postgresql://[usuario]:[password]@[host]/[database]
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=genera-una-string-aleatoria-fuerte-aqui
AUTH_GOOGLE_ID=tu-google-client-id
AUTH_GOOGLE_SECRET=tu-google-client-secret
```

**Cómo generar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 2.2 Configurar Build Script
Ya está configurado en `package.json`:
- `postinstall`: Genera cliente Prisma
- `build`: `prisma generate && next build`

Vercel ejecutará automáticamente:
1. `npm install` (instala dependencias)
2. `npm run postinstall` (genera Prisma Client)
3. `npm run build` (compila Next.js)

---

## Paso 3: Primera Migraciones y Seed

### Opción A: Automática (RECOMENDADA)
El script postinstall ya genera Prisma, pero para el PRIMER deployment:

1. En tu máquina local, ejecuta:
```bash
npm run db:push
npm run db:seed
```

2. Haz push a GitHub
3. Vercel detectará cambios y hará deployment automático

### Opción B: Manual en Vercel
Si necesitas ejecutar comandos en Vercel después del deployment:

1. Ve a tu proyecto → Deployments
2. Click en el deployment → Logs
3. Conecta por SSH (si está habilitado)
4. O redeployea con rebuild

---

## Paso 4: Verificar Despliegue

Una vez que Vercel termine el build:

1. Abre tu app en: `https://tu-dominio.vercel.app`
2. Intenta login con credenciales de prueba:
   - Email: `admin@climareus.es`
   - Password: `Admin123!@`

### Si ves errores:

**Error: "Invalid module name in augmentation"**
- ✅ Esto ya está corregido en `src/auth/config.ts`

**Error de BD conectando**
- Verifica `DATABASE_URL` en Vercel env vars
- Asegúrate que Neon está accesible

**Error: "User" already exists**
- Limpia la BD ejecutando `prisma/reset.sql` en Neon
- Luego redeploy en Vercel

---

## Paso 5: Desarrollo Local

Para seguir desarrollando localmente:

```bash
# Crear .env.local con tu BD local
DATABASE_URL=postgresql://...

# Instalar dependencias
npm install

# Ejecutar migraciones locales
npm run db:push

# Seed datos de prueba
npm run db:seed

# Iniciar dev server
npm run dev
```

---

## Scripts Disponibles

```bash
npm run dev              # Desarrollar localmente
npm run build            # Compilar producción
npm start                # Iniciar servidor producción
npm run db:generate      # Generar Prisma Client
npm run db:push          # Aplicar cambios al schema
npm run db:migrate       # Crear nueva migración
npm run db:studio        # Abrir Prisma Studio
npm run db:seed          # Ejecutar seed script
npm run postinstall      # Generar Prisma Client (ejecutado automáticamente)
```

---

## Solución de Problemas

### Warnings de paquetes deprecated en Vercel
Estos son solo avisos, no afectan el build:
- `rimraf@3.0.2`, `glob@7.2.3`, `eslint@8.57.1`
- Son de dependencias transitorias, puedes ignorarlos

### Build warnings de Edge Runtime
- Si ves warnings sobre bcryptjs y Edge Runtime
- Asegúrate que `bcryptjs` se usa solo en servidor, no en middleware
- ✅ Ya está configurado correctamente

### BD vacía después del deployment
1. Limpia con `prisma/reset.sql`
2. Redeploy en Vercel
3. El seed se ejecutará automáticamente

---

## ¿Necesitas rollback?

Si algo falla y necesitas volver atrás:

1. En Vercel, ve a Deployments
2. Selecciona el deployment anterior
3. Click "Promote to Production"
4. En Neon, ejecuta `prisma/reset.sql` si es necesario

---

## Siguiente: Mantener la BD en Sync

Después de deployar, cuando hagas cambios al schema:

```bash
# Localmente
npm run db:migrate -- --name nombre_de_migracion

# Esto crea una migración en prisma/migrations/
# Commita los cambios a GitHub
# Vercel automáticamente aplicará las migraciones
```

---

**¿Problemas? Revisa:**
- Logs de Vercel build
- Neon SQL Editor para errores de BD
- Console de navegador (F12) para errores en cliente
