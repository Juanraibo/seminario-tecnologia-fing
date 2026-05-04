# ✅ Plan de Pruebas Completas - EcoFIng MVP

## 🎯 Objetivo
Verificar que todos los flujos funcionen correctamente con Supabase integrado.

---

## 🔐 Usuarios de Prueba

```
ADMIN:
- Email: admin@fing.edu.uy
- Password: admin123

ECOPUNTO:
- Email: ecopunto@fing.edu.uy  
- Password: eco123

INSTITUTO (InCo):
- Email: inco@fing.edu.uy
- Password: inco123

GESTORA 1:
- Email: gestora1@reciclauy.com
- Password: gest123
```

---

## 🧪 FLUJO 1: Instituto - Crear Nuevo Lote

### Pasos:
1. Login con usuario InCo (inco@fing.edu.uy / inco123)
2. Click en "Nueva Solicitud"
3. Seleccionar tamaño: **Mediano**
4. Subir una foto cualquiera
5. Observaciones: "Monitor LCD y teclado mecánico"
6. Click en "Crear Solicitud"

### ✅ Verificaciones:
- [ ] Toast de éxito aparece
- [ ] Redirige al dashboard del instituto
- [ ] El nuevo lote aparece en la tabla con estado "Pendiente envío Ecopunto"
- [ ] El lote tiene botón "Cancelar" visible

---

## 🧪 FLUJO 2: Instituto - Cancelar Lote

### Pasos:
1. En dashboard de Instituto, buscar un lote con estado "Pendiente envío Ecopunto"
2. Click en botón "Cancelar"
3. Confirmar la cancelación

### ✅ Verificaciones:
- [ ] Toast de éxito
- [ ] El lote cambia de estado a "Cancelado"
- [ ] El botón "Cancelar" desaparece (solo visible en Pendiente)

---

## 🧪 FLUJO 3: Ecopunto - Ver Lotes Pendientes

### Pasos:
1. **Cerrar sesión** (importante para probar el refresh de datos)
2. Login con Ecopunto (ecopunto@fing.edu.uy / eco123)
3. Ir al Dashboard

### ✅ Verificaciones:
- [ ] Ver "Bandeja de Entrada" con lotes pendientes
- [ ] Ver el lote LOT-2026-006 (mediano) creado anteriormente
- [ ] Ver estadísticas: "Por recibir", "Para clasificar", etc.

---

## 🧪 FLUJO 4: Ecopunto - Marcar Lote como Recibido

### Pasos:
1. En Dashboard de Ecopunto, en sección "Bandeja de Entrada"
2. Click en "Marcar Recibido" para el lote LOT-2026-006

### ✅ Verificaciones:
- [ ] Toast de éxito
- [ ] El lote desaparece de "Bandeja de Entrada"
- [ ] El lote aparece en "Lotes para Clasificar"
- [ ] Estado cambió a "En Ecopunto"

---

## 🧪 FLUJO 5: Ecopunto - Clasificar Items

### Pasos:
1. Click en el lote recién marcado como recibido
2. Subir foto de un producto (ej: monitor)
3. **SIN IA**: Seleccionar categoría "Pantallas y Monitores"
4. Peso: 4.5
5. Descripción: "Monitor LCD Samsung 22 pulgadas"
6. Click "Agregar Producto al Lote"

### ✅ Verificaciones:
- [ ] Toast de éxito
- [ ] El item aparece en la lista de "Productos Clasificados" a la derecha
- [ ] Se muestra peso total y CO₂ evitado
- [ ] El formulario se resetea para agregar otro item

### Agregar segundo item:
7. Subir otra foto
8. Categoría: "Equipos de Informática"
9. Peso: 2.8
10. Descripción: "Teclado mecánico Logitech"
11. Click "Agregar Producto"

### ✅ Verificaciones:
- [ ] Ahora hay 2 productos clasificados
- [ ] Peso total = 7.3 kg
- [ ] CO₂ evitado total actualizado

---

## 🧪 FLUJO 6: Ecopunto - Terminar Clasificación

### Pasos:
1. Click en "Terminar Clasificación"

### ✅ Verificaciones:
- [ ] Toast de éxito
- [ ] Redirige al dashboard
- [ ] El lote ya no aparece en "Lotes para Clasificar"
- [ ] Contador de "Clasificados" aumentó
- [ ] Contador de "Sin publicar" aumentó en 2 items

---

## 🧪 FLUJO 7: Ecopunto - Publicar Lotes

### Pasos:
1. Click en "Publicar Productos (X)" en el header
2. Seleccionar categoría "Pantallas y Monitores"
3. Marcar el item del monitor
4. Click "Crear Lote y Publicar"

