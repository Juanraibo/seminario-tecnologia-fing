# 🎨 Guía Completa para Rediseño en Google Stitch

**Proyecto:** EcoFIng — Sistema de Gestión de RAEE  
**Stack:** React 18 + Vite 5 + TailwindCSS 3  
**Objetivo:** Rediseño moderno manteniendo funcionalidad y tecnologías

---

## 📦 PARTE 1: Información del Proyecto

### Contexto
- **Qué es:** Sistema web de gestión de Residuos Electrónicos para Facultad de Ingeniería (UdelaR, Uruguay)
- **Usuarios:** 4 roles + 1 vista pública
  - Instituto (genera solicitudes de retiro)
  - Ecopunto (clasifica con IA, publica lotes)
  - Gestora (cotiza, retira)
  - Admin (aprueba, gestiona)
  - Público (consulta trazabilidad sin login)
- **Objetivo:** Trazabilidad completa desde generación hasta disposición final

### Stack Tecnológico (MANTENER)

```json
{
  "framework": "React 18.2.0",
  "bundler": "Vite 5.0.8",
  "estilos": "TailwindCSS 3.4.0",
  "routing": "React Router v6",
  "estado": "React Context + useReducer",
  "iconos": "Lucide React",
  "gráficos": "Recharts",
  "fuente": "Inter (Google Fonts)",
  "IA": "OpenRouter API (Claude 3.5 Haiku)",
  "deployment": "Vercel (seminario.noah.uy)"
}
```

### Estructura de Componentes Actual

```
src/
├── components/
│   ├── atoms/
│   │   ├── Icon.jsx          ← Exporta todos los iconos de Lucide
│   │   └── StatusBadge.jsx   ← Badges de estado (Pendiente, Clasificado, etc)
│   ├── molecules/
│   │   └── Toast.jsx         ← Notificaciones toast con 4 tipos
│   └── organisms/
│       └── ToastContainer.jsx ← Contenedor global de toasts
│
├── portals/
│   ├── auth/LoginPage.jsx
│   ├── instituto/
│   │   ├── Dashboard.jsx
│   │   ├── NuevaSolicitud.jsx
│   │   └── DetalleLote.jsx
│   ├── ecopunto/
│   │   ├── Dashboard.jsx
│   │   ├── ClasificarLote.jsx
│   │   └── PublicarLotes.jsx
│   ├── gestora/
│   │   ├── Dashboard.jsx
│   │   ├── DetalleLote.jsx
│   │   └── MisSolicitudes.jsx
│   ├── admin/
│   │   ├── Dashboard.jsx
│   │   ├── GestionActores.jsx
│   │   └── AprobacionRetiros.jsx
│   └── publico/
│       └── Trazabilidad.jsx
│
├── context/AppContext.jsx    ← Estado global (lotes, usuarios, gestoras, etc)
├── constants/estados.js      ← Constantes de estados del lote
└── App.jsx                   ← Layout con header, dark mode, routing
```

---

## 🎨 PARTE 2: Paleta y Sistema de Diseño

### Colores (usar variables CSS de Tailwind)

```css
/* PRIMARIOS - Sostenibilidad */
--green-50: #f0fdf4
--green-100: #dcfce7
--green-500: #10b981   /* Principal - acciones primarias */
--green-600: #059669   /* Hover states */
--green-900: #064e3b   /* Texto sobre fondos claros */

/* SECUNDARIOS - Tecnología */
--blue-400: #60a5fa
--blue-500: #3b82f6    /* Acciones secundarias */
--blue-600: #2563eb    /* Hover */

/* NEUTRALES - Fondos y textos */
/* Light mode */
--gray-50: #f9fafb     /* bg-base */
--gray-100: #f3f4f6
--gray-200: #e5e7eb    /* borders */
--gray-500: #6b7280    /* texto secundario */
--gray-900: #111827    /* texto principal */

/* Dark mode */
--gray-700: #374151
--gray-800: #1f2937    /* borders dark */
--gray-900: #111827    /* bg-elevated dark */
--gray-950: #030712    /* bg-base dark */

/* ESTADOS */
--amber-500: #f59e0b   /* Warning */
--red-500: #ef4444     /* Error/Danger */
--purple-500: #a855f7  /* Info especial */
```

### Espaciado (ya definido en Tailwind)

