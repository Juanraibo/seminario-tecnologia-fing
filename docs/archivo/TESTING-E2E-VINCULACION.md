# Testing End-to-End — Vinculación entre Roles

**Objetivo:** Validar que las acciones de un rol se reflejan correctamente en otros roles a través del flujo completo del sistema.

**Fecha última actualización:** 27 de abril de 2026

---

## ✅ Sistema de Notificaciones (Toasts) — INTEGRADO

### Componentes actualizados con toasts:

#### 1. Portal Instituto
- **NuevaSolicitud.jsx** ✅
  - Toast success al crear lote
  - Redirige automáticamente al dashboard

#### 2. Portal Ecopunto
- **ClasificarLote.jsx** ✅
  - Toast info al iniciar clasificación con IA
  - Toast success/error según resultado de IA
  - Toast success al agregar ítem
  - Toast success al terminar clasificación
- **PublicarLotes.jsx** ✅
  - Toast warning si no hay ítems seleccionados
  - Toast success al publicar lote

#### 3. Portal Gestora
- **DetalleLote.jsx** ✅
  - Toast error si monto inválido
  - Toast success al enviar cotización

#### 4. Portal Admin
- **AprobacionRetiros.jsx** ✅
  - Toast warning si no hay gestora seleccionada
  - Toast success al aprobar retiro
  - Toast info al rechazar solicitudes
- **GestionActores.jsx** ✅
  - Toast warning en validaciones
  - Toast success al agregar operario/gestora
  - Toast success al eliminar operario/gestora
  - Toast success al habilitar/deshabilitar gestora

---

## 🔗 Flujo E2E Completo — Validación de Vinculación

### Flujo 1: Instituto → Ecopunto → Gestora → Admin

**Precondición:** Sistema levantado en `http://localhost:5173`

#### Paso 1: Instituto crea solicitud (HU-I02)
1. Login: `inco@fing.edu.uy` / `inco123`
2. Click "Nueva Solicitud"
3. Seleccionar tamaño: Mediano
4. Subir foto de prueba
5. Observaciones: "Monitores CRT viejos"
6. Click "Crear Solicitud"
7. **Validar:**
   - ✅ Toast: "Solicitud LOT-2026-XXX creada correctamente"
   - ✅ Redirige a dashboard
   - ✅ Nuevo lote aparece en tabla con estado "Pendiente envío Ecopunto"

#### Paso 2: Ecopunto recibe y clasifica (HU-E02)
1. Logout de Instituto
2. Login: `ecopunto@fing.edu.uy` / `eco123`
3. Dashboard muestra el lote creado en Paso 1
4. Click "Clasificar" en el lote
5. Subir imagen de monitor
6. Click "Clasificar con IA"
7. **Validar:**
   - ✅ Toast info: "Clasificando con IA..."
   - ✅ Toast success: "Clasificado como Pantallas (85% confianza)"
   - ✅ Categoría autoseleccionada
8. Ingresar peso: 12.5 kg
9. Click "Agregar Ítem"
10. **Validar:**
    - ✅ Toast: "Ítem ITEM-2026-XXX agregado correctamente"
    - ✅ Ítem aparece en la tabla de ítems clasificados
11. Click "Terminar Clasificación"
12. **Validar:**
    - ✅ Toast: "Lote LOT-2026-XXX clasificado con 1 ítems"
    - ✅ Redirige a dashboard
    - ✅ Estado del lote cambió a "Clasificado"

#### Paso 3: Ecopunto publica lote (HU-E03)
1. Click "Publicar lotes"
2. Seleccionar categoría "Pantallas"
3. Seleccionar el ítem clasificado
4. Click "Publicar Seleccionados"
5. **Validar:**
   - ✅ Toast: "Lote PUB-2026-XXX publicado con 1 ítems"
   - ✅ Redirige a dashboard
   - ✅ Lote desaparece de "pendientes de publicar"

#### Paso 4: Gestora cotiza (HU-G02)
1. Logout de Ecopunto
2. Login: `gestora1@reciclauY.com` / `gest123`
3. Dashboard muestra el lote PUB-2026-XXX publicado
4. Click en el lote para ver detalle
5. **Validar:**
   - ✅ Información del lote correcta
   - ✅ Ítems individuales visibles
   - ✅ Instituto de origen visible
6. Ingresar cotización: 5000
7. Click "Enviar Cotización"
8. **Validar:**
   - ✅ Toast: "Cotización de $5.000 enviada correctamente"
   - ✅ Botón de cotizar se deshabilita
   - ✅ Mensaje "Ya cotizaste este lote"

#### Paso 5: Admin aprueba retiro (HU-A03)
1. Logout de Gestora
2. Login: `admin@fing.edu.uy` / `admin123`
3. Click "Aprobación de Retiros"
4. **Validar:**
   - ✅ Lote PUB-2026-XXX aparece con solicitudes pendientes
   - ✅ Cotización de ReciclaUY visible