### ✅ Verificaciones:
- [ ] Toast de éxito
- [ ] Redirige al dashboard
- [ ] Contador "Sin publicar" disminuyó en 1

### Publicar segundo lote:
5. Click nuevamente en "Publicar Productos"
6. Seleccionar categoría "Equipos de Informática"
7. Marcar el teclado
8. Click "Crear Lote y Publicar"

### ✅ Verificaciones:
- [ ] Ambos items ahora están publicados
- [ ] Contador "Sin publicar" = 0

---

## 🧪 FLUJO 8: Gestora - Ver Catálogo

### Pasos:
1. **Cerrar sesión**
2. Login con Gestora (gestora1@reciclauy.com / gest123)
3. Ver dashboard

### ✅ Verificaciones:
- [ ] Ver "Catálogo de Lotes"
- [ ] Ver lotes publicados recientemente
- [ ] Ver lote PUB-2026-001 (Equipos de Informática)
- [ ] Ver lote PUB-2026-002 (Baterías)
- [ ] Ver lote PUB-2026-003 (Pantallas y Monitores)
- [ ] Ver estadísticas: Disponibles, Mis solicitudes, etc.
- [ ] Ver Scoring actual de la gestora

---

## 🧪 FLUJO 9: Gestora - Enviar Cotización

### Pasos:
1. Click en un lote disponible (ej: el nuevo de Equipos de Informática)
2. Ver detalle del lote:
   - Categoría
   - Cantidad de items
   - Peso total
   - Institutos de origen
3. Scroll hasta "Enviar Cotización"
4. Ingresar monto: 3500
5. Click "Enviar Cotización"

### ✅ Verificaciones:
- [ ] Toast de éxito
- [ ] El formulario se limpia
- [ ] Aparece tarjeta "Tu cotización: $3,500 UYU"
- [ ] En dashboard, contador "Mis solicitudes" aumentó

---

## 🧪 FLUJO 10: Gestora - Ver Mis Solicitudes

### Pasos:
1. Click en "Mis Solicitudes"

### ✅ Verificaciones:
- [ ] Ver todas las solicitudes enviadas
- [ ] Ver montos cotizados
- [ ] Ver estados de las solicitudes

---

## 🧪 FLUJO 11: Admin - Ver Dashboard

### Pasos:
1. **Cerrar sesión**
2. Login con Admin (admin@fing.edu.uy / admin123)

### ✅ Verificaciones:
- [ ] Ver estadísticas generales del sistema
- [ ] Ver peso total recuperado
- [ ] Ver CO₂ evitado total
- [ ] Ver materiales recuperados (cobre, aluminio)
- [ ] Ver gráficos de impacto ambiental

---

## 🧪 FLUJO 12: Verificar Persistencia

### Pasos:
1. **Recargar la página** (F5)
2. Los datos deben permanecer

### ✅ Verificaciones:
- [ ] Los lotes creados siguen ahí
- [ ] Los items clasificados siguen ahí
- [ ] Las cotizaciones enviadas siguen ahí
- [ ] Las estadísticas son correctas

---

## 🔍 Verificación Final en Base de Datos

Ejecutar: `cd app && node test-db.js`

### ✅ Verificaciones:
- [ ] Nuevos lotes_entrada creados
- [ ] Nuevos items creados
- [ ] Nuevos lotes_publicacion creados
- [ ] Nuevas solicitudes_gestoras creadas
- [ ] Estados correctamente actualizados

---

## ❌ Problemas Conocidos a Verificar

1. **Normalización de fechas**: Verificar que `fechaSolicitud` y `fecha_solicitud` funcionan ambos
2. **Campos snake_case vs camelCase**: Todos los campos deben estar normalizados
3. **Campo 'tipo' en lotes**: Debe existir para diferenciar entrada vs publicación
4. **Solicitudes en lotes**: Deben estar vinculadas correctamente

---

## 📊 Resumen de Cambios Implementados

✅ Normalización de datos en todas las funciones helper
✅ Campo 'tipo' agregado a lotes (entrada/publicación)
✅ Carga de lotes_publicacion en estado inicial
✅ Carga de solicitudes_gestoras y vinculación con lotes
✅ Botón "Cancelar envío" en Instituto
✅ Corrección de obtención de items en DetalleLote
✅ Todas las operaciones persisten en Supabase PostgreSQL

---

## 🚀 Siguiente Paso

Si todas las pruebas pasan:
1. Push a producción (Vercel)
2. Verificar que funcione en producción
3. Documentar cualquier issue encontrado
