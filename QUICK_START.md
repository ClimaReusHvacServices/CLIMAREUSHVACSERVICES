# 🚀 GUÍA DE INICIO RÁPIDO

## ⏱️ 5 Minutos para empezar

### 1️⃣ Prerequisitos

```bash
# Verificar Node.js está instalado
node --version  # Debe ser v18+
npm --version
```

### 2️⃣ Instalación de dependencias

```bash
npm install
```

### 3️⃣ Configurar Base de Datos

#### Opción A: PostgreSQL Local (Recomendado para desarrollo)

```bash
# 1. Descargar PostgreSQL desde https://www.postgresql.org/download/
# 2. Instalar y crear base de datos:

createdb clima_reus_hvac

# 3. Actualizar .env.local con la conexión
DATABASE_URL="postgresql://postgres:password@localhost:5432/clima_reus_hvac"
```

#### Opción B: Neon (PostgreSQL en la nube)

```bash
# 1. Ir a https://neon.tech y crear cuenta
# 2. Crear proyecto y copiar CONNECTION STRING
# 3. Actualizar .env.local
DATABASE_URL="postgresql://...@ep-xxx.neon.tech/clima_reus_hvac?sslmode=require"
```

### 4️⃣ Generar esquema de BD

```bash
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Crear tablas en BD
```

### 5️⃣ Crear datos de ejemplo (opcional)

```bash
npm run db:seed
```

### 6️⃣ Iniciar servidor

```bash
npm run dev
```

### 7️⃣ Abrir en navegador

```
http://localhost:3000
```

---

## 📝 Cuentas de ejemplo (después de seed)

```
Admin:
  Email: admin@climareus.es
  Password: Admin123!@

Cliente:
  Email: cliente@ejemplo.es
  Password: Cliente123!@

Trabajador:
  Email: trabajador@climareus.es
  Password: Trabajador123!@
```

---

## 🔄 Workflows comunes

### Cambiar idioma

Hay un botón 🌐 en la esquina superior derecha de cualquier página.

### Ver base de datos visualmente

```bash
npm run db:studio
```
Se abre Prisma Studio en `http://localhost:5555`

### Crear una nueva migración

```bash
npm run db:migrate
# Preguntará nombre de la migración
```

### Limpiar base de datos (⚠️ Pierde datos)

```bash
npm run db:push -- --force-reset
```

---

## 🐛 Problemas Comunes

### "DATABASE_URL is not set"

```
❌ Solución:
1. Verificar que .env.local existe
2. Tiene DATABASE_URL configurado
3. Usar `npm run db:push` no `npm run db:migrate`
```

### "Port 3000 already in use"

```bash
❌ Hay algo usando el puerto 3000
✅ Matarlo:
  # En Windows:
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # En Mac/Linux:
  lsof -ti:3000 | xargs kill -9
  
✅ O usar otro puerto:
npm run dev -- -p 3001
```

### "No se puede conectar a PostgreSQL"

```
❌ Posibles causas:
1. PostgreSQL no está corriendo
   → En Windows: Services > PostgreSQL > Start
   → En Mac: brew services start postgresql
   → En Linux: sudo systemctl start postgresql

2. Credenciales incorrectas en .env.local

3. Base de datos no existe
   → createdb clima_reus_hvac
```

### "Error: Could not find Auth handler"

```
❌ Causado por:
- NextAuth secret no configurado

✅ Solución:
NEXTAUTH_SECRET=your-secret-key-here-min-32-chars

# Generar secret seguro:
openssl rand -hex 32
```

---

## 📂 Estructura de carpetas importantes

```
src/
├── app/[locale]/
│   ├── (auth)/login          ← Página de login
│   ├── (auth)/register       ← Página de registro
│   └── (dashboard)/admin     ← Dashboard de admin
├── components/
│   ├── auth/LoginForm.tsx    ← Componente login
│   ├── common/Button.tsx     ← Botones reutilizables
│   └── common/InputField.tsx ← Inputs reutilizables
├── auth/config.ts            ← Configuración NextAuth
└── db/index.ts               ← Cliente Prisma

prisma/
├── schema.prisma             ← Definición de tablas
└── seed.ts                   ← Datos de ejemplo
```

---

## 🎯 Próximos pasos después del setup

1. ✅ Base creada
2. → Crear dashboard de cliente
3. → Implementar tienda de productos
4. → Sistema de pagos
5. → Dashboard de trabajador
6. → Notificaciones
7. → Deployment

---

## 🆘 Soporte

- Revisar logs en terminal
- Ver `README.md` para documentación completa
- Ver `ARCHITECTURE.md` para decisiones técnicas
- Revisar archivo `.env.local` está configurado

---

**¡Listo! Ya tienes todo funcionando localmente. Empezar a desarrollar! 🎉**
