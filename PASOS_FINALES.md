# 🚀 PASOS FINALES - SOLUCIONAR TODO PARA VERCEL + NEON

Sigue estos pasos EN ORDEN. Tarda ~15 minutos.

---

## PASO 1️⃣: LIMPIAR BASE DE DATOS EN NEON (5 min)

### 1.1 Abre Neon
- Ve a https://console.neon.tech
- Entra con tu cuenta
- Selecciona proyecto "Clima Reus HVAC"

### 1.2 Ejecuta el SQL
- Ve a **SQL Editor**
- **Busca el archivo que te enviamos con el SQL completo para Neon**
- Copia TODO el contenido SQL
- Pégalo en Neon SQL Editor
- Click en **RUN**
- Espera a que termine (debe decir ✅ "Base de datos creada correctamente")

**Si ves error "relation already exists":**
- Ejecuta primero esto:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```
- Luego pega el SQL completo

### 1.3 Obtén la DATABASE_URL
- En Neon, ve a tu base de datos
- Click en **Connection string**
- Copia la URL que empieza con `postgresql://`
- Guárdala en un documento

---

## PASO 2️⃣: ACTUALIZAR CÓDIGO LOCAL (3 min)

### 2.1 El código ya está actualizado
Verificamos que tengas:
- ✅ `src/auth/config.ts` - módulo NextAuth corregido
- ✅ `prisma/seed.ts` - tipos Decimal correctos
- ✅ `package.json` - postinstall agregado
- ✅ `vercel.json` - configuración Vercel

Si lo descargaste todo, ya está hecho.

### 2.2 En terminal local:
```bash
cd "c:\Users\TRANSDIGITALCOOP\Desktop\Clima Reus HVAC Services"

# Verifica que todo esté bien
npm install
npm run db:generate
```

---

## PASO 3️⃣: CONFIGURAR VERCEL (5 min)

### 3.1 Abre Vercel
- Ve a https://vercel.com
- Selecciona tu proyecto "CLIMAREUSHVACSERVICES"
- Ve a **Settings**

### 3.2 Agrega Environment Variables
Ve a **Settings → Environment Variables** y añade EXACTAMENTE estas 3 variables:

#### Variable 1: DATABASE_URL
```
Name:  DATABASE_URL
Value: [COPIA LA URL DE NEON QUE OBTUVISTE EN PASO 1.3]
Environment: Production
```

#### Variable 2: NEXTAUTH_URL
```
Name:  NEXTAUTH_URL
Value: https://climareushvacservices.vercel.app
Environment: Production
```

⚠️ Si tu dominio es diferente, reemplaza `climareushvacservices`.

#### Variable 3: NEXTAUTH_SECRET
Genera esto en tu terminal:
```bash
openssl rand -base64 32
```

Luego:
```
Name:  NEXTAUTH_SECRET
Value: [RESULTADO DE ARRIBA]
Environment: Production
```

Si no puedes ejecutar `openssl`, usa esto:
```
NEXTAUTH_SECRET=kL9mP2wX5bH8jQ1vT4nY7rS6fG3uD0oE9
```

### 3.3 Guarda variables
- Click **Save** después de cada variable
- Verifica que las 3 aparezcan en la lista

---

## PASO 4️⃣: HACER PUSH A GITHUB (2 min)

### 4.1 En terminal:
```bash
git add .
git commit -m "fix: Complete Vercel & Neon setup - all errors resolved"
git push origin main
```

### 4.2 Espera a que Vercel detecte cambios
- Abre https://vercel.com/TUUSUARIO/CLIMAREUSHVACSERVICES
- Ve a **Deployments**
- Verás un nuevo deployment que dice "Building..."
- Espera a que termine (verde = éxito, rojo = error)

---

## PASO 5️⃣: PROBAR LOGIN (1 min)

### 5.1 Abre tu app
- Ve a https://climareushvacservices.vercel.app
- (o tu dominio real si es diferente)

### 5.2 Intenta login
```
Email:    admin@climareus.es
Password: Admin123!@
```

### 5.3 Resultado esperado
✅ **ÉXITO:** Entras al dashboard
❌ **ERROR:** Revisa los logs de Vercel (abajo en este documento)

---

## ✅ SI TODO FUNCIONA

Felicidades 🎉

Tu app está en producción:
- ✅ BD Neon configurada
- ✅ NextAuth funcionando
- ✅ Vercel desplegando automáticamente
- ✅ i18n listo (ES/EN/CA)
- ✅ Login con 3 cuentas de prueba

**Cuentas disponibles:**
```
Admin:      admin@climareus.es / Admin123!@
Cliente:    cliente@ejemplo.es / Cliente123!@
Trabajador: trabajador@climareus.es / Trabajador123!@
```

---

## ❌ SI HAY ERRORES

### Error en Vercel Build

1. **Abre los logs:**
   - Vercel → Deployments → Click en el deployment
   - Scroll hasta el final para ver errores

2. **Errores comunes:**

**Error: "Invalid DATABASE_URL"**
```
Solución: 
- Verifica en Neon que copiaste bien la URL
- Debe terminar con: ?sslmode=require
```

**Error: "NEXTAUTH_SECRET is missing"**
```
Solución:
- Verifica que la variable esté agregada en Vercel Settings
- Copia exactamente el valor (sin comillas)
```

**Error: "Cannot connect to database"**
```
Solución:
- Ejecuta el SQL en Neon SQL Editor
- Verifica que las tablas se crearon (ve a Tables en Neon)
- Redeploy en Vercel después
```

**Error: "Type error: Invalid module name"**
```
Solución:
- Ya está corregido en el código
- Haz git push nuevamente
```

### Revisar Logs Detallados

En terminal:
```bash
# Ver logs de Vercel
vercel logs https://climareushvacservices.vercel.app

# O abre en navegador:
# https://vercel.com/TUUSUARIO/CLIMAREUSHVACSERVICES/deployments
```

---

## 📞 CHECKLIST FINAL

Antes de considerar que está "listo":

```
☐ SQL ejecutado en Neon ✅
☐ 3 variables agregadas en Vercel ✅
☐ git push completado ✅
☐ Vercel build = SUCCESS ✅
☐ Login funciona ✅
☐ Dashboard se ve correctamente ✅
☐ i18n funciona (prueba cambiar idioma) ✅
```

---

## 🎯 PRÓXIMOS PASOS

Una vez que todo está funcionando:

1. **Desarrollo local:**
   ```bash
   npm run dev
   # Abre http://localhost:3000
   ```

2. **Hacer cambios:**
   ```bash
   git add .
   git commit -m "feature: descripción del cambio"
   git push
   # Vercel automáticamente redeploy
   ```

3. **Agregar nuevas páginas:**
   - Crea archivos en `src/app/[locale]/`
   - Usa el sistema de i18n ya configurado
   - Commit y push

---

## 💡 TIPS

- Los logs en tiempo real: `vercel logs --follow`
- Ver variables en local: `cat .env.local`
- Reiniciar dev server: Ctrl+C, luego `npm run dev`
- Limpiar cache de Vercel: Dashboard → Settings → Rebuild

---

**¡Listo! Sigue estos 5 pasos y estará todo funcionando. 🚀**
