# Testing — Sesión 10: Bugfixes y Registro Público

**Fecha:** 28 de abril de 2026  
**Cambios:** Modo oscuro + QR navigation + Registro público de trazabilidad

---

## 🚀 Cómo Probar los Cambios

### Pre-requisito
```bash
cd app
npm run dev
# Abrir http://localhost:5173
```

---

## 1️⃣ Modo Oscuro Persistente

### ✅ Test 1: Toggle funciona correctamente
1. Abrir http://localhost:5173
2. Hacer login con cualquier usuario (ej: admin@fing.edu.uy / admin123)
3. En el header, click en el ícono de Sol/Luna
4. **Verificar:** Fondo cambia de oscuro a claro (o viceversa)
5. Click nuevamente
6. **Verificar:** Vuelve al modo original

**Resultado esperado:** El fondo debe cambiar visiblemente entre:
- **Modo oscuro:** Fondo negro/gris muy oscuro (`gray-950`)
- **Modo claro:** Fondo blanco/gris muy claro (`gray-50`)

---

### ✅ Test 2: Preferencia persiste al cambiar de ruta
1. Estando logueado, activar modo **claro** (si estaba en oscuro)
2. Navegar a otra vista del portal (ej: Dashboard → Nueva Solicitud)
3. **Verificar:** El modo claro se mantiene

**Resultado esperado:** La preferencia NO debe resetearse al cambiar de página

---

### ✅ Test 3: Preferencia persiste al recargar
1. Activar modo **claro**
2. Recargar la página (F5 o Ctrl+R)
3. **Verificar:** El modo claro se mantiene después de recargar

**Resultado esperado:** La preferencia está guardada en `localStorage`

---

### ✅ Test 4: Estado inicial por defecto
1. Abrir en modo **incógnito** (Ctrl+Shift+N)
2. Navegar a http://localhost:5173
3. **Verificar:** Debe arrancar en modo **oscuro** (default)

**Resultado esperado:** Sin preferencia guardada → modo oscuro

---

## 2️⃣ Navegación a Registro Público

### ✅ Test 5: Link en LoginPage
1. Abrir http://localhost:5173 (sin login)
2. En la página de login, buscar botón **"Ver Registro Público"**
3. Click en el botón
4. **Verificar:** Navega a `/trazabilidad` (sin parámetro `lote`)
5. **Verificar:** Muestra un listado con 3 lotes

**Resultado esperado:** 
- URL: `http://localhost:5173/trazabilidad`
- Título: "EcoFIng · Registro Público"
- Muestra 3 tarjetas de lotes

---

### ✅ Test 6: Link en Header (logueado)
1. Hacer login (cualquier usuario)
2. En el header, buscar link **"Trazabilidad"** (con ícono de globo)
3. Click en el link
4. **Verificar:** Navega a `/trazabilidad` (sin parámetro)
5. **Verificar:** Muestra el listado de lotes

**Resultado esperado:** Igual que Test 5

---

## 3️⃣ Registro Público: Listado de Lotes

### ✅ Test 7: Vista inicial
1. Acceder a http://localhost:5173/trazabilidad
2. **Verificar:**
   - Header: "EcoFIng · Registro Público"
   - Contador: "3 Lotes gestionados"
   - Barra de búsqueda
   - Botones de filtro: Todos | Finalizados | En proceso
   - Grid con 3 tarjetas de lotes

**Resultado esperado:**
```
┌─────────────────────────────────────────┐
│  🔄 EcoFIng · Registro Público      3   │
│     Trazabilidad de RAEE         Lotes  │
├─────────────────────────────────────────┤
│  🔍 Buscar...  [Todos][Finalizados][En proceso] │
├─────────────────────────────────────────┤
│  ┌─────┐  ┌─────┐  ┌─────┐            │
│  │ PUB │  │ PUB │  │ PUB │            │
│  │ 001 │  │ 002 │  │ 003 │            │
│  └─────┘  └─────┘  └─────┘            │
└─────────────────────────────────────────┘
```

---

