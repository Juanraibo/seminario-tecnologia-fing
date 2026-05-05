# 📘 Cómo se construyó EcoFIng — Guía para el Equipo

> **Qué hicimos, cómo lo hicimos y por qué**  
> **Para:** Carmela, Verónica y cualquier persona que quiera entender el proyecto  
> **Fecha:** 5 de mayo de 2026

---

## ¿Qué es EcoFIng?

Un sistema web para gestionar **residuos electrónicos (RAEE)** en la Facultad de Ingeniería. Coordina el camino completo de un residuo: desde que un instituto lo reporta hasta que una empresa recicladora lo procesa con certificado final.

**URL:** [seminario.noah.uy](https://seminario.noah.uy)

---

## El Problema que Resuelve

Antes, cada instituto acumulaba equipos rotos sin saber qué hacer con ellos. No había registro, ni trazabilidad, ni forma de medir el impacto ambiental.

EcoFIng resuelve eso conectando a los **4 actores** del proceso en un solo sistema:

| Actor | Qué hace |
|---|---|
| **Instituto** | Reporta lotes de residuos y hace seguimiento |
| **Ecopunto** | Recibe, clasifica (con ayuda de IA) y publica los lotes |
| **Gestora** | Ve lotes disponibles, cotiza y sube certificados |
| **Administrador** | Supervisa todo, aprueba retiros, ve KPIs ambientales |

---

## Cómo se Desarrolló — El Proceso

### Nuestra metodología

Trabajamos con **Historias de Usuario (HUs)**: cada funcionalidad se definió primero desde la perspectiva del usuario ("Como [rol], quiero [acción], para [beneficio]").

El desarrollo se organizó en **sprints** usando **Inteligencia Artificial** como asistente de programación.

### Las herramientas que usamos

| Herramienta | Para qué |
|---|---|
| **React + Vite** | Framework para construir la interfaz web |
| **TailwindCSS** | Estilos y diseño visual consistente |
| **OpenRouter (Claude AI)** | IA que clasifica imágenes de residuos |
| **GitHub** | Donde guardamos el código |
| **Vercel** | Donde publicamos la app en internet |
| **Claude Code (OpenCode)** | Agente de IA que nos ayudó a escribir código |

### Cómo trabajábamos en cada sesión

1. **Definíamos qué construir** → Leíamos la Historia de Usuario correspondiente
2. **Escribíamos un prompt estructurado** → Le decíamos a la IA qué hacer paso a paso
3. **Revisábamos el resultado** → Verificábamos que funcionara correctamente
4. **Documentábamos** → Guardábamos qué se hizo y por qué

Este enfoque nos permitió construir **13 funcionalidades completas en solo 10 sesiones**.

---

## Las 13 Funcionalidades Implementadas

### Portal Instituto (3 funcionalidades)
- **HU-I01:** Dashboard con todos los lotes del instituto
- **HU-I02:** Formulario para crear nueva solicitud de retiro
- **HU-I03:** Detalle del lote con línea de tiempo y código QR

### Portal Ecopunto (3 funcionalidades)
- **HU-E01:** Bandeja de lotes pendientes por recibir
- **HU-E02:** Clasificación con IA — subís una foto y la IA sugiere la categoría ⭐
- **HU-E03:** Publicar lotes para que las gestoras los vean

### Portal Gestora (3 funcionalidades)
- **HU-G01:** Catálogo de lotes disponibles para retiro
- **HU-G02:** Enviar cotización por un lote
- **HU-G03:** Mis retiros — subir certificados y ver scoring

### Portal Administrador (3 funcionalidades)
- **HU-A01:** Dashboard con KPIs ambientales (kg, CO₂)
- **HU-A02:** Gestión de usuarios y gestoras
- **HU-A03:** Aprobar o rechazar retiros

### Vista Pública (1 funcionalidad)
- **HU-P01:** Cualquier persona escanea un QR y ve la trazabilidad completa del lote

---

## El Flujo de un Lote — Paso a Paso

```
1. Instituto crea lote → "Pendiente envío Ecopunto" 🟡
2. Ecopunto lo recibe → "En Ecopunto" 🔵
3. Ecopunto clasifica con IA → "Clasificado" ⚫
4. Ecopunto publica → "Disponible para retiro" 🟢
5. Gestora(s) cotizan → "Solicitado por Gestora/s" 🟠
6. Admin aprueba → "Retiro Aprobado" 🟣
7. Gestora sube certificado → "Finalizado" ✅
```

Cada paso queda registrado y cualquier persona puede verlo escaneando el código QR del lote.

---

## Decisiones Técnicas Importantes

### ¿Por qué React y no otra cosa?
Elegimos React porque es el framework más usado, tiene mucha documentación y nos permitía construir componentes reutilizables para los 5 portales. Vite nos dio un servidor de desarrollo ultrarrápido.

### ¿Por qué datos de prueba en lugar de base de datos real?
Empezamos con datos de ejemplo (JSON) para poder probar todo sin configurar un servidor. Esto nos permitió avanzar rápido y validar el diseño antes de conectar una base de datos real (Supabase).

### ¿Por qué OpenRouter en lugar de usar Claude directamente?
OpenRouter nos da acceso a múltiples modelos de IA con una sola API key. Si un modelo falla o cambia de precio, podemos cambiar a otro sin tocar el código.

### ¿Por qué no hicimos autenticación real?
Para un MVP académico, el login simulado fue suficiente. En una versión de producción se implementaría con JWT y base de datos real.

---

## Lo que Más Destacamos

1. **🤖 Clasificación con IA** — Subís una foto de residuos y Claude Vision te dice qué categoría es según el Decreto 292/024
2. **🌍 Impacto medible** — El sistema calcula kg de CO₂ evitados y materiales recuperados
3. **🔗 Trazabilidad pública** — Cualquier ciudadano escanea un QR y ve todo el proceso
4. **🏆 Scoring de gestoras** — Sistema de puntos que premia a las empresas más eficientes

---

## Estado Actual

- ✅ **13/13 funcionalidades** implementadas y funcionando
- ✅ **Deployado** en seminario.noah.uy
- ✅ **Presentación:** 26 de mayo de 2026

---

## Dónde Encontrar Cada Cosa en este Repositorio

| Si querés ver... | Mirá en... |
|---|---|
| La app funcionando | `app/` → `npm run dev` |
| Qué hace cada portal | `docs/user-stories/` |
| Cómo se construyó (sprints) | `docs/prompts/` |
| Por qué elegimos cada tecnología | `docs/decisions/` |
| El flujo de estados del lote | `docs/arquitectura/flujo-estados.md` |
| Instrucciones para la IA | `CLAUDE.md` (raíz) |
| Historial de cambios | `CHANGELOG.md` (raíz) |

---

**Equipo:** Carmela González · Verónica Iriarte · Juan Raimondo  
**Materia:** Seminario de Tecnologías · FIng UdelaR · 2026