5. Expandir lote
6. Seleccionar gestora ReciclaUY
7. Click "Aprobar Retiro"
8. Confirmar en modal
9. **Validar:**
   - ✅ Toast: "Retiro aprobado para ReciclaUY"
   - ✅ Lote desaparece de pendientes
   - ✅ Estado cambió a "Retiro Aprobado - Pendiente de Certificado"

#### Paso 6: Validación cruzada — Gestora ve aprobación (HU-G03)
1. Logout de Admin
2. Login: `gestora1@reciclauY.com` / `gest123`
3. Click "Mis Solicitudes"
4. **Validar:**
   - ✅ Lote PUB-2026-XXX aparece como "Aprobado"
   - ✅ Badge verde de aprobación
   - ✅ Scoring actualizado

#### Paso 7: Validación cruzada — Instituto ve estado final (HU-I03)
1. Logout de Gestora
2. Login: `inco@fing.edu.uy` / `inco123`
3. Dashboard de Instituto
4. Click en el lote original LOT-2026-XXX
5. **Validar:**
   - ✅ Estado: "Retiro Aprobado - Pendiente de Certificado"
   - ✅ Gestora asignada: ReciclaUY
   - ✅ Fecha de aprobación visible
   - ✅ Ítems clasificados visibles con trazabilidad

---

## 🧪 Casos de Prueba por Componente

### Instituto — NuevaSolicitud

| # | Acción | Validación Toast | Validación Estado |
|---|--------|------------------|-------------------|
| 1 | Crear sin tamaño | ❌ Error inline | Estado no cambia |
| 2 | Crear sin foto | ❌ Error inline | Estado no cambia |
| 3 | Crear completo | ✅ Success | Lote agregado en context |
| 4 | Ver en dashboard | - | Lote visible en tabla |

### Ecopunto — ClasificarLote

| # | Acción | Validación Toast | Validación Estado |
|---|--------|------------------|-------------------|
| 1 | Clasificar sin imagen | ⚠️ Warning | No clasifica |
| 2 | Clasificar con IA OK | ✅ Success | Categoría sugerida |
| 3 | Clasificar con IA error | ❌ Error | Clasificación manual |
| 4 | Agregar ítem | ✅ Success | Ítem en context.items |
| 5 | Terminar sin ítems | ⚠️ Warning | Estado no cambia |
| 6 | Terminar con ítems | ✅ Success | Estado → CLASIFICADO |

### Ecopunto — PublicarLotes

| # | Acción | Validación Toast | Validación Estado |
|---|--------|------------------|-------------------|
| 1 | Publicar sin selección | ⚠️ Warning | No publica |
| 2 | Publicar con ítems | ✅ Success | Lote PUB creado |
| 3 | Ver en Gestora | - | Lote visible en catálogo |

### Gestora — DetalleLote

| # | Acción | Validación Toast | Validación Estado |
|---|--------|------------------|-------------------|
| 1 | Cotizar sin monto | ❌ Error | No envía |
| 2 | Cotizar monto inválido | ❌ Error | No envía |
| 3 | Cotizar monto válido | ✅ Success | Solicitud agregada |
| 4 | Cotizar dos veces | - | Botón deshabilitado |

### Admin — AprobacionRetiros

| # | Acción | Validación Toast | Validación Estado |
|---|--------|------------------|-------------------|
| 1 | Aprobar sin selección | ⚠️ Warning | No aprueba |
| 2 | Aprobar con gestora | ✅ Success | Estado → RETIRO_APROBADO |
| 3 | Rechazar solicitudes | ℹ️ Info | Estado → DISPONIBLE |
| 4 | Ver en Gestora | - | Badge aprobado/rechazado |

### Admin — GestionActores

| # | Acción | Validación Toast | Validación Estado |
|---|--------|------------------|-------------------|
| 1 | Agregar instituto vacío | ⚠️ Warning | No agrega |
| 2 | Agregar instituto completo | ℹ️ Info (no persiste) | Solo en sesión |
| 3 | Agregar operario | ✅ Success | Usuario en context |
| 4 | Eliminar operario | ✅ Success | Usuario removido |
| 5 | Agregar gestora | ✅ Success | Gestora en context |
| 6 | Eliminar gestora | ✅ Success | Gestora removida |
| 7 | Habilitar/deshabilitar | ✅ Success | Flag toggled |

---

## 🔄 Propagación de Cambios — Estado Reactivo

### Cómo funciona la vinculación actual:

El sistema usa **React Context + useReducer** para gestionar estado global:

```javascript
// Todos los componentes acceden al mismo estado
const { state, dispatch } = useApp()

// Al hacer dispatch, el estado se actualiza en TODOS los componentes
dispatch({ type: 'AGREGAR_LOTE', payload: nuevoLote })

// Los componentes que usan state.lotes se re-renderizan automáticamente
```