### ✅ Test 8: Búsqueda por código
1. En la barra de búsqueda, escribir: `PUB-2026-001`
2. **Verificar:** Solo muestra la tarjeta del lote PUB-2026-001
3. Borrar búsqueda
4. **Verificar:** Vuelven a aparecer los 3 lotes

**Resultado esperado:** Búsqueda filtra en tiempo real

---

### ✅ Test 9: Búsqueda por categoría
1. En la barra de búsqueda, escribir: `Baterías`
2. **Verificar:** Solo muestra el lote PUB-2026-002 (Baterías y Acumuladores)
3. Escribir: `Audio`
4. **Verificar:** Solo muestra el lote PUB-2026-003 (Equipos de Audio y Video)

**Resultado esperado:** Búsqueda case-insensitive en código y categoría

---

### ✅ Test 10: Filtro "Finalizados"
1. Click en botón **"Finalizados"**
2. **Verificar:** Solo muestra 1 lote (PUB-2026-001)
3. **Verificar:** Badge de estado en verde: "Finalizado"

**Resultado esperado:** Solo lotes con estado `Finalizado`

---

### ✅ Test 11: Filtro "En proceso"
1. Click en botón **"En proceso"**
2. **Verificar:** Muestra 2 lotes (PUB-2026-002 y PUB-2026-003)
3. **Verificar:** Badges en azul/amarillo (no verdes)

**Resultado esperado:** Lotes que NO están finalizados

---

### ✅ Test 12: Información en tarjetas
Para cada tarjeta, verificar que muestre:
- ✅ Código del lote (font-mono verde)
- ✅ Categoría (ej: "Equipos de Informática...")
- ✅ Número de ítems (ej: "5 ítems")
- ✅ Peso total (ej: "9.6 kg")
- ✅ Barra de progreso visual (color según estado)
- ✅ Porcentaje de progreso (ej: "100%")
- ✅ Badge de estado con color
- ✅ Fecha de publicación (ej: "Publicado: 2026-02-14")

**Resultado esperado:** Toda la información visible y legible

---

### ✅ Test 13: Barra de progreso visual
Verificar los colores y porcentajes:
- **PUB-2026-001 (Finalizado):** Barra verde 100%
- **PUB-2026-002 (Retiro Aprobado):** Barra azul 75%
- **PUB-2026-003 (Disponible):** Barra azul 25%

**Resultado esperado:** Progreso visual coherente con estado

---

## 4️⃣ Navegación al Detalle de Lote

### ✅ Test 14: Click en tarjeta
1. En el registro, click en cualquier tarjeta (ej: PUB-2026-001)
2. **Verificar:** URL cambia a `/trazabilidad?lote=PUB-2026-001`
3. **Verificar:** Muestra vista de detalle del lote
4. **Verificar:** Aparece botón "← Volver al registro" arriba

**Resultado esperado:** Navegación fluida con parámetro URL

---

### ✅ Test 15: Vista de detalle completa
Verificar que muestre:
- ✅ Botón "Volver al registro" (arriba a la izquierda)
- ✅ Header con branding EcoFIng
- ✅ Código del lote (grande, font-mono verde)
- ✅ Badge de estado (color-coded)
- ✅ Timeline de trazabilidad con 4 pasos:
  - Instituto Origen (círculo verde)
  - Clasificación en Ecopunto (círculo azul)
  - Gestora de Retiro (círculo morado) - si aplica
  - Certificado de Disposición (círculo verde) - si aplica
- ✅ Ítems individuales del lote (máximo 8 + contador)
- ✅ Footer con cálculo de CO₂ específico
- ✅ Footer con info del sistema

**Resultado esperado:** Timeline visual completo

---

### ✅ Test 16: Botón "Volver al registro"
1. Estando en detalle de un lote, click en **"← Volver al registro"**
2. **Verificar:** Vuelve a `/trazabilidad` (sin parámetro)
3. **Verificar:** Muestra el listado de lotes

**Resultado esperado:** Navegación bidireccional funcional

---

### ✅ Test 17: Lote no encontrado
1. Acceder manualmente a: http://localhost:5173/trazabilidad?lote=INEXISTENTE
2. **Verificar:** Muestra mensaje "Lote no encontrado"
3. **Verificar:** Aparece botón "Ver registro completo"
4. Click en el botón
5. **Verificar:** Vuelve al listado