```css
/* Usar estas clases directamente */
p-2   → 0.5rem (8px)
p-3   → 0.75rem (12px)
p-4   → 1rem (16px)
p-6   → 1.5rem (24px)
p-8   → 2rem (32px)
p-12  → 3rem (48px)

/* Bordes */
rounded-lg   → 0.5rem (8px)
rounded-xl   → 0.75rem (12px)
rounded-2xl  → 1rem (16px)

/* Sombras */
shadow-sm  → Subtle (cards normales)
shadow-md  → Elevated (cards destacados)
shadow-lg  → Modals
shadow-xl  → Popovers/dropdowns
```

### Tipografía (Inter ya cargada)

```css
/* Jerarquía de texto */
text-xs   → 0.75rem (12px) - labels, metadata
text-sm   → 0.875rem (14px) - body secundario
text-base → 1rem (16px) - body principal
text-lg   → 1.125rem (18px) - subtítulos
text-xl   → 1.25rem (20px) - títulos de sección
text-2xl  → 1.5rem (24px) - títulos principales
text-3xl  → 1.875rem (30px) - headers de página

/* Pesos */
font-light   → 300
font-normal  → 400
font-medium  → 500
font-semibold → 600
font-bold    → 700
```

---

## 🖼️ PARTE 3: Referencias de Diseño

### Inspiración Visual

**Referencia 1: Linear App**
- Cards con bordes sutiles (`border border-gray-200 dark:border-gray-800`)
- Sombras suaves (`shadow-sm`)
- Espaciado generoso (padding `p-6`)
- Hover states con background change (`hover:bg-gray-50 dark:hover:bg-gray-800`)

**Referencia 2: Vercel Dashboard**
- Glassmorphism en modals (`bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl`)
- Gradientes sutiles en fondos (`bg-gradient-to-br from-gray-50 to-gray-100`)
- Iconos grandes en cards de estadísticas (size={32})
- Tipografía clara con jerarquía fuerte

**Referencia 3: Stripe Dashboard**
- Tablas con hover row (`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`)
- Botones con estados claros (primary, secondary, ghost, danger)
- Status badges con colores distintivos
- Feedback visual inmediato (toasts, loading states)

### Ejemplos de Componentes Deseados

**Card Moderno:**
```jsx
<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
  {/* contenido */}
</div>
```

**Button Primary:**
```jsx
<button className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md">
  Acción Principal
</button>
```

**Button Secondary:**
```jsx
<button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium px-4 py-2 rounded-lg transition-colors">
  Acción Secundaria
</button>
```

**Input Moderno:**
```jsx
<div className="space-y-1">
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
    Campo
  </label>
  <input 
    type="text"
    className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
  />
</div>
```

**Table Row con Hover:**
```jsx
<tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{dato}</td>
</tr>
```

---

## 📋 PARTE 4: Lista de Páginas a Rediseñar

### 1. Login (HU-AUTH01)
**Archivo:** `app/src/portals/auth/LoginPage.jsx`  
**Estado actual:** Formulario centrado básico  
**Rediseño objetivo:**
- Layout centrado con ilustración o gradiente de fondo
- Card glassmorphism para el form
- Inputs con labels floating
- Botón destacado con hover effect
- Logo grande arriba

---

### 2. Instituto Dashboard (HU-I01)
**Archivo:** `app/src/portals/instituto/Dashboard.jsx`  
**Estado actual:** Tabla de lotes con filtros  
**Rediseño objetivo:**
- Cards de estadísticas arriba (Total lotes, Pendientes, Finalizados)
- Tabla moderna con row hover
- Filtros como pills
- Botón "Nueva Solicitud" destacado (verde)

---

### 3. Instituto Nueva Solicitud (HU-I02)
**Archivo:** `app/src/portals/instituto/NuevaSolicitud.jsx`  
**Estado actual:** Formulario con campos básicos  
**Rediseño objetivo:**
- Form con mejor spacing
- Labels claros encima de inputs
- Textarea para observaciones
- Botón "Crear Solicitud" verde destacado
- Feedback visual al enviar

---

### 4. Instituto Detalle Lote (HU-I03)
**Archivo:** `app/src/portals/instituto/DetalleLote.jsx`  
**Estado actual:** Info del lote + tabla de ítems  
**Rediseño objetivo:**
- Card principal con info del lote (badge de estado, fechas)
- Tabla de ítems con iconos por categoría
- Botón "Volver" secondary
- Timeline de estados al lado (opcional)

---

### 5. Ecopunto Dashboard (HU-E01)
**Archivo:** `app/src/portals/ecopunto/Dashboard.jsx`  
**Estado actual:** Tabla con filtros por estado  
**Rediseño objetivo:**
- Tabs para filtrar (Pendientes, Clasificados, Publicados)
- Cards de estadísticas
- Tabla con acciones claras (Clasificar, Publicar)
- Badges de estado coloridos