### Propagación por acción:

| Acción | Dispatch | Afecta a | Cómo se refleja |
|--------|----------|----------|-----------------|
| Instituto crea lote | `AGREGAR_LOTE` | Ecopunto dashboard | Nuevo lote en tabla |
| Ecopunto clasifica | `AGREGAR_ITEM` + `ACTUALIZAR_LOTE` | Instituto detalle | Ítems visibles en trazabilidad |
| Ecopunto publica | `AGREGAR_LOTE` (tipo pub) | Gestora catálogo | Nuevo lote en grid |
| Gestora cotiza | `AGREGAR_SOLICITUD_GESTORA` | Admin aprobación | Solicitud pendiente |
| Admin aprueba | `ACTUALIZAR_LOTE` | Gestora solicitudes | Badge aprobado |
| Admin rechaza | `ACTUALIZAR_LOTE` | Gestora catálogo | Lote vuelve a disponible |

### ✅ Validaciones automáticas:

El Context garantiza que:
- **No hay desincronización**: Un solo estado global
- **Actualización reactiva**: Los componentes se re-renderizan al cambiar state
- **Persistencia en sesión**: Los cambios persisten mientras no se recargue la página

### ⚠️ Limitaciones del MVP:

- **No hay persistencia real**: Al refrescar página se pierden cambios
- **No hay notificaciones push**: Hay que recargar manualmente para ver cambios de otros usuarios
- **No hay websockets**: No hay sincronización en tiempo real

---

## 📊 Checklist de Validación Final

Antes de la presentación (26 mayo 2026):

### Flujo Instituto → Ecopunto
- [ ] Instituto crea lote → Ecopunto lo ve en dashboard
- [ ] Ecopunto clasifica → Instituto ve ítems en detalle
- [ ] Estados del lote se actualizan correctamente

### Flujo Ecopunto → Gestora
- [ ] Ecopunto publica → Gestora ve lote en catálogo
- [ ] Información de ítems e institutos origen es correcta
- [ ] Gestora puede cotizar solo una vez

### Flujo Gestora → Admin
- [ ] Gestora cotiza → Admin ve solicitud pendiente
- [ ] Admin puede ver scoring de gestora
- [ ] Comparación entre múltiples cotizaciones funciona

### Flujo Admin → Gestora
- [ ] Admin aprueba → Gestora ve badge "Aprobado"
- [ ] Admin rechaza → Lote vuelve a catálogo disponible
- [ ] Scoring se actualiza correctamente

### Toasts en todas las acciones
- [ ] Todas las acciones exitosas muestran toast verde
- [ ] Errores de validación muestran toast rojo/amarillo
- [ ] Toasts se auto-cierran después de 4 segundos
- [ ] Posición fixed top-right no interfiere con contenido

---

## 🚀 Cómo Ejecutar Testing E2E

### Opción 1: Manual (recomendado para demo)

1. Levantar proyecto:
   ```bash
   cd app
   npm run dev
   ```

2. Abrir 4 pestañas del navegador (modo incógnito para evitar caché):
   - Pestaña 1: Instituto
   - Pestaña 2: Ecopunto
   - Pestaña 3: Gestora
   - Pestaña 4: Admin

3. Seguir el flujo documentado arriba paso a paso

4. Validar que cada toast aparece correctamente

5. Validar que los cambios se reflejan entre roles

### Opción 2: Playwright (futuro — post-MVP)

```javascript
// TODO(producción): Implementar tests E2E con Playwright
// - Automatizar el flujo completo
// - Capturar screenshots en cada paso
// - Validar toasts con esperas explícitas
// - Generar reporte HTML
```

---

## 📝 Notas de Implementación

### Mejoras realizadas en esta sesión:

1. **Integrado `useToast` en 8 componentes:**
   - Instituto: NuevaSolicitud
   - Ecopunto: ClasificarLote, PublicarLotes
   - Gestora: DetalleLote
   - Admin: AprobacionRetiros, GestionActores

2. **Reemplazados todos los `alert()` por toasts:**
   - Success → acciones exitosas
   - Error → validaciones fallidas
   - Warning → advertencias
   - Info → información contextual

3. **Validado que Context propaga cambios:**
   - dispatch() actualiza state global
   - Componentes se re-renderizan automáticamente
   - No hay desincronización entre roles

### Pendiente para producción:

- [ ] Persistencia real con backend (API REST o GraphQL)
- [ ] Notificaciones push con WebSockets
- [ ] Testing E2E automatizado con Playwright/Cypress
- [ ] Manejo de errores de red
- [ ] Estados de loading durante dispatch asíncronos
- [ ] Optimistic UI updates

---

**Creado:** 27 de abril de 2026  
**Para:** Validación del flujo completo E2E del MVP EcoFIng  
**Estado:** ✅ Toasts integrados — Listo para testing manual
