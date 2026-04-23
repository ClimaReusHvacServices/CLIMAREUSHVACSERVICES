# VERCEL - COPIA Y PEGA LAS VARIABLES

## ⚠️ INSTRUCCIONES

1. Abre: https://vercel.com
2. Proyecto: CLIMAREUSHVACSERVICES
3. Settings → Environment Variables
4. Agrega cada variable exactamente como aparece aquí
5. Environment: Production (para todas)

---

## 3 VARIABLES A AGREGAR

### Variable 1 de 3

**Name:** `DATABASE_URL`

**Value:** Copia de Neon → Connection string (SQL tab)

Debe verse así:
```
postgresql://neondb_owner:XXXXXXXXXXX@ep-xxx.neon.tech/neondb?sslmode=require
```

**Environment:** Production

---

### Variable 2 de 3

**Name:** `NEXTAUTH_URL`

**Value:**
```
https://climareushvacservices.vercel.app
```

(Si tu dominio es diferente, reemplaza `climareushvacservices`)

**Environment:** Production

---

### Variable 3 de 3

**Name:** `NEXTAUTH_SECRET`

**Value:**
```
kL9mP2wX5bH8jQ1vT4nY7rS6fG3uD0oE9
```

O si quieres generarlo:
En terminal PowerShell:
```powershell
openssl rand -base64 32
```

Luego copia el resultado.

**Environment:** Production

---

## ✅ DESPUÉS DE AGREGAR

Verifica que veas esto en la lista:
- ✓ DATABASE_URL = postgresql://...
- ✓ NEXTAUTH_URL = https://...
- ✓ NEXTAUTH_SECRET = kL9mP2wX...

Entonces:
1. Ve a Deployments
2. Haz click en el deployment actual
3. Click "Redeploy"
4. Espera a que termine

---

## 🧪 PROBAR

1. Abre: https://climareushvacservices.vercel.app
2. Login: admin@climareus.es / Admin123!@
3. ✅ Funciona → TODO BIEN
4. ❌ Error → Revisa PASOS_FINALES.md

---

## 📝 NOTAS

- No dejes espacios en blanco en valores
- La DATABASE_URL debe terminar con `?sslmode=require`
- No compartas estas variables con nadie
- Si alguien las obtiene, cambia las contraseñas
