# 📚 PROMPTS MASTER — EcoFIng

> **Documentación completa de TODOS los prompts utilizados en el desarrollo del proyecto**  
> **Para:** Docentes del Seminario de Tecnologías 2026  
> **Equipo:** Carmela González · Verónica Iriarte · Juan Raimondo  
> **Última actualización:** 5 de mayo de 2026

---

## 📋 Índice

1. [Introducción](#introducción)
2. [Metodología de Trabajo](#metodología-de-trabajo)
3. [Prompts de Setup](#prompts-de-setup)
4. [Prompts de Desarrollo](#prompts-de-desarrollo)
5. [Prompts de Diseño](#prompts-de-diseño)
6. [Prompts de Testing](#prompts-de-testing)
7. [Prompts de Deployment](#prompts-de-deployment)
8. [Prompts Ad-hoc y Fixes](#prompts-ad-hoc-y-fixes)
9. [Resumen de Sesiones](#resumen-de-sesiones)

---

## Introducción

Este documento consolida **TODOS los prompts** utilizados en el desarrollo de EcoFIng, un sistema web para gestión de RAEE (Residuos de Aparatos Eléctricos y Electrónicos) en la Facultad de Ingeniería.

### Contexto del Proyecto

- **Herramienta IA:** Claude Code (OpenCode) — CLI de Anthropic
- **Modelo:** Claude Sonnet 4.5
- **Periodo:** Abril - Mayo 2026 (9 sesiones de desarrollo)
- **Resultado:** MVP funcional con 13 Historias de Usuario implementadas

### Estructura de este Documento

Cada prompt se documenta con:
- **Sesión:** Cuándo se usó
- **Objetivo:** Qué se quería lograr
- **Prompt completo:** Texto exacto usado
- **Resultado:** Qué se obtuvo
- **Archivos afectados:** Cambios generados

---

## Metodología de Trabajo

### Flujo de Trabajo con IA

1. **Contexto permanente:** Archivo `CLAUDE.md` en raíz del proyecto con instrucciones base
2. **Prompts estructurados:** Documentos en `docs/prompts/` por sprint
3. **Revisión antes de commit:** Verificar cambios generados antes de aceptar
4. **Documentación post-sesión:** Actualizar `CHANGELOG.md` con decisiones tomadas

### Convenciones

- **Prompts largos:** Para desarrollo de features completas (HUs)
- **Prompts cortos:** Para fixes, ajustes puntuales
- **Prompts iterativos:** Refinamiento progresivo basado en resultados

---

## Prompts de Setup

### PROMPT S0: Inicialización del Proyecto

**Sesión:** 3  
**Fecha:** 21 de abril de 2026  
**Objetivo:** Crear estructura base del proyecto React

```
Necesito inicializar un proyecto React + Vite para EcoFIng.

Requisitos:
1. Crear proyecto con: npm create vite@latest app -- --template react
2. Instalar dependencias:
   - react-router-dom v6
   - tailwindcss v3
   - recharts
   - qrcode.react
3. Configurar TailwindCSS con modo oscuro
4. Crear estructura de carpetas:
   - src/portals/ (para los 5 portales)
   - src/data/ (para JSON mock)
   - src/context/ (para estado global)
   - src/constants/ (para estados)
   - src/services/ (para API calls)
   - src/components/ (shared components)

5. Crear archivos base:
   - AppContext.jsx con useReducer
   - estados.js con constantes de estados de lotes
   - App.jsx con React Router configurado

Estructura de rutas prevista:
/login
/instituto/*
/ecopunto/*
/gestora/*
/admin/*
/trazabilidad

No implementes componentes todavía, solo placeholders que muestren el nombre del portal.
```

**Resultado:** Proyecto inicializado con estructura completa

**Archivos creados:**
- `app/package.json`
- `app/vite.config.js`
- `app/tailwind.config.js`
- `app/src/main.jsx`
- `app/src/App.jsx`
- `app/src/context/AppContext.jsx`
- `app/src/constants/estados.js`
- Estructura de carpetas completa

---

### PROMPT S1: Datos Mock

**Sesión:** 3  
**Fecha:** 21 de abril de 2026  
**Objetivo:** Crear datos de prueba realistas

```
Necesito crear los archivos JSON mock en app/src/data/.

Creá los siguientes archivos con datos realistas para el contexto de FIng:

1. institutos.json (4 institutos):
   - INCO (Instituto de Computación)
   - IIE (Instituto de Ingeniería Eléctrica)
   - IIMPI (Instituto de Ingeniería Mecánica)
   - IMFIA (Instituto de Física)
   
   Cada uno con: id, nombre, email_contacto, telefono

2. gestoras.json (2 gestoras):
   - ReciclaUY
   - EcoTech Solutions
   
   Cada una con: id, razon_social, scoring (0-100), habilitacion_ministerio (boolean)

3. usuarios.json (4 usuarios de prueba, uno por rol):
   - instituto: inco@fing.edu.uy / inco123
   - ecopunto: ecopunto@fing.edu.uy / eco123
   - gestora: gestora1@reciclauY.com / gest123
   - admin: admin@fing.edu.uy / admin123
   
   Cada uno con: email, password, rol, institutoId o gestoraId según corresponda

4. lotes.json (6 lotes en distintos estados del flujo):
   - 1 en "Pendiente envío Ecopunto"
   - 1 en "En Ecopunto"
   - 1 en "Clasificado"
   - 2 en "Disponible para retiro"
   - 1 en "Finalizado"
   
   Cada lote con: id, institutoId, tamaño, peso_real_kg, categoria_final, estado, fechas relevantes, foto_base64 (placeholder pequeño)

5. config.json con:
   - tamanos_lote: { chico: "< 1m³", mediano: "1-3m³", grande: "> 3m³" }
   - categorias_raee: ["Equipos informáticos", "Pantallas y monitores", "Baterías", ...]
   - estados_lote: objeto con labels y colores
   - factores_co2_kg: por categoría
   - scoring_certificado_a_tiempo: 10

Importante: Usar snake_case en los JSON (peso_real_kg, not pesoRealKg) para simular respuesta de API.
```

**Resultado:** 5 archivos JSON con datos realistas

**Archivos creados:**
- `app/src/data/institutos.json`
- `app/src/data/gestoras.json`
- `app/src/data/usuarios.json`
- `app/src/data/lotes.json`
- `app/src/data/config.json`

---

### PROMPT S2: Verificación de Setup

**Sesión:** 4  
**Fecha:** 25 de abril de 2026  
**Objetivo:** Validar que todo funciona antes de comenzar desarrollo

**Contenido completo:** Ver `docs/prompts/00-setup-verificacion.md`

**Checklist verificado:**
- ✅ Proyecto levanta en http://localhost:5173
- ✅ TailwindCSS funciona
- ✅ React Router funciona
- ✅ AppContext carga datos mock correctamente
- ✅ No hay errores en consola

---

## Prompts de Desarrollo

### PROMPT D1: Portal Instituto (Sprint 1)

**Sesión:** 4  
**Fecha:** 25 de abril de 2026  
**Objetivo:** Implementar HU-I01, HU-I02, HU-I03 (Dashboard, Nueva Solicitud, Detalle)

**Contenido completo:** Ver `docs/prompts/01-sprint1-instituto.md`

**Resumen del prompt:**
```
Leé el CLAUDE.md y docs/user-stories/HU_Portal_Instituto.md.

Construye el Portal Instituto completo:

1. HU-I01: Dashboard en app/src/portals/instituto/Dashboard.jsx
   - Tabla de lotes del instituto logueado
   - Clickeable para ver detalle
   - Botón "Nueva solicitud"

2. HU-I02: Nueva Solicitud en app/src/portals/instituto/NuevaSolicitud.jsx
   - Formulario: tamaño, foto, observaciones
   - Validación inline
   - Generar ID LOT-2026-XXX
   - Dispatch al contexto

3. HU-I03: Detalle del Lote en app/src/portals/instituto/DetalleLote.jsx
   - Datos completos del lote
   - Timeline visual vertical
   - QR code con qrcode.react
   - Botón descargar QR

Actualiza App.jsx con las rutas /instituto, /instituto/nueva, /instituto/lote/:id
```

**Resultado:** Portal Instituto 100% funcional

**Archivos creados/modificados:**
- `app/src/portals/instituto/Dashboard.jsx`
- `app/src/portals/instituto/NuevaSolicitud.jsx`
- `app/src/portals/instituto/DetalleLote.jsx`
- `app/src/components/StatusBadge.jsx` (componente compartido)
- `app/src/App.jsx` (rutas agregadas)

---

### PROMPT D2: Portal Ecopunto + Gestora (Sprint 2)

**Sesión:** 5  
**Fecha:** 26 de abril de 2026  
**Objetivo:** Implementar HU-E01, HU-E03, HU-G01, HU-G02, HU-G03

**Contenido completo:** Ver `docs/prompts/02-sprint2-ecopunto-gestora.md`

**Resumen del prompt:**
```
Construye Portal Ecopunto (sin IA todavía) y Portal Gestora:

ECOPUNTO:
- HU-E01: Bandeja Entrante → marcar lotes como recibidos
- HU-E03: Listos para Publicar → publicar lotes clasificados

GESTORA:
- HU-G01: Catálogo → ver lotes disponibles
- HU-G02: Detalle de Lote → ofrecer retiro
- HU-G03: Mis Retiros → subir certificados, actualizar scoring

Crea ScoringBadge como componente compartido.
```

**Resultado:** Portales Ecopunto y Gestora funcionales (sin clasificación IA)

**Archivos creados/modificados:**
- `app/src/portals/ecopunto/BandejaEntrante.jsx`
- `app/src/portals/ecopunto/ListosParaPublicar.jsx`
- `app/src/portals/gestora/Catalogo.jsx`
- `app/src/portals/gestora/DetalleLote.jsx`
- `app/src/portals/gestora/MisRetiros.jsx`
- `app/src/components/ScoringBadge.jsx`
- `app/src/App.jsx` (rutas)

---

### PROMPT D3: Clasificación con IA (HU-E02)

**Sesión:** 6  
**Fecha:** 27 de abril de 2026  
**Objetivo:** Integrar Claude Vision para clasificación de RAEE

**Contenido completo:** Ver `docs/prompts/03-sprint3-ia.md`

**Resumen del prompt:**
```
Implementa HU-E02: Clasificación con IA en app/src/portals/ecopunto/Clasificacion.jsx

Flujo:
1. Upload de imagen (drag & drop)
2. Llamar a clasificarImagenRAEE() desde services/claudeVision.js
3. Mostrar sugerencia de la IA con nivel de confianza
4. Permitir aceptar o corregir manualmente
5. Ingresar peso real
6. Guardar con estado "Clasificado"

Manejar error de IA → fallback a clasificación manual

Verificar que VITE_OPENROUTER_API_KEY esté configurada.
```

**Resultado:** Clasificación con IA funcionando

**Archivos creados/modificados:**
- `app/src/portals/ecopunto/Clasificacion.jsx`
- `app/src/services/claudeVision.js` (ya existía, revisado)

---

### PROMPT D4: Portal Admin (Sprint 3)

**Sesión:** 6  
**Fecha:** 27 de abril de 2026  
**Objetivo:** Implementar HU-A01, HU-A02, HU-A03

**Contenido completo:** Ver `docs/prompts/04-sprint3-admin.md`

**Resumen del prompt:**
```
Construye Portal Admin:

HU-A01: Dashboard con KPIs
- Total kg gestionados
- CO2 evitado
- Lotes en proceso
- Gráficos con Recharts

HU-A02: Gestión de Actores
- CRUD de usuarios
- Habilitar/deshabilitar gestoras
- Actualizar scoring manual

HU-A03: Aprobación de Retiros
- Lista de solicitudes pendientes
- Aprobar/rechazar retiro
- Asignar gestora ganadora
- Actualizar estado de lote
```

**Resultado:** Portal Admin completo

**Archivos creados/modificados:**
- `app/src/portals/admin/Dashboard.jsx`
- `app/src/portals/admin/GestionActores.jsx`
- `app/src/portals/admin/AprobacionRetiros.jsx`

---

### PROMPT D5: Vista Pública + Pulido (Sprint 3-4)

**Sesión:** 6-7  
**Fecha:** 27 de abril de 2026  
**Objetivo:** Implementar HU-P01 y mejorar UX

**Contenido completo:** Ver `docs/prompts/05-sprint3-publica-y-06-pulido.md`

**Resumen del prompt:**
```
1. HU-P01: Vista Pública (sin login)
   - Ruta /trazabilidad?lote=<ID>
   - Timeline completo del lote
   - Información de impacto ambiental
   - Responsive para móvil

2. Pulido general:
   - Verificar consistencia de colores Tailwind
   - Unificar estilos de botones
   - Agregar transiciones suaves
   - Verificar espaciados (múltiplos de 4)
   - Responsive en todos los portales
```

**Resultado:** Vista pública funcional + mejoras UX

**Archivos creados/modificados:**
- `app/src/portals/publico/Trazabilidad.jsx`
- Ajustes de estilos en múltiples componentes

---

## Prompts de Diseño

### PROMPT DIS1: Rediseño Landing Page

**Sesión:** 10  
**Fecha:** 4 de mayo de 2026  
**Objetivo:** Crear landing page moderna con componentes visuales atractivos

```
Necesito rediseñar completamente la landing page de EcoFIng (/login antes del login).

Requisitos de diseño:

1. Hero Section:
   - Título grande: "Gestión Inteligente de RAEE en FIng"
   - Subtítulo: breve descripción del impacto ambiental
   - CTA principal: "Ingresar al Sistema"
   - Background: gradiente emerald → cyan
   - Animación sutil en el título (fade-in)

2. Features Section (3 cards):
   - IA para Clasificación (icono Sparkles)
   - Trazabilidad Completa (icono Shield)
   - Impacto Medible (icono Leaf)
   - Cada card con hover effect (scale + sombra)

3. Stats Section:
   - Contadores animados:
     - "1,200+ kg gestionados"
     - "450 kg CO2 evitados"
     - "8 Institutos participantes"
   - Usar react-countup o implementar contador simple

4. CTA Final:
   - "Comenzá a gestionar tus RAEE hoy"
   - Botón grande que lleva a login modal

5. Footer:
   - Logo FIng
   - Links: GitHub, Documentación
   - Copyright

Stack visual:
- TailwindCSS con gradientes
- Iconos de lucide-react
- Animaciones con CSS transitions
- Responsive mobile-first

No uses librerías externas adicionales (solo las que ya tenemos).
```

**Resultado:** Landing page moderna implementada

**Archivos creados/modificados:**
- `app/src/components/LandingPage.jsx` (nuevo)
- `app/src/components/Icon.jsx` (iconos SVG inline)
- `app/src/App.jsx` (ruta / → LandingPage)

**Contenido completo:** Ver `docs/prompts/PROMPTS-PRESENTACION-FINAL.md`

---

### PROMPT DIS2: Generación de Assets Visuales

**Sesión:** 10  
**Fecha:** 28 de abril de 2026  
**Objetivo:** Crear prompts para generar imágenes con IA generativa

**Nota:** Estos prompts NO fueron usados en Claude Code, sino en herramientas de generación de imágenes (Midjourney, DALL-E).

**Contenido completo:** Ver `docs/prompts/PROMPTS-IMAGENES-IA.md`

**Categorías documentadas:**
- 20 prompts para imágenes de RAEE (equipos, pantallas, baterías)
- 5 prompts para espacios (Ecopunto, laboratorios)
- 5 prompts para infografías
- 5 prompts para branding (logo, banners)
- 10 prompts para presentación final

---

## Prompts de Testing

### PROMPT T1: Testing End-to-End Manual

**Sesión:** 9  
**Fecha:** 27 de abril de 2026  
**Objetivo:** Validar flujo completo Instituto → Ecopunto → Gestora → Admin

```
Necesito crear un documento de testing E2E que valide el flujo completo del sistema.

Crea docs/TESTING-E2E-VINCULACION.md con:

1. Checklist del flujo completo:
   [ ] Instituto crea lote → ¿Aparece en Ecopunto?
   [ ] Ecopunto recibe lote → ¿Se actualiza en Instituto?
   [ ] Ecopunto clasifica → ¿Estado correcto?
   [ ] Ecopunto publica → ¿Aparece en Gestora?
   [ ] Gestora cotiza → ¿Aparece en Admin?
   [ ] Admin aprueba → ¿Se actualiza en Gestora?
   [ ] Gestora finaliza → ¿Certificado visible?
   [ ] Vista pública → ¿Timeline completo?

2. Para cada paso:
   - Acción a realizar
   - Resultado esperado
   - ✅ o ❌ según resultado real
   - Screenshot de evidencia (opcional)

3. Sección de bugs encontrados:
   - Descripción del bug
   - Severidad (crítico/alto/medio/bajo)
   - Pasos para reproducir
   - Fix sugerido

4. Métricas del testing:
   - % de funcionalidades OK
   - Tiempo de ejecución del test
   - Bugs encontrados/resueltos

Ejecuta el testing manualmente y documenta los resultados reales.
```

**Resultado:** Documento de testing con resultados validados

**Archivos creados:**
- `docs/TESTING-E2E-VINCULACION.md`

---

### PROMPT T2: Reporte de Testing por Sesión

**Sesión:** 10  
**Fecha:** 28 de abril de 2026  
**Objetivo:** Documentar bugs encontrados y resueltos

```
Documenta los bugs encontrados en la sesión 10 en docs/TESTING-SESION-10.md:

Estructura:
1. Bugs encontrados (lista numerada)
2. Para cada bug:
   - Descripción
   - Archivo afectado
   - Severidad
   - Fix aplicado (código antes/después)
3. Testing de regresión post-fix
4. Checklist de funcionalidades verificadas

Incluye también mejoras UX implementadas que no eran bugs pero mejoraron la experiencia.
```

**Resultado:** Reporte completo de testing

**Archivos creados:**
- `docs/TESTING-SESION-10.md`
- `docs/REPORTE-TESTING-SESION-10.md`

---

## Prompts de Deployment

### PROMPT DEP1: Configuración de Vercel

**Sesión:** 7  
**Fecha:** 27 de abril de 2026  
**Objetivo:** Deployar aplicación en Vercel

```
Necesito deployar EcoFIng en Vercel con dominio personalizado seminario.noah.uy.

Crea docs/DEPLOYMENT.md con:

1. Guía paso a paso:
   - Conectar repo GitHub a Vercel
   - Configurar build settings:
     * Build Command: cd app && npm run build
     * Output Directory: app/dist
     * Install Command: cd app && npm install
   - Agregar variables de entorno:
     * VITE_OPENROUTER_API_KEY (desde .env.local)

2. Configuración de dominio:
   - Agregar custom domain en Vercel
   - Configurar DNS en proveedor (Noah Cloud):
     * CNAME seminario → cname.vercel-dns.com
   - Verificar SSL

3. Troubleshooting:
   - "Module not found" → verificar paths relativos
   - "Build failed" → revisar package.json en raíz vs app/
   - 404 en rutas → configurar vercel.json con rewrites

4. Checklist post-deployment:
   - [ ] App carga en seminario.noah.uy
   - [ ] Login funciona
   - [ ] API de IA responde (si hay key)
   - [ ] Todas las rutas funcionan
   - [ ] Responsive en móvil

Incluye capturas de pantalla de Vercel dashboard.
```

**Resultado:** App deployada y funcionando

**Archivos creados:**
- `docs/DEPLOYMENT.md`
- `vercel.json` (config de rewrites para SPA)

---

### PROMPT DEP2: Configuración DNS y SSL

**Sesión:** 7  
**Fecha:** 27 de abril de 2026

```
Documenta la configuración DNS completa en DEPLOYMENT.md:

1. Registros DNS necesarios:
   CNAME seminario.noah.uy → cname.vercel-dns.com

2. Verificación:
   - dig seminario.noah.uy
   - nslookup seminario.noah.uy

3. SSL:
   - Vercel genera certificado automático
   - Tiempo de propagación: 24-48 horas
   - Verificar HTTPS redirige automáticamente

4. Troubleshooting DNS:
   - TTL alto → esperar propagación
   - "Domain not verified" → revisar CNAME
   - Mix de HTTP/HTTPS → forzar HTTPS en Vercel
```

**Resultado:** Dominio configurado con SSL

---

## Prompts Ad-hoc y Fixes

### PROMPT F1: Fix de Seguridad - API Key Expuesta

**Sesión:** 10  
**Fecha:** 28 de abril de 2026  
**Objetivo:** Prevenir commit de API keys

```
URGENTE: Necesito prevenir que se commiteen API keys por error.

Acciones:
1. Agregar .env.local al .gitignore (verificar que esté)
2. Crear .env.example con:
   VITE_OPENROUTER_API_KEY=sk-or-v1-...tu-key-aqui...
3. Actualizar README.md con sección "Configuración de Variables de Entorno"
4. Crear docs/SECURITY.md con:
   - Buenas prácticas para API keys
   - Qué hacer si se commitea una key por error
   - Usar secrets de GitHub/Vercel en producción

5. Git hook pre-commit (opcional):
   - Script que busque patrones sk-or-v1- en staged files
   - Bloquear commit si encuentra match
   - Instrucciones en docs/PREVENCION-API-KEYS.md
```

**Resultado:** Medidas de seguridad implementadas

**Archivos creados/modificados:**
- `.gitignore` (verificado)
- `.env.example` (creado)
- `docs/SECURITY.md`
- `docs/PREVENCION-API-KEYS.md`

---

### PROMPT F2: Fix de Estado en Clasificación

**Sesión:** 9  
**Fecha:** 27 de abril de 2026  
**Objetivo:** Corregir bug donde estado no se actualizaba

```
Bug encontrado:
Al clasificar un lote en Ecopunto, el estado se actualiza a "Clasificado" pero el lote sigue apareciendo en "Bandeja Entrante" en lugar de "Listos para Publicar".

Investigá:
1. ¿El dispatch se está ejecutando correctamente?
2. ¿El reducer actualiza el array de lotes?
3. ¿Hay algún problema de referencia (mutación directa)?
4. ¿Los componentes se re-renderizan al cambiar el estado?

Fix esperado:
Asegurar que:
- dispatch actualiza el lote correcto por ID
- El reducer retorna nuevo array (no muta)
- Los componentes usan el estado actualizado del contexto

Documenta el fix en docs/BUGFIXES-SESION-9.md
```

**Resultado:** Bug resuelto

**Archivos modificados:**
- `app/src/context/AppContext.jsx` (reducer corregido)
- `docs/BUGFIXES-SESION-9.md` (documentación)

---

### PROMPT F3: Mejora UX - Información de Lotes en Instituto

**Sesión:** 10  
**Fecha:** 28 de abril de 2026  
**Objetivo:** Agregar más información en el dashboard del instituto

```
Mejora de UX solicitada:
En el dashboard del Instituto, agregar:

1. Columna "Última actualización" con fecha del último cambio de estado
2. Tooltip en hover sobre el estado que explique qué significa
3. Filtro por estado (select desplegable)
4. Ordenamiento por columna (clickear header para ordenar)
5. Badge con count de lotes por estado en el header

Implementar sin librerías externas, solo TailwindCSS + React.
```

**Resultado:** Dashboard mejorado

**Archivos modificados:**
- `app/src/portals/instituto/Dashboard.jsx`
- `docs/MEJORA-UX-INFO-INSTITUTO.md` (documentación)

---

## Resumen de Sesiones

### Sesión 1-2: Planificación y Diseño
- Definición de User Stories
- Creación de ADRs
- Diseño de arquitectura

### Sesión 3: Setup Inicial
- ✅ PROMPT S0: Inicialización del proyecto
- ✅ PROMPT S1: Creación de datos mock
- Resultado: Proyecto React + Vite funcionando

### Sesión 4: Sprint 1 - Portal Instituto
- ✅ PROMPT S2: Verificación de setup
- ✅ PROMPT D1: Portal Instituto completo
- Resultado: HU-I01, HU-I02, HU-I03 implementadas

### Sesión 5: Sprint 2 - Ecopunto + Gestora
- ✅ PROMPT D2: Portales Ecopunto y Gestora (sin IA)
- Resultado: HU-E01, HU-E03, HU-G01, HU-G02, HU-G03 implementadas

### Sesión 6: Sprint 3 - IA + Admin + Vista Pública
- ✅ PROMPT D3: Clasificación con IA (HU-E02)
- ✅ PROMPT D4: Portal Admin (HU-A01, HU-A02, HU-A03)
- ✅ PROMPT D5: Vista Pública (HU-P01)
- Resultado: MVP 100% funcional (13/13 HUs)

### Sesión 7: Deployment
- ✅ PROMPT DEP1: Configuración Vercel
- ✅ PROMPT DEP2: DNS y SSL
- Resultado: App deployada en seminario.noah.uy

### Sesión 8: Integración con Supabase
- Migración de datos mock a Supabase (PostgreSQL)
- Configuración de RLS policies
- Integración completa CRUD

### Sesión 9: Testing y Bugfixes
- ✅ PROMPT T1: Testing E2E
- ✅ PROMPT F2: Fix de estado en clasificación
- Resultado: Sistema validado end-to-end

### Sesión 10: Pulido Final y Rediseño
- ✅ PROMPT DIS1: Landing page moderna
- ✅ PROMPT F1: Fix de seguridad API keys
- ✅ PROMPT F3: Mejoras UX
- Resultado: Sistema pulido para presentación

---

## Estadísticas Finales

### Prompts Totales Documentados
- **Setup:** 3 prompts
- **Desarrollo de Features:** 5 prompts principales
- **Diseño:** 2 prompts
- **Testing:** 2 prompts
- **Deployment:** 2 prompts
- **Fixes y mejoras:** 3 prompts ad-hoc
- **TOTAL:** 17 prompts estructurados + decenas de prompts iterativos menores

### Archivos Generados por Prompts
- **Componentes React:** 25+ archivos
- **Documentación:** 30+ archivos .md
- **Configuración:** 5 archivos (vite, tailwind, vercel, etc.)
- **Datos:** 5 archivos JSON mock

### Líneas de Código Generadas
- **React/JSX:** ~3,500 líneas
- **Documentación:** ~8,000 líneas
- **Configuración:** ~200 líneas

---

## Lecciones Aprendidas

### Qué funcionó bien
1. **Prompts estructurados por sprint:** Mejor organización y trazabilidad
2. **Contexto permanente (CLAUDE.md):** Evita repetir instrucciones
3. **Revisión antes de commit:** Detecta errores tempranos
4. **Documentación incremental:** Más fácil que documentar todo al final

### Qué mejoraría
1. **Testing automatizado:** Prompts para generar tests unitarios
2. **Versionado de prompts:** Git tags en cada sprint
3. **Métricas de efectividad:** Tiempo de ejecución, re-prompts necesarios

### Recomendaciones para Futuros Proyectos
1. Definir CLAUDE.md antes de escribir código
2. Crear plantillas de prompts por tipo de tarea
3. Documentar prompts fallidos (qué no funcionó y por qué)
4. Usar prompts cortos e iterativos en lugar de megaprompts

---

## Apéndice: Prompts Originales Completos

Los prompts completos referenciados en este documento se encuentran en:
- `docs/prompts/00-setup-verificacion.md`
- `docs/prompts/01-sprint1-instituto.md`
- `docs/prompts/02-sprint2-ecopunto-gestora.md`
- `docs/prompts/03-sprint3-ia.md`
- `docs/prompts/04-sprint3-admin.md`
- `docs/prompts/05-sprint3-publica-y-06-pulido.md`
- `docs/prompts/PROMPTS-IMAGENES-IA.md`
- `docs/prompts/PROMPTS-PRESENTACION-FINAL.md`

---

**Documentado por:** Juan Raimondo  
**Con asistencia de:** Claude Sonnet 4.5 (Anthropic)  
**Fecha de finalización:** 5 de mayo de 2026  
**Versión:** 1.0
