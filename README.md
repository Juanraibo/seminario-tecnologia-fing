# EcoFIng — Sistema de Gestión de RAEE

MVP web para la gestión de Residuos de Aparatos Eléctricos y Electrónicos (RAEE) en la Facultad de Ingeniería de la Universidad de la República (UdelaR), Uruguay.

**Materia:** Seminario de Tecnologías · FIng UdelaR · Abril–Junio 2026  
**Presentación final:** 26 de mayo de 2026  
**Equipo:** Carmela González · Verónica Iriarte · Juan Raimondo

---

## ¿Qué hace el sistema?

| Actor | Qué puede hacer |
|---|---|
| **Instituto** | Registrar lotes de RAEE, hacer seguimiento, ver QR de trazabilidad |
| **Ecopunto** | Recibir lotes, clasificarlos con asistencia de IA, publicarlos |
| **Gestora** | Ver catálogo de lotes disponibles, solicitar retiro, subir certificado |
| **Administrador** | Ver KPIs de impacto ambiental, gestionar actores, aprobar retiros |
| **Ciudadano** | Escanear QR para ver la trazabilidad pública de un lote (sin login) |

---

## Cómo levantar el proyecto

```bash
git clone https://github.com/Juanraibo/seminario-tecnologia-fing.git
cd seminario-tecnologia-fing/app
npm install
npm run dev
```

Abrir **http://localhost:5173**

### Usuarios de prueba

| Email | Contraseña | Portal |
|---|---|---|
| admin@fing.edu.uy | admin123 | Administrador |
| inco@fing.edu.uy | inco123 | Instituto (INCO) |
| ecopunto@fing.edu.uy | eco123 | Ecopunto |
| gestora1@reciclauY.com | gest123 | Gestora |

---

## Estructura del repositorio

```
seminario-tecnologia-fing/
├── app/          → Código fuente (React + Vite)
├── docs/         → Documentación (HUs, ADRs, prompts, arquitectura)
├── entregas/     → Entregables académicos por sesión
├── CLAUDE.md     → Instrucciones para el agente de IA (OpenCode)
└── CHANGELOG.md  → Bitácora de decisiones y avance
```

---

## Stack tecnológico

React 18 · Vite 5 · TailwindCSS · React Router v6 · Supabase (PostgreSQL) · OpenRouter API (IA) · Climatiq API (CO₂)

---

## Funcionalidades implementadas

✅ **4 Portales completos:**
- **Instituto:** Registro de lotes, seguimiento, QR de trazabilidad
- **Ecopunto:** Clasificación con IA (OpenRouter + Claude), publicación de lotes
- **Gestora:** Catálogo, cotizaciones, gestión de scoring
- **Admin:** Dashboard ambiental, gestión de actores, aprobación de retiros

✅ **Vista Pública:** Trazabilidad sin login (escaneo QR)

✅ **13/13 User Stories completadas:**
- HU-AUTH01: Autenticación
- HU-I01, I02, I03: Portal Instituto
- HU-E01, E02, E03: Portal Ecopunto
- HU-G01, G02, G03: Portal Gestora
- HU-A01, A02, A03: Portal Admin
- HU-P01: Vista Pública

---

## KPIs del Sistema

Según el Dashboard Administrativo y Registro Público:
- 📦 **Lotes gestionados:** Múltiples lotes de publicación y entrada
- ⚖️ **RAEE procesado:** Residuos electrónicos por categoría
- 🌍 **CO₂ evitado:** Cálculo real con Climatiq API + factores estimados
- 🔩 **Materiales recuperados:** Cobre, Aluminio, Plástico, etc.
- ✅ **Trazabilidad completa:** Desde instituto hasta certificado final
- 📊 **Registro público:** Vista abierta con búsqueda y filtros

---

## Estado del proyecto

> ✅ **MVP Completado** — 13/13 User Stories implementadas  
> 🚀 **Deployado en:** [seminario.noah.uy](https://seminario.noah.uy)  
> 🗄️ **Base de datos:** Supabase (PostgreSQL)  
> 🌐 **Registro público:** Vista mejorada con estadísticas y filtros  
> 🔬 **APIs integradas:** OpenRouter (IA), Climatiq (CO₂), Supabase (datos)  
> 📅 **Presentación final:** 26 de mayo de 2026

## Últimas Actualizaciones (Mayo 2026)

- 🗄️ **Migración a Supabase:** Base de datos PostgreSQL para persistencia real
- 🔐 **Seguridad mejorada:** Credenciales migradas a variables de entorno
- 🌓 **Modo oscuro persistente:** Preferencia guardada en localStorage
- 🔬 **API de CO₂:** Servicio carbonAPI.js con Climatiq + factores estimados
- 🧹 **Limpieza de código:** Atomic Design, estructura optimizada
- 📊 **Landing page moderna:** Presentación pública del sistema