---

### 6. Ecopunto Clasificar (HU-E02)
**Archivo:** `app/src/portals/ecopunto/ClasificarLote.jsx`  
**Estado actual:** Upload de imagen + clasificación IA  
**Rediseño objetivo:**
- Upload area con drag & drop visual
- Preview de imagen grande
- Botón "Clasificar con IA" destacado
- Resultados con iconos grandes por categoría
- Loading state durante clasificación

---

### 7. Ecopunto Publicar (HU-E03)
**Archivo:** `app/src/portals/ecopunto/PublicarLotes.jsx`  
**Estado actual:** Lista de lotes clasificados para publicar  
**Rediseño objetivo:**
- Cards por lote (no tabla)
- Checkbox para seleccionar múltiples
- Botón "Publicar Seleccionados" verde
- Confirmación antes de publicar

---

### 8. Gestora Dashboard (HU-G01)
**Archivo:** `app/src/portals/gestora/Dashboard.jsx`  
**Estado actual:** Catálogo de lotes disponibles  
**Rediseño objetivo:**
- Grid de cards (no tabla)
- Cada card: imagen, categorías, ubicación
- Botón "Ver Detalle" por card
- Filtros como sidebar o top bar

---

### 9. Gestora Detalle Lote (HU-G02)
**Archivo:** `app/src/portals/gestora/DetalleLote.jsx`  
**Estado actual:** Info + formulario cotización  
**Rediseño objetivo:**
- Layout 2 columnas: Info lote | Form cotización
- Input de monto destacado
- Botón "Enviar Cotización" verde grande
- Preview de scoring al lado

---

### 10. Gestora Mis Solicitudes (HU-G03)
**Archivo:** `app/src/portals/gestora/MisSolicitudes.jsx`  
**Estado actual:** Tabla de solicitudes con scoring  
**Rediseño objetivo:**
- Cards por solicitud
- Scoring visual (estrellas o progress bar)
- Badges de estado (Pendiente, Aprobado, Rechazado)
- Filtros por estado

---

### 11. Admin Dashboard (HU-A01)
**Archivo:** `app/src/portals/admin/Dashboard.jsx`  
**Estado actual:** KPIs + gráficos  
**Rediseño objetivo:**
- Grid de cards de KPIs (iconos grandes)
- Gráficos Recharts integrados elegantemente
- Paleta de colores consistente en gráficos
- Navegación a secciones destacada

---

### 12. Admin Gestión Actores (HU-A02)
**Archivo:** `app/src/portals/admin/GestionActores.jsx`  
**Estado actual:** Tabs (Gestoras, Institutos, Operarios) + CRUDs  
**Rediseño objetivo:**
- Tabs modernos con active state claro
- Tablas con row hover
- Modals para crear/editar con glassmorphism
- Botones "Agregar" verdes destacados

---

### 13. Admin Aprobación Retiros (HU-A03)
**Archivo:** `app/src/portals/admin/AprobacionRetiros.jsx`  
**Estado actual:** Tabla de solicitudes pendientes  
**Rediseño objetivo:**
- Cards por solicitud (más espacio)
- Acciones claras: Aprobar (verde) / Rechazar (rojo)
- Info de gestora y scoring visible
- Confirmación antes de aprobar/rechazar

---

### 14. Vista Pública Trazabilidad (HU-P01)
**Archivo:** `app/src/portals/publico/Trazabilidad.jsx`  
**Estado actual:** Timeline vertical con eventos  
**Rediseño objetivo:**
- Timeline vertical elegante con línea conectora
- Iconos grandes por evento
- Colores por tipo de acción
- Footer educativo sobre RAEE
- QR code visible
- Responsive

---

## 🚀 PARTE 5: Prompt para Google Stitch

**COPIAR Y PEGAR ESTE PROMPT JUNTO CON LAS CAPTURAS:**

