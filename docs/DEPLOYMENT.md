# Guía de Deployment — EcoFIng en seminario.noah.uy

**Objetivo:** Configurar deployment automático desde GitHub al subdominio `seminario.noah.uy` usando Vercel.

**Resultado final:**
- ✅ Cada push a `main` → deploy automático en producción
- ✅ Cada PR → preview URL única para testing
- ✅ HTTPS automático (SSL gratis)
- ✅ CDN global (carga rápida desde cualquier parte del mundo)
- ✅ Accesible en: https://seminario.noah.uy

---

## Paso 1: Preparar el proyecto para producción

### 1.1. Configurar variables de entorno para producción

Creá el archivo `.env.production` en la carpeta `app/`:

```bash
# app/.env.production
VITE_OPENROUTER_API_KEY=TU_API_KEY_DE_OPENROUTER_AQUI
VITE_OPENROUTER_MODEL=anthropic/claude-3-haiku
```

### 1.2. Actualizar `.gitignore` para no subir secrets

Verificá que `.gitignore` incluya:

```gitignore
# Local env files
.env.local
.env.production.local

# Pero NO .env.production (lo necesitamos en Vercel)
```

### 1.3. Crear archivo de configuración de Vercel

Creá `vercel.json` en la **raíz del proyecto**:

```json
{
  "buildCommand": "cd app && npm install && npm run build",
  "outputDirectory": "app/dist",
  "framework": "vite",
  "installCommand": "cd app && npm install",
  "devCommand": "cd app && npm run dev",
  "env": {
    "VITE_OPENROUTER_API_KEY": "@vite_openrouter_api_key",
    "VITE_OPENROUTER_MODEL": "anthropic/claude-3-haiku"
  }
}
```

### 1.4. Verificar que el build funciona localmente

```bash
cd app
npm run build
```

Si no hay errores, estás listo para deployar.

---

## Paso 2: Configurar Vercel

### 2.1. Crear cuenta en Vercel

1. Ir a: https://vercel.com/signup
2. Seleccionar **"Continue with GitHub"**
3. Autorizar Vercel para acceder a tus repositorios

### 2.2. Importar el repositorio

1. En el dashboard de Vercel, click en **"Add New Project"**
2. Buscar y seleccionar: `Juanraibo/seminario-tecnologia-fing`
3. Click en **"Import"**

### 2.3. Configurar el proyecto

En la pantalla de configuración:

**Framework Preset:**
- Seleccionar: **Vite**

**Root Directory:**
- Dejar en blanco (la configuración está en `vercel.json`)

**Build and Output Settings:**
- Build Command: `cd app && npm install && npm run build`
- Output Directory: `app/dist`
- Install Command: `cd app && npm install`

**Environment Variables:**
1. Click en **"Add Environment Variable"**
2. Agregar:
   ```
   Key: VITE_OPENROUTER_API_KEY
   Value: TU_API_KEY_DE_OPENROUTER_AQUI
   ```
3. Agregar otra:
   ```
   Key: VITE_OPENROUTER_MODEL
   Value: anthropic/claude-3-haiku
   ```

### 2.4. Deploy inicial

1. Click en **"Deploy"**
2. Esperar 1-2 minutos mientras Vercel construye el proyecto
3. Una vez completado, verás: "Your project is ready!"
4. Click en **"Visit"** para ver tu sitio

Ahora tendrás una URL como: `https://seminario-tecnologia-fing.vercel.app`

---

## Paso 3: Configurar custom domain (seminario.noah.uy)

### 3.1. Agregar dominio en Vercel

1. En el dashboard del proyecto, ir a **Settings → Domains**
2. Click en **"Add Domain"**
3. Ingresar: `seminario.noah.uy`
4. Click en **"Add"**

Vercel te mostrará los registros DNS que necesitás configurar.

### 3.2. Configurar DNS en tu proveedor (donde tenés noah.uy)

Necesitás agregar un registro **CNAME** en la configuración DNS de `noah.uy`.

**Opción A: Si usás Cloudflare, AWS Route 53, o similar:**

1. Ir al panel de DNS de tu proveedor
2. Agregar un registro **CNAME**:
   ```
   Type: CNAME
   Name: seminario
   Value: cname.vercel-dns.com
   TTL: Auto (o 3600)
   ```
3. Guardar cambios

**Opción B: Si usás cPanel o panel de hosting:**

1. Ir a "Zone Editor" o "DNS Management"
2. Agregar registro CNAME:
   ```
   Host: seminario.noah.uy
   Points to: cname.vercel-dns.com
   ```
3. Guardar

### 3.3. Verificar propagación de DNS

1. Esperar 5-10 minutos (puede tomar hasta 48h en casos extremos)
2. Verificar con: https://dnschecker.org/#CNAME/seminario.noah.uy
3. Cuando aparezca `cname.vercel-dns.com` → DNS está propagado

### 3.4. Verificar SSL en Vercel

1. En Vercel → Settings → Domains
2. Verificar que aparezca: ✅ **Valid Configuration**
3. Vercel generará automáticamente el certificado SSL (1-2 minutos)
4. Cuando veas: 🔒 **SSL Certificate: Active** → ¡Listo!

---

## Paso 4: Configurar deployment automático

### 4.1. Verificar integración con GitHub

1. En Vercel → Settings → Git
2. Verificar que esté conectado a: `Juanraibo/seminario-tecnologia-fing`
3. Branch de producción: `main`

