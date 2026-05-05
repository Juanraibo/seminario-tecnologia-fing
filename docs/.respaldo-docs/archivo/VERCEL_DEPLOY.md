# Instrucciones de Deploy en Vercel

## 1. Configuración de Variables de Entorno

Ir a: **Project Settings → Environment Variables**

Agregar las siguientes variables:

| Variable | Valor | Scope |
|----------|-------|-------|
| `VITE_CLIMATIQ_API_KEY` | `2H056BE9NN58Z01YC1VAKXZVCG` | Production, Preview, Development |

**IMPORTANTE:** 
- Esta API key es temporal para testing
- Para producción, registrarse en https://www.climatiq.io y obtener una key propia
- Límites del plan gratuito: 100 requests/mes

## 2. Configuración del Proyecto

### Build Settings

```
Framework Preset: Vite
Build Command: cd app && npm run build
Output Directory: app/dist
Install Command: cd app && npm install
```

### Root Directory
```
Root Directory: .
```

## 3. Deploy

1. **Conectar repositorio:**
   - Importar desde GitHub: `Juanraibo/seminario-tecnologia-fing`
   - Branch principal: `main`
   - Branch de desarrollo: `feature/mejora-ui-ux`

2. **Primera vez:**
   - Hacer merge de `feature/mejora-ui-ux` → `main` en GitHub
   - Vercel detectará el push y desplegará automáticamente

3. **Verificar deploy:**
   - Ir a la URL asignada por Vercel
   - Probar login con perfiles de prueba:
     - admin@fing.edu.uy / admin123
     - inco@fing.edu.uy / inco123
     - ecopunto@fing.edu.uy / eco123
     - gestora1@reciclauY.com / gest123

## 4. Rutas públicas (sin autenticación)

- `/` → Redirige a `/login`
- `/login` → Página de inicio de sesión
- `/trazabilidad` → Registro público de lotes
- `/calculadora` → Calculadora de impacto ambiental

## 5. Troubleshooting

### Error: API key no configurada
**Solución:** Verificar que `VITE_CLIMATIQ_API_KEY` esté en Environment Variables

### Error: Build falla
**Solución:** 
- Verificar que Build Command incluya `cd app &&`
- Verificar que Output Directory sea `app/dist`

### Error: Página en blanco
**Solución:**
- Verificar en DevTools Console si hay errores de imports
- Revisar que todas las rutas públicas en vercel.json (si existe) apunten a `/index.html`

## 6. Configuración recomendada vercel.json

Crear en la raíz del proyecto:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

Esto asegura que React Router funcione correctamente con rutas client-side.

## 7. Post-Deploy

1. **Probar todas las funcionalidades:**
   - Login con cada rol
   - Navegación entre páginas
   - Dark mode toggle
   - Calculadora de impacto (verificar que llame a Climatiq API)
   - Trazabilidad pública

2. **Monitorear API usage:**
   - Dashboard de Climatiq: https://app.climatiq.io
   - Verificar requests/month
   - Considerar upgrade si se supera el límite gratuito

3. **Analytics (opcional):**
   - Activar Vercel Analytics en Project Settings
   - Monitorear Core Web Vitals y errores
