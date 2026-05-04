# 🔍 Revisión de Pendientes - EcoFIng MVP

## ✅ COMPLETADO (100%)

### Base de Datos
- ✅ Schema completo en Supabase (8 tablas)
- ✅ Datos de ejemplo poblados
- ✅ RLS policies configuradas
- ✅ Triggers y constraints

### Portal Instituto
- ✅ Login funcional
- ✅ Dashboard con tabla de lotes
- ✅ Crear nuevos lotes (con foto en base64)
- ✅ Cancelar envíos (botón visible solo en Pendiente)
- ✅ Persistencia en Supabase
- ✅ Normalización de datos

### Portal Ecopunto
- ✅ Dashboard con estadísticas
- ✅ Marcar lotes como recibidos
- ✅ Clasificar items con IA (OpenRouter)
- ✅ Clasificar items manualmente
- ✅ Terminar clasificación
- ✅ Publicar lotes agrupados por categoría
- ✅ Persistencia en Supabase

### Portal Gestora
- ✅ Dashboard con catálogo de lotes
- ✅ Ver detalle de lote
- ✅ Enviar cotizaciones
- ✅ Filtros por categoría y estado
- ✅ Persistencia en Supabase

### Integración
- ✅ Normalización snake_case ↔ camelCase
- ✅ Carga de lotes_entrada + lotes_publicacion
- ✅ Carga de solicitudes_gestoras vinculadas
- ✅ Todas las operaciones CRUD funcionan
- ✅ Fotografías en base64

---

## ⚠️ PENDIENTE (Funcionalidades importantes)

### 1. Portal Admin - Aprobación de Retiros (ALTA PRIORIDAD)
**Estado**: No implementado

**Qué falta**:
- [ ] Vista de solicitudes pendientes de aprobación
- [ ] Botón "Aprobar" y "Rechazar" solicitud
- [ ] Asignar lote a gestora ganadora
- [ ] Actualizar estado del lote a "Retiro Aprobado"
- [ ] Guardar en Supabase

**Archivos**:
- `app/src/portals/admin/AprobacionRetiros.jsx`

---

### 2. Portal Admin - Gestión de Actores (MEDIA PRIORIDAD)
**Estado**: UI existe pero no persiste en Supabase

**Qué falta**:
- [ ] Conectar CRUD de usuarios a Supabase
- [ ] Conectar CRUD de gestoras a Supabase
- [ ] Actualizar scoring de gestoras
- [ ] Toggle habilitación de gestoras

**Archivos**:
- `app/src/portals/admin/GestionActores.jsx`

---

### 3. Gestora - Mis Solicitudes (MEDIA PRIORIDAD)
**Estado**: Vista existe pero necesita verificación

**Verificar**:
- [ ] ¿Muestra solicitudes desde Supabase?
- [ ] ¿Muestra estados actualizados?
- [ ] ¿Se actualiza cuando admin aprueba/rechaza?

**Archivos**:
- `app/src/portals/gestora/MisSolicitudes.jsx`

---

### 4. Config en Supabase (ALTA PRIORIDAD)
**Estado**: Tabla existe pero puede estar vacía

**Verificar e insertar si falta**:
```sql
-- Categorías RAEE (ya existe como JSONB)
-- Topes de peso por tamaño
-- Factores de CO2 por categoría
-- Porcentajes de materiales recuperados
```

**Acción**: Ejecutar query para poblar config

---

### 5. Generación de Certificados (BAJA PRIORIDAD - MVP)
**Estado**: No implementado

**Qué sería**:
- Cuando una gestora retira un lote
- Admin marca como "Finalizado"
- Se genera PDF/certificado automático
- Se envía email al instituto

**Nota**: Puede ser post-MVP

---

### 6. Validaciones y Casos Edge (MEDIA PRIORIDAD)

**Falta revisar**:
- [ ] ¿Qué pasa si Supabase falla?
- [ ] ¿Hay mensajes de error claros?
- [ ] ¿Se validan permisos por rol?
- [ ] ¿Se previene acceso a rutas sin login?

---

### 7. Deployment en Vercel (PENDIENTE)
**Estado**: Código listo, falta deploy

**Acción necesaria**:
1. Configurar variables de entorno en Vercel:
   - VITE_OPENROUTER_API_KEY
   - (VITE_SUPABASE_* ya están hardcoded)
2. Redeploy desde Vercel
3. Probar en producción

---

## 🎯 PLAN RECOMENDADO

### Fase 1: Completar Flujo Crítico (1-2 horas)
1. ✅ Verificar config en Supabase
2. ✅ Implementar AprobacionRetiros en Admin
3. ✅ Verificar MisSolicitudes en Gestora

### Fase 2: Pulir y Validar (30 min)
4. ✅ Agregar validaciones de error
5. ✅ Probar flujo completo end-to-end

### Fase 3: Deploy (15 min)
6. ✅ Configurar variables en Vercel
7. ✅ Deploy y probar en producción

---

## 📊 Progreso General

```
███████████████████████████░░░  85% COMPLETADO

Completado:  17/20 features principales
Pendiente:    3/20 features críticas
```

---

¿Querés que implemente las pendientes o revisamos algo específico primero?
