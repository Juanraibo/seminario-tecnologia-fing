# Bugfixes — Sesión 9 (27 abril 2026)

**Reportados por:** Usuario en testing manual  
**Resueltos por:** Claude Code

---

## 🐛 Bug #1: Lotes creados en Instituto no aparecen en Ecopunto

### Síntoma
Al crear un nuevo lote desde el Portal Instituto, el lote NO aparecía en el Dashboard de Ecopunto para ser procesado.

### Causa raíz
Al crear el lote en `NuevaSolicitud.jsx`, faltaba el campo `tipo: 'entrada'` en el objeto del lote.

El Dashboard de Ecopunto filtra lotes con:
```javascript
const lotesEntrada = state.lotes.filter(l => l.tipo === 'entrada')
```

Al no tener el campo `tipo`, el filtro excluía los lotes nuevos.

### Solución
Agregar `tipo: 'entrada'` al objeto `nuevoLote` en [NuevaSolicitud.jsx:95](../app/src/portals/instituto/NuevaSolicitud.jsx#L95)

```javascript
const nuevoLote = {
  id: nuevoId,
  tipo: 'entrada', // ✅ Agregado
  institutoId: usuario.institutoId,
  // ... resto de campos
}
```

### Archivo modificado
- `app/src/portals/instituto/NuevaSolicitud.jsx`

### Testing
1. Login: `inco@fing.edu.uy` / `inco123`
2. Crear nueva solicitud con cualquier tamaño + foto
3. Logout y login en Ecopunto: `ecopunto@fing.edu.uy` / `eco123`
4. **Validar:** El nuevo lote aparece en tabla de "Pendientes de recepción"

---

## 🐛 Bug #2: QR codes apuntan a localhost

### Síntoma
Los QR codes generados en el detalle de lote del Instituto apuntaban a `http://localhost:5173/trazabilidad?lote=XXX` en vez de la URL de producción.

### Causa raíz
En `DetalleLote.jsx` del Instituto, la URL del QR se generaba con:
```javascript
const qrUrl = `${window.location.origin}/trazabilidad?lote=${lote.id}`
```

`window.location.origin` devuelve el origen actual (localhost en desarrollo, producción en deploy), pero los QR físicos deben apuntar SIEMPRE al dominio de producción para ser escaneables.

### Solución
Hardcodear el dominio de producción en [DetalleLote.jsx:38](../app/src/portals/instituto/DetalleLote.jsx#L38):

```javascript
// ❌ Antes
const qrUrl = `${window.location.origin}/trazabilidad?lote=${lote.id}`

// ✅ Ahora
const qrUrl = `https://seminario.noah.uy/trazabilidad?lote=${lote.id}`
```

### Archivo modificado
- `app/src/portals/instituto/DetalleLote.jsx`

### Testing
1. Login: `inco@fing.edu.uy` / `inco123`
2. Click en cualquier lote para ver detalle
3. **Validar:** QR code visible en la columna derecha
4. Click derecho en QR → "Copiar enlace de imagen" → pegar en navegador
5. **Validar:** URL es `https://seminario.noah.uy/trazabilidad?lote=XXX`
6. Escanear QR con celular
7. **Validar:** Abre la página pública de trazabilidad correctamente

---

## 🐛 Bug #3: Imágenes de stock en vez de las subidas

### Síntoma
En el detalle de lote del Portal Gestora, las imágenes de los ítems mostraban placeholders de Picsum (imágenes de stock) en vez de las fotos reales subidas durante la clasificación.

### Causa raíz
En `DetalleLote.jsx` de Gestora, la condición para mostrar imágenes era:

```javascript
src={item.foto_url?.startsWith('data:')
  ? item.foto_url
  : `https://picsum.photos/seed/${item.id}/200/200`
}
```

Esta lógica verificaba si `foto_url` empezaba con `'data:'` (formato base64), pero:
1. El operador `?.` podía retornar `undefined` si foto_url no existía
2. La verificación `.startsWith('data:')` era redundante si foto_url ya contenía la imagen

### Solución
Simplificar la lógica en [DetalleLote.jsx:196](../app/src/portals/gestora/DetalleLote.jsx#L196):

```javascript
// ❌ Antes
src={item.foto_url?.startsWith('data:')
  ? item.foto_url
  : `https://picsum.photos/seed/${item.id}/200/200`
}

// ✅ Ahora
src={item.foto_url || `https://picsum.photos/seed/${item.id}/200/200`}
```

**Lógica:** Si `foto_url` existe (truthy), úsala; si no, fallback a Picsum.

### Archivo modificado
- `app/src/portals/gestora/DetalleLote.jsx`

### Testing
1. Login: `ecopunto@fing.edu.uy` / `eco123`
2. Seleccionar un lote pendiente y clasificar
3. Subir imagen real de un monitor/teclado
4. Clasificar con IA (opcional) y agregar ítem
5. Publicar el lote
6. Logout y login en Gestora: `gestora1@reciclauY.com` / `gest123`
7. Click en el lote publicado
8. **Validar:** Imagen del ítem es la foto REAL subida, no placeholder

### Nota técnica
Las imágenes se guardan en base64 en el estado (`imagenPreview` en ClasificarLote):
```javascript
foto_url: imagenPreview // base64 string desde FileReader
```

Esto funciona en MVP porque:
- No hay backend → imágenes en memoria
- Al refrescar página se pierden (datos mock se recargan)
- En producción se debería subir a storage (S3, Cloudinary, etc.)

---

## 📊 Resumen de cambios

| Bug | Archivo | Línea | Cambio |
|-----|---------|-------|--------|
| #1 Lotes no aparecen | `instituto/NuevaSolicitud.jsx` | 95 | `+tipo: 'entrada'` |
| #2 QR localhost | `instituto/DetalleLote.jsx` | 38 | `window.location.origin` → `https://seminario.noah.uy` |
| #3 Imágenes stock | `gestora/DetalleLote.jsx` | 196 | Simplificar condición de fallback |

---

## ✅ Checklist de validación

Antes de cerrar esta sesión:

- [x] Bug #1: Crear lote en Instituto → aparece en Ecopunto
- [x] Bug #2: QR apunta a producción
- [x] Bug #3: Imágenes reales se muestran correctamente
- [ ] Testing E2E completo (flujo Instituto → Ecopunto → Gestora → Admin)
- [ ] Validar en deployment de Vercel

---

## 🚀 Deploy

Estos cambios deben desplegarse en Vercel:

```bash
# Commit
git add app/src/portals/instituto/NuevaSolicitud.jsx
git add app/src/portals/instituto/DetalleLote.jsx
git add app/src/portals/gestora/DetalleLote.jsx

git commit -m "fix: 3 bugs críticos - lotes en ecopunto, QR dominio, imágenes"

# Push (Vercel auto-deploys)
git push origin main
```

---

## 🔍 Lecciones aprendidas

### Bug #1: Validar filtros
- Los filtros en dashboards deben validarse con datos reales
- Si un filtro usa un campo, ese campo DEBE existir en TODOS los registros
- Agregar validación en Context reducer para campos obligatorios

### Bug #2: URLs absolutas en QR
- QR codes físicos deben apuntar SIEMPRE a producción
- No usar `window.location` para generar URLs externas
- Considerar variable de entorno `VITE_PUBLIC_URL` para flexibilidad

### Bug #3: Fallbacks de imagen
- Simplificar lógica de fallback (truthy vs verificaciones complejas)
- Documentar que imágenes en base64 no persisten al refrescar
- En producción: upload a storage y guardar solo URL

---

**Creado:** 27 de abril de 2026  
**Para:** Documentación de bugfixes sesión 9  
**Estado:** ✅ Resuelto — Listo para deploy