```
Eres un diseñador experto de interfaces web. Necesito que rediseñes este sistema de gestión de RAEE (Residuos Electrónicos) con un diseño moderno y profesional.

CONTEXTO DEL PROYECTO:
- Sistema web para Facultad de Ingeniería (UdelaR, Uruguay)
- 4 portales autenticados + 1 vista pública
- Usuarios: Institutos, Ecopunto (clasificación con IA), Gestoras (retiro), Admin (supervisión)
- Objetivo: Trazabilidad completa de residuos electrónicos

STACK TECNOLÓGICO (MANTENER OBLIGATORIAMENTE):
- React 18 con JSX
- Vite 5 (bundler)
- TailwindCSS 3 (utility-first, NO CSS custom)
- React Router v6
- Lucide React (iconos)
- Recharts (gráficos)
- Google Fonts Inter (ya cargada)
- Dark mode implementado con clase .dark

DISEÑO OBJETIVO:
- Estilo: Moderno, minimalista, profesional
- Inspiración: Linear, Vercel Dashboard, Stripe
- Colores primarios:
  * Verde sostenibilidad: #10b981 (green-500) para acciones principales
  * Azul tecnología: #3b82f6 (blue-500) para acciones secundarias
  * Grises: gray-50 a gray-950 (fondos, textos, borders)
- Efectos:
  * Glassmorphism en modals: bg-white/80 backdrop-blur-xl
  * Gradientes sutiles en fondos
  * Sombras suaves: shadow-sm, shadow-md
  * Hover states con transition-colors
  * Micro-interacciones en botones

REGLAS DE CÓDIGO:
1. SOLO usar clases de TailwindCSS (nunca CSS inline o <style>)
2. Mantener estructura de componentes React actual
3. Preservar toda la funcionalidad (no cambiar lógica)
4. Dark mode compatible: usar dark:clase para cada color
5. Responsive mobile-first: usar sm:, md:, lg: breakpoints
6. Iconos solo de Lucide React
7. Mantener nombres de archivos y exports

COMPONENTES A MEJORAR:

1. BUTTONS:
   - Primary: bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm
   - Secondary: bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-lg
   - Ghost: hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700
   - Danger: bg-red-500 hover:bg-red-600 text-white rounded-lg

2. CARDS:
   - Border sutil: border border-gray-200 dark:border-gray-800
   - Fondo: bg-white dark:bg-gray-900
   - Sombra: shadow-sm hover:shadow-md
   - Bordes: rounded-xl
   - Padding generoso: p-6

3. INPUTS:
   - Labels encima: text-sm font-medium text-gray-700 dark:text-gray-300
   - Border: border-gray-200 dark:border-gray-800
   - Focus ring: focus:ring-2 focus:ring-green-500 focus:border-transparent
   - Fondo: bg-white dark:bg-gray-900

4. TABLES:
   - Row hover: hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
   - Border: border-b border-gray-200 dark:border-gray-800
   - Header sticky: sticky top-0 bg-white dark:bg-gray-900

5. MODALS:
   - Backdrop: bg-black/50 backdrop-blur-sm
   - Card: bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl
   - Animación: fade-in

6. TOASTS (ya implementados):
   - Posición: fixed top-4 right-4 z-50
   - Animación: animate-slide-in
   - Colores por tipo: green (success), red (error), amber (warning), blue (info)

NO CAMBIAR:
- Nombres de archivos
- Exports de componentes
- Props de componentes
- Lógica de negocio (useEffect, useState, funciones)
- Estructura de rutas React Router
- Context API (useApp)
- Llamadas a API OpenRouter

PRIORIDAD DE REDISEÑO:
1. Admin Dashboard (página más visible en demos)
2. Login (primera impresión)
3. Gestora Dashboard (diferenciador: cotizaciones)
4. Ecopunto Clasificar (feature de IA)
5. Vista Pública Trazabilidad

ENTREGABLE:
Para cada captura de pantalla que te comparto, genera:
1. Código React completo con TailwindCSS
2. Mantener estructura JSX actual
3. Solo cambiar atributos className
4. Incluir variantes dark mode (dark:*)
5. Asegurar responsive (usar sm:, md:, lg:)
6. Comentarios solo si hay cambios complejos

EJEMPLO DE TRANSFORMACIÓN:

ANTES:
<button className="bg-blue-500 text-white p-2 rounded">
  Guardar
</button>

DESPUÉS:
<button className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
  Guardar
</button>

¿Estás listo? Voy a compartir las capturas de pantalla una por una o en grupos por portal.

Empieza rediseñando el ADMIN DASHBOARD (captura 11-admin-dashboard.png).
Genera el código React + Tailwind completo para ese componente.
```

---

## 📸 PARTE 6: Cómo Hacer las Capturas

### Método Recomendado (Chrome DevTools)

1. **Levantar proyecto:**
   ```bash
   cd app
   npm run dev
   ```
   → http://localhost:5173

2. **Abrir DevTools:**
   - Presionar `F12` o `Ctrl+Shift+I`

3. **Activar modo responsive:**
   - Presionar `Ctrl+Shift+M`
   - Seleccionar resolución: `1920x1080` (Full HD)

4. **Captura de página completa:**
   - Abrir Command Menu: `Ctrl+Shift+P`
   - Escribir: `Capture full size screenshot`
   - Enter
   - Se descarga automáticamente