**Resultado esperado:** Manejo de errores elegante

---

## 5️⃣ QR Codes (sin cambios, pero validar)

### ✅ Test 18: Generación de QR en Instituto
1. Login como instituto (inco@fing.edu.uy / inco123)
2. Click en cualquier lote → ver detalle
3. **Verificar:** Aparece QR code
4. Inspeccionar la URL del QR (debajo del código):
   - Debe ser: `https://seminario.noah.uy/trazabilidad?lote={ID}`

**Resultado esperado:** QR apunta al dominio de producción + lote específico

---

### ✅ Test 19: Escanear QR (simulado)
1. Copiar URL del QR: `https://seminario.noah.uy/trazabilidad?lote=LOT-2026-001`
2. Cambiar a localhost: `http://localhost:5173/trazabilidad?lote=LOT-2026-001`
3. Acceder a esa URL
4. **Verificar:** Muestra detalle del lote LOT-2026-001

**Resultado esperado:** QR funciona correctamente (en producción será con el dominio real)

---

## 6️⃣ Responsive Design

### ✅ Test 20: Vista móvil
1. Abrir DevTools (F12)
2. Click en ícono de móvil (Ctrl+Shift+M)
3. Seleccionar "iPhone 12 Pro" o similar
4. Navegar al registro público
5. **Verificar:**
   - Tarjetas se muestran en 1 columna
   - Búsqueda y filtros se apilan verticalmente
   - Todo es legible y clickeable

**Resultado esperado:** Diseño responsive funcional

---

## 7️⃣ Performance y UX

### ✅ Test 21: Búsqueda en tiempo real
1. Escribir lentamente en la barra de búsqueda
2. **Verificar:** Filtrado es instantáneo (sin delay)

**Resultado esperado:** No hay lag en búsqueda

---

### ✅ Test 22: Transiciones visuales
1. Hover sobre tarjetas de lotes
2. **Verificar:** Sombra aumenta (hover effect)
3. **Verificar:** Chevron cambia de gris a verde

**Resultado esperado:** Feedback visual al hover

---

## ✅ Checklist Completo

Marcar cada test al completarlo:

**Modo Oscuro:**
- [ ] Test 1: Toggle funciona
- [ ] Test 2: Persiste al cambiar ruta
- [ ] Test 3: Persiste al recargar
- [ ] Test 4: Default es oscuro

**Navegación:**
- [ ] Test 5: Link en LoginPage
- [ ] Test 6: Link en Header

**Registro Público:**
- [ ] Test 7: Vista inicial
- [ ] Test 8: Búsqueda por código
- [ ] Test 9: Búsqueda por categoría
- [ ] Test 10: Filtro "Finalizados"
- [ ] Test 11: Filtro "En proceso"
- [ ] Test 12: Información en tarjetas
- [ ] Test 13: Barra de progreso

**Detalle de Lote:**
- [ ] Test 14: Click en tarjeta
- [ ] Test 15: Vista de detalle completa
- [ ] Test 16: Botón volver
- [ ] Test 17: Lote no encontrado

**QR Codes:**
- [ ] Test 18: Generación en Instituto
- [ ] Test 19: Escanear QR (simulado)

**Responsive:**
- [ ] Test 20: Vista móvil

**UX:**
- [ ] Test 21: Búsqueda en tiempo real
- [ ] Test 22: Transiciones visuales

---

## 🐛 Bugs Encontrados (si los hay)

Documentar aquí cualquier problema encontrado durante el testing:

**Bug #1:** 
- Descripción:
- Pasos para reproducir:
- Resultado esperado:
- Resultado actual:

**Bug #2:**
- ...

---

## 📸 Capturas Sugeridas (para documentación)

1. Registro público con 3 lotes
2. Búsqueda filtrando a 1 lote
3. Detalle de lote finalizado (timeline completo)
4. Vista móvil responsive
5. Modo claro vs modo oscuro (comparación)

---

**Creado por:** Claude Sonnet 4.5  
**Fecha:** 28 de abril de 2026  
**Próxima validación:** Antes del 5 de mayo (según roadmap)
