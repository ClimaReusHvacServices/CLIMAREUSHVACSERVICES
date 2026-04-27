# ARQUITECTURA Y DECISIONES TÉCNICAS

## 1. ¿Por qué NextAuth.js en lugar de otras soluciones?

**Elegido: NextAuth.js v5**

### Razones:
- Integración nativa con Next.js (no necesita servidor separado)
- Soporte para múltiples proveedores (Credentials, Google, GitHub, etc.)
- Manejo seguro de sesiones y JWT
- Compatible con Prisma adapter para almacenar sesiones en BD
- No requiere Firebase, Supabase u otros servicios externos
- Documentación excelente

### Alternativas consideradas:
- Firebase Auth: Requiere servicios externos, menos control
- Supabase Auth: Aunque buena, Firebase sería redundante con Neon
- Passport.js: Más complejo, diseñado para Express
- NextAuth.js: Es el estándar de Next.js

---

## 2. ¿Por qué Prisma como ORM?

**Elegido: Prisma**

### Razones:
- Type-safe queries (TypeScript)
- Migraciones automáticas
- Adapter integrado para NextAuth.js
- Studio visual para visualizar BD
- Excelente para PostgreSQL
- Documentación detallada

### Estructura del schema.prisma:
- Tablas separadas por dominio (User, Cliente, Trabajador)
- Enums para estados (OrderStatus, UserRole, TaskStatus, etc.)
- Relaciones bien definidas
- Índices en campos de búsqueda frecuente
- Timestamps automáticos (createdAt, updatedAt)

---

## 3. Validación de Formularios con Zod

**Elegido: Zod**

### Razones:
- Validación en cliente Y servidor
- Type inference automático (TypeScript)
- Mensajes de error personalizables
- Ligero y sin dependencias

### Estrategia de validación:
```
Cliente (InputField) → Zod Schema → Validación con mensajes → 
Enviar a API → API valida de nuevo → Respuesta con errores
```

---

## 4. Internacionalización con next-intl

**Elegido: next-intl**

### Razones:
- Específicamente diseñado para Next.js
- Soporte para ruteo por locale ([locale])
- Traducciones en JSON (fácil de mantener)
- No requiere librerías externas
- Rápido y eficiente

### Estructura:
- `src/i18n/messages/{es,en,ca}.json` - Traducciones
- `src/i18n/routing.ts` - Rutas traducidas
- `src/i18n/request.ts` - Configuración del servidor

---

## 5. Estilos con Tailwind CSS v4

**Elegido: Tailwind CSS v4**

### Razones:
- Utility-first: desarrollo rápido
- Diseño consistente
- Soporte para dark mode (futuro)
- Pequeño bundle final
- Integración perfecta con Next.js

### Colores personalizados:
```tailwind
primary: sky-500 (#0ea5e9)
secondary: slate-500 (#64748b)
```

---

## 6. Estructura de Carpetas: (auth) y (dashboard)

**Elegido: Route Groups**

### Por qué:
```
(auth) → Rutas públicas (login, register)
  - Mismo layout para ambas
  - Sin sidebar/navigation protegida
  
(dashboard) → Rutas protegidas (admin, cliente, trabajador)
  - Sidebar diferente según rol
  - Middleware protege acceso
```

### Ventaja:
- Las carpetas entre paréntesis NO afectan a la URL
- `/[locale]/login` (no es `/[locale]/(auth)/login`)
- Lógica de layout clara y mantenible

---

## 7. Seguridad de Contraseñas: "Recuérdame"

**Implementado de forma segura**

### NO hacemos:
- Guardar contraseña en cookie
- Guardar contraseña en localStorage
- Guardar contraseña en sesión

### SÍ hacemos:
- Usar JWT de NextAuth con maxAge extendido (30 días)
- Token hasheado si se implementa "Recuérdame" manual
- Regenerar session en cada acceso
- Revocación automática si es necesario

### Cómo funciona:
```
1. Usuario marca "Recuérdame"
2. NextAuth crea JWT con maxAge: 30 días
3. Cookie segura (httpOnly, secure en HTTPS)
4. NextAuth maneja renovación automática
5. Usuario no necesita iniciar sesión cada vez
```

---

## 8. Base de Datos: PostgreSQL con Neon

**Elegido: Neon**

### Por qué no SQLite:
- SQLite para desarrollo local, Neon para producción = diferencias
- SQLite no soporta usuario/rol management bien
- SQLite limitado para escala

### Neon es mejor porque:
- PostgreSQL en la nube (compatible local con pgAdmin)
- Mismo motor en desarrollo y producción
- Escalable desde inicio
- Backups automáticos
- Serverless

### Configuración dual:
```env
# Local development (PostgreSQL local o Neon)
DATABASE_URL="postgresql://user:pass@localhost:5432/clima_reus_hvac"

# O Neon (mismo comando funciona en ambos)
DATABASE_URL="postgresql://neon_user:pass@ep-xxx.neon.tech/clima_reus_hvac?sslmode=require"
```

---

## 9. Roles y Acceso Basado en Roles (RBAC)

**Implementado con Middleware**

### Flujo:
```
Request → Middleware → Verificar sesión → Verificar rol → 
Permitir/Redirigir
```

### Roles:
- **admin**: Todo el sistema
- **cliente**: Solo su dashboard y órdenes
- **trabajador**: Solo sus tareas

### Protección en middleware.ts:
```typescript
// Rutas admin requieren role === 'admin'
// El middleware redirige si no tiene permisos
```

---

## 10. API RESTful vs GraphQL

**Elegido: API RESTful**

### Razones:
- Más simple para empezar
- Estándar HTTP bien conocido
- Fácil de testear con curl/Postman
- Menos overhead

### Rutas API creadas:
```
POST /api/auth/register     → Registrar usuario
POST /api/auth/[...nextauth] → NextAuth handler
```

### Rutas planeadas:
```
GET  /api/orders              → Listar órdenes (admin/cliente)
POST /api/orders              → Crear orden
PUT  /api/orders/:id          → Actualizar orden
POST /api/workers/:id/tasks   → Asignar tarea
```

---

## 11. Testing (Futuro)

Planeado:
- Jest para unit tests
- Playwright para E2E tests
- API testing con Postman

---

## 12. Monitoreo y Logs

Planeado:
- Sentry para error tracking
- LogRocket para user sessions
- Vercel Analytics para rendimiento

---

## DECISIÓN: Sin Firebase, Sin Supabase

**Arquitectura limpia con solo:**
1. Next.js (Backend + Frontend)
2. NextAuth.js (Autenticación)
3. Prisma (ORM)
4. Neon (Base de datos)
5. Tailwind CSS (Estilos)

**Evitamos:**
- Firebase (overkill, vendor lock-in)
- Supabase (redundante con Neon)
- Terceros innecesarios

**Resultado**: Máximo control, mínimas dependencias, arquitectura escalable.

---

## PASOS PARA PRODUCTIVO

1. Base de datos creada (este proyecto)
2. Autenticación configurada
3. Admin dashboard listo
4. Login/registro de cliente
5. Dashboard de cliente
6. Dashboard de trabajador
7. Tienda de productos
8. Sistema de pagos
9. Notificaciones
10. API completa
11. 📝 Testing
12. 📝 Deployment a Hostinger

---

**Creado**: Abril 2026  
**Proyecto**: Clima Reus HVAC  
**Versión**: 1.0.0-base