5. **Repetir para cada página**

### Lista de Capturas (14 páginas)

**Login y Autenticación:**
- `01-login.png` — http://localhost:5173/login

**Portal Instituto** (login: inco@fing.edu.uy / inco123)
- `02-instituto-dashboard.png` — Dashboard principal
- `03-instituto-nueva-solicitud.png` — Formulario nueva solicitud
- `04-instituto-detalle-lote.png` — Detalle de un lote

**Portal Ecopunto** (login: ecopunto@fing.edu.uy / eco123)
- `05-ecopunto-dashboard.png` — Dashboard con filtros
- `06-ecopunto-clasificar.png` — Clasificación con IA
- `07-ecopunto-publicar.png` — Publicación de lotes

**Portal Gestora** (login: gestora1@reciclauY.com / gest123)
- `08-gestora-dashboard.png` — Catálogo de lotes
- `09-gestora-detalle-lote.png` — Detalle con cotización
- `10-gestora-solicitudes.png` — Mis solicitudes y scoring

**Portal Admin** (login: admin@fing.edu.uy / admin123)
- `11-admin-dashboard.png` — Dashboard con KPIs
- `12-admin-actores.png` — Gestión de actores
- `13-admin-retiros.png` — Aprobación de retiros

**Vista Pública** (sin login)
- `14-publica-trazabilidad.png` — http://localhost:5173/trazabilidad?lote=PUB-2026-001

### Guardar Capturas

Crear carpeta temporal:
```bash
mkdir docs/capturas
```

Guardar cada captura con el nombre indicado.

---

## ✅ PARTE 7: Workflow con Stitch

### Paso 1: Hacer Capturas (30 minutos)
- Levantar proyecto local
- Capturar las 14 páginas
- Guardar en `docs/capturas/`

### Paso 2: Subir a Stitch por Grupos

**Grupo 1: Portal Admin (prioridad alta)**
- Subir: 11, 12, 13
- Usar prompt de arriba
- Pedir que empiece por el Dashboard

**Grupo 2: Login + Instituto**
- Subir: 01, 02, 03, 04
- Aplicar mismo estilo del Admin

**Grupo 3: Ecopunto**
- Subir: 05, 06, 07
- Destacar la sección de clasificación con IA

**Grupo 4: Gestora**
- Subir: 08, 09, 10
- Enfatizar cotizaciones y scoring

**Grupo 5: Vista Pública**
- Subir: 14
- Timeline elegante y educativa

### Paso 3: Iterar con Stitch

Buenos prompts de refinamiento:
- "Hazlo más espacioso"
- "Usa glassmorphism en el modal"
- "Agrega gradientes sutiles al fondo"
- "Mejora la jerarquía visual de los títulos"
- "Haz los iconos más grandes en los KPIs"
- "Mejora el contraste en dark mode"

### Paso 4: Aplicar al Proyecto

1. Copiar código generado
2. Reemplazar en archivo correspondiente
3. Probar que funcione (funcionalidad + dark mode)
4. Commit:
   ```bash
   git add app/src/portals/admin/Dashboard.jsx
   git commit -m "style(admin): rediseño moderno dashboard con Stitch"
   ```

---

## 🎯 Checklist de Validación

Por cada componente rediseñado:
- [ ] Mantiene toda la funcionalidad original
- [ ] Solo usa clases de TailwindCSS
- [ ] Dark mode funciona correctamente
- [ ] Responsive en mobile (probar con DevTools)
- [ ] Hover states definidos
- [ ] Transiciones suaves (transition-colors, transition-all)
- [ ] Colores dentro de la paleta definida
- [ ] Iconos de Lucide React
- [ ] Sin errores en consola

---

## 💡 Tips Finales

**Para mejores resultados en Stitch:**
1. Subir capturas de alta calidad (1920x1080 mínimo)
2. Agrupar por portal (contexto relacionado)
3. Ser específico en prompts de refinamiento
4. Pedir código completo por componente
5. Validar que use solo Tailwind

**Si Stitch sugiere algo que no queremos:**
- "No uses librerías externas, solo Tailwind"
- "No cambies la lógica, solo los estilos"
- "Mantén la estructura JSX actual"

**Después del rediseño:**
- Probar flujos completos E2E
- Validar accesibilidad (contraste, aria-labels)
- Optimizar imágenes si agregamos alguna
- Documentar cambios en CHANGELOG.md

---

**Creado:** 27 de abril de 2026  
**Para:** Rediseño moderno del MVP EcoFIng con Google Stitch  
**Duración estimada:** 4-6 horas (capturas + rediseño + aplicación)