### 4.2. Configurar comportamiento de deploy

En **Settings → Git**:

**Production Branch:**
- `main` ✅

**Deploy Hooks:**
- Preview Deployments: **Enabled** ✅
  - Cada push a cualquier branch (excepto main) genera preview URL
  
**Automatic Deployments:**
- ✅ **Auto-deploy from `main`** (cada push → deploy en producción)
- ✅ **Auto-deploy from pull requests** (cada PR → preview URL)

---

## Paso 5: Testing del flujo completo

### 5.1. Test de deploy automático

1. Hacer un cambio pequeño en el código:
   ```bash
   # Ejemplo: cambiar título en LoginPage.jsx
   cd "c:\Users\Sr Pimienta\Seminario Fing"
   # (hacer cambio)
   git add .
   git commit -m "test: verificar deploy automático"
   git push origin main
   ```

2. Ir a Vercel dashboard
3. Ver el deploy en progreso (aparece en tiempo real)
4. Esperar ~1-2 minutos
5. Verificar cambio en: https://seminario.noah.uy

### 5.2. Test de preview deployment (opcional)

1. Crear una nueva branch:
   ```bash
   git checkout -b test/preview-deploy
   ```

2. Hacer un cambio
3. Push de la branch:
   ```bash
   git push origin test/preview-deploy
   ```

4. En Vercel verás un nuevo deploy con URL única:
   ```
   https://seminario-tecnologia-fing-git-test-preview-deploy-juanraibo.vercel.app
   ```

5. Podés compartir esta URL con el equipo para review antes de mergear

---

## Paso 6: Configurar notificaciones (opcional)

### 6.1. Notificaciones por email

1. En Vercel → Settings → Notifications
2. Habilitar:
   - ✅ Deployment Started
   - ✅ Deployment Succeeded
   - ✅ Deployment Failed

### 6.2. Integración con GitHub

Vercel comenta automáticamente en cada PR con el preview URL:

```markdown
✅ Deployment Preview Ready!

🔍 Inspect: https://vercel.com/...
🌐 Preview: https://seminario-...vercel.app
```

---

## Resumen de URLs

Una vez configurado, tendrás:

| Entorno | URL | Deploy trigger |
|---------|-----|----------------|
| **Producción** | https://seminario.noah.uy | Push a `main` |
| **Producción (Vercel)** | https://seminario-tecnologia-fing.vercel.app | Push a `main` |
| **Preview (branch)** | https://seminario-...-git-BRANCH.vercel.app | Push a cualquier branch |
| **Preview (PR)** | https://seminario-...-pr-NUMBER.vercel.app | Abrir/actualizar PR |

---

## Troubleshooting

### Error: "Build failed"

**Causa:** Error en `npm run build`

**Solución:**
1. Verificar localmente: `cd app && npm run build`
2. Ver logs en Vercel para identificar el error
3. Corregir y volver a pushear

### Error: "Domain not configured"

**Causa:** DNS no propagado o mal configurado

**Solución:**
1. Verificar CNAME en dnschecker.org
2. Verificar que apunte a `cname.vercel-dns.com`
3. Esperar 5-10 minutos más

### Error: "API key not working in production"

**Causa:** Variables de entorno no configuradas

**Solución:**
1. Ir a Vercel → Settings → Environment Variables
2. Verificar que `VITE_OPENROUTER_API_KEY` esté configurada
3. Redeploy: Settings → Deployments → ... → Redeploy

### Error: "404 al recargar página en rutas internas"

**Causa:** SPA routing no configurado

**Solución:**
Crear `app/public/_redirects` (o `vercel.json` ya lo maneja):
```
/*    /index.html   200
```

Si usás Vercel, esto ya está incluido en la configuración de Vite.

---

## Comandos útiles

```bash
# Ver build de producción localmente
cd app
npm run build
npm run preview  # Ver en http://localhost:4173

# Limpiar cache de build
rm -rf app/dist app/node_modules/.vite

# Ver logs de Vercel (instalar CLI)
npm i -g vercel
vercel logs seminario.noah.uy
```

---

## Mantenimiento

### Actualizar variables de entorno

1. Vercel → Settings → Environment Variables
2. Editar variable
3. Redeploy para que tome efecto

### Rollback a versión anterior

1. Vercel → Deployments
2. Encontrar deploy anterior exitoso
3. Click en "..." → **Promote to Production**

### Monitoreo de performance

Vercel provee analytics gratis:
- Vercel → Analytics
- Ver:
  - Page load time
  - Time to First Byte (TTFB)
  - First Contentful Paint (FCP)
  - Largest Contentful Paint (LCP)

---

## Próximos pasos

Una vez funcionando:

1. ✅ Configurar dominio custom
2. ✅ Deploy automático en cada push
3. ✅ Preview URLs para PRs
4. 🔄 Agregar tests automáticos antes de deploy (opcional)
5. 🔄 Configurar staging environment (opcional)
6. 🔄 Monitoreo de errores (Sentry, opcional)

---

## Recursos

- **Vercel Docs:** https://vercel.com/docs
- **Vite Deploy Guide:** https://vitejs.dev/guide/static-deploy.html
- **DNS Checker:** https://dnschecker.org
- **SSL Checker:** https://www.sslshopper.com/ssl-checker.html

---

**Documentado por:** Claude Sonnet 4.5  
**Fecha:** 27 de abril de 2026
