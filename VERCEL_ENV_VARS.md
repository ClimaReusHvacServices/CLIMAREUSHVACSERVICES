# 🔐 VARIABLES DE ENTORNO - VERCEL

## ⚠️ IMPORTANTE
Copia EXACTAMENTE estas variables a **Vercel → Settings → Environment Variables**

Nunca cierres el navegador sin guardar - toma screenshot de cada variable.

---

## 1️⃣ DATABASE_URL (De Neon)

### Dónde obtenerlo:
1. Abre https://console.neon.tech
2. Selecciona tu proyecto "Clima Reus HVAC"
3. Ve a "Connection string"
4. Copia la URL que empieza con `postgresql://`

### Variable a pegar en Vercel:
```
Name: DATABASE_URL
Value: postgresql://[user]:[password]@[host]/[database]?sslmode=require
Environment: Production
```

**Ejemplo real:**
```
DATABASE_URL=postgresql://neondb_owner:4FgH9jKlM2pQ@ep-bitter-bird-12345.us-east-1.neon.tech/neondb?sslmode=require
```

---

## 2️⃣ NEXTAUTH_URL

### Variable a pegar en Vercel:
```
Name: NEXTAUTH_URL
Value: https://tu-dominio.vercel.app
Environment: Production
```

**Ejemplo real:**
```
NEXTAUTH_URL=https://clima-reus.vercel.app
```

⚠️ Reemplaza `clima-reus` con el nombre real de tu proyecto en Vercel.

---

## 3️⃣ NEXTAUTH_SECRET

### Generar valor seguro:
Ejecuta en tu terminal:
```bash
openssl rand -base64 32
```

O usa esto si no tienes openssl:
```
Un-string-aleatorio-muy-largo-con-mayus-minus-numeros-12345!@#$%^&*
```

### Variable a pegar en Vercel:
```
Name: NEXTAUTH_SECRET
Value: [resultado-de-openssl-rand-base64-32]
Environment: Production
```

**Ejemplo:**
```
NEXTAUTH_SECRET=7h3Bk9pL2qX4mW6jY8nF5rT1vS3uD0oE9=
```

---

## 4️⃣ AUTH_GOOGLE_ID (Opcional - si usas Google Login)

### Dónde obtenerlo:
1. Ve a https://console.cloud.google.com
2. Crea un proyecto OAuth 2.0
3. Copia el "Client ID"

### Variable a pegar en Vercel:
```
Name: AUTH_GOOGLE_ID
Value: [tu-google-client-id].apps.googleusercontent.com
Environment: Production
```

---

## 5️⃣ AUTH_GOOGLE_SECRET (Opcional - si usas Google Login)

### Dónde obtenerlo:
1. Mismo lugar que AUTH_GOOGLE_ID
2. Copia el "Client Secret"

### Variable a pegar en Vercel:
```
Name: AUTH_GOOGLE_SECRET
Value: [tu-google-client-secret]
Environment: Production
```

---

## ✅ CHECKLIST DE VARIABLES

Copia este checklist y marca cada una cuando la añadas:

```
☐ DATABASE_URL (de Neon)
☐ NEXTAUTH_URL (https://tu-dominio.vercel.app)
☐ NEXTAUTH_SECRET (resultado de openssl)
☐ AUTH_GOOGLE_ID (si usas Google - opcional)
☐ AUTH_GOOGLE_SECRET (si usas Google - opcional)
```

---

## 🚀 DESPUÉS DE AGREGAR LAS VARIABLES

1. Ve a **Deployments** en Vercel
2. Click en el deployment actual
3. Click en **Redeploy** o haz un nuevo **git push**
4. Espera a que termine el build
5. Abre tu app: https://tu-dominio.vercel.app

---

## ✅ PROBAR EL LOGIN

Una vez deployado, intenta login con:

```
Email:    admin@climareus.es
Password: Admin123!@
```

Si funciona ✅ → Todo está correcto.
Si falla ❌ → Revisa los logs en Vercel.

---

## 🆘 TROUBLESHOOTING

### Error: "Invalid DATABASE_URL"
- Verifica que la URL tenga `?sslmode=require` al final
- Verifica que el usuario/password sean correctos en Neon

### Error: "Cannot find NEXTAUTH_SECRET"
- Copia el valor exacto (sin comillas ni espacios)
- Usa `openssl rand -base64 32` para generar uno seguro

### Error: "Invalid module name in augmentation"
- ✅ Ya está corregido en el código
- Haz **git push** después de actualizar el seed.ts

---

## ⚠️ NUNCA compartir

- DATABASE_URL completa
- NEXTAUTH_SECRET
- AUTH_GOOGLE_SECRET

Si alguien accede a estas, pueden hackear tu app.
