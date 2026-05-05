# 📚 Documentación EcoFIng

> **Índice principal de toda la documentación del proyecto**  
> **Última actualización:** 5 de mayo de 2026

---

## 🎯 Documentos Esenciales (LEER PRIMERO)

### Para Entender el Proyecto Completo

| Documento | Para quién | Qué contiene |
|-----------|------------|--------------|
| **[GUIA-DEL-PROYECTO.md](GUIA-DEL-PROYECTO.md)** ⭐ | TODO el equipo | Explicación simple de TODO el proyecto en 10 min |
| **[TODOS-LOS-PROMPTS.md](TODOS-LOS-PROMPTS.md)** 🎓 | Docentes | TODOS los prompts usados (requisito académico) |
| **[ARQUITECTURA-TECNICA.md](ARQUITECTURA-TECNICA.md)** 🏗️ | Técnico | Arquitectura completa del sistema |
| **[DECISIONES-Y-JUSTIFICACIONES.md](DECISIONES-Y-JUSTIFICACIONES.md)** 🎯 | Técnico | Todas las decisiones arquitectónicas |

---

## 📋 Por Tipo de Documentación

### 1. Documentación de Proyecto

| Archivo | Descripción |
|---------|-------------|
| **../README.md** | Descripción pública, instalación, usuarios de prueba |
| **../CLAUDE.md** | Instrucciones para el agente de IA |
| **../CHANGELOG.md** | Bitácora completa de 10 sesiones de desarrollo |

---

### 2. Historias de Usuario

📂 **Carpeta:** `user-stories/`

| Archivo | HUs Incluidas |
|---------|---------------|
| [HU_Autenticacion.md](user-stories/HU_Autenticacion.md) | HU-AUTH01: Login simulado |
| [HU_Portal_Instituto.md](user-stories/HU_Portal_Instituto.md) | HU-I01, I02, I03 |
| [HU_Portal_Ecopunto.md](user-stories/HU_Portal_Ecopunto.md) | HU-E01, E02, E03 (con IA) |
| [HU_Portal_Gestora.md](user-stories/HU_Portal_Gestora.md) | HU-G01, G02, G03 |
| [HU_Portal_Administrador.md](user-stories/HU_Portal_Administrador.md) | HU-A01, A02, A03 |
| [HU_Vista_Publica.md](user-stories/HU_Vista_Publica.md) | HU-P01: Trazabilidad pública |

**Total:** 13 HUs documentadas

---

### 3. Prompts para IA

📂 **Carpeta:** `prompts/`

| Archivo | Sprint | Qué construye |
|---------|--------|---------------|
| [00-setup-verificacion.md](prompts/00-setup-verificacion.md) | Pre-4 | Verificar setup inicial |
| [01-sprint1-instituto.md](prompts/01-sprint1-instituto.md) | 4 | Portal Instituto (HU-I01, I02, I03) |
| [02-sprint2-ecopunto-gestora.md](prompts/02-sprint2-ecopunto-gestora.md) | 5 | Ecopunto + Gestora (sin IA) |
| [03-sprint3-ia.md](prompts/03-sprint3-ia.md) | 6 | Clasificación con IA (HU-E02) |
| [04-sprint3-admin.md](prompts/04-sprint3-admin.md) | 6 | Portal Admin (HU-A01, A02, A03) |
| [05-sprint3-publica-y-06-pulido.md](prompts/05-sprint3-publica-y-06-pulido.md) | 6-7 | Vista pública + pulido |
| [PROMPTS-IMAGENES-IA.md](prompts/PROMPTS-IMAGENES-IA.md) | - | 45 prompts para generar assets visuales |
| [PROMPTS-PRESENTACION-FINAL.md](prompts/PROMPTS-PRESENTACION-FINAL.md) | 10 | Prompts para presentación del 26 mayo |

**Ver consolidado completo:** [PROMPTS-MASTER.md](PROMPTS-MASTER.md) 🎓

---

### 4. Decisiones Arquitectónicas (ADRs)

📂 **Carpeta:** `decisions/`

| Archivo | Decisión | Fecha |
|---------|----------|-------|
| [ADR-001-stack.md](decisions/ADR-001-stack.md) | Stack tecnológico (React + Vite + Tailwind) | 21 abril 2026 |
| [ADR-002-arquitectura-datos.md](decisions/ADR-002-arquitectura-datos.md) | JSON Mock → Supabase | 21 abril 2026 |

**Ver consolidado completo:** [DECISIONES-TECNICAS.md](DECISIONES-TECNICAS.md) 🎯

---

### 5. Arquitectura y Diseño

| Archivo | Contenido |
|---------|-----------|
| [ARQUITECTURA.md](ARQUITECTURA.md) | Diagrama completo, stack, flujo de datos |
| [arquitectura/flujo-estados.md](arquitectura/flujo-estados.md) | Diagrama de estados de lotes |
| [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) | Esquema completo de Supabase (PostgreSQL) |

---

### 6. Deployment y Configuración

| Archivo | Contenido |
|---------|-----------|
| [DEPLOYMENT.md](DEPLOYMENT.md) | Guía completa Vercel + DNS + SSL |
| [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md) | Configuración específica Vercel |
| [SUPABASE_SETUP.md](SUPABASE_SETUP.md) | Setup de Supabase (DB + Auth + Storage) |

---

### 7. Seguridad

| Archivo | Contenido |
|---------|-----------|
| [SECURITY.md](SECURITY.md) | Auditoría de riesgos y mitigaciones |
| [PREVENCION-API-KEYS.md](PREVENCION-API-KEYS.md) | Prevenir commits de API keys |
| [SECURITY-FIX-API-KEY.md](SECURITY-FIX-API-KEY.md) | Fix de seguridad implementado |

---

### 8. Desarrollo

| Archivo | Contenido |
|---------|-----------|
| [guia-desarrollo.md](guia-desarrollo.md) | Convenciones de código, comandos, flujo de trabajo |
| [MODELOS-IA-DISPONIBLES.md](MODELOS-IA-DISPONIBLES.md) | Modelos de IA disponibles en OpenRouter |
| [hyperframes-integration.md](hyperframes-integration.md) | Integración con Hyperframes |

---

### 9. Roadmap y Planificación

| Archivo | Contenido |
|---------|-----------|
| [ROADMAP.md](ROADMAP.md) | Próximos pasos, cronograma hasta presentación |
| [sesiones/](sesiones/) | Resúmenes de sesiones 4, 5, 6 |

---

## 📂 Estructura de Carpetas

```
docs/
├── README.md                    ← ESTE ARCHIVO (índice principal)
│
├── 📄 DOCUMENTOS PRINCIPALES (4)
│   ├── GUIA-DEL-PROYECTO.md                 ⭐ Para TODO el equipo
│   ├── TODOS-LOS-PROMPTS.md                 🎓 Para docentes
│   ├── ARQUITECTURA-TECNICA.md              🏗️ Arquitectura completa
│   └── DECISIONES-Y-JUSTIFICACIONES.md      🎯 Decisiones justificadas
│
├── 📂 user-stories/            ← 6 archivos (13 HUs)
├── 📂 prompts/                 ← 11 archivos (prompts de IA)
├── 📂 decisions/               ← 2 ADRs + template
├── 📂 arquitectura/            ← Diagramas y flujos
├── 📂 sesiones/                ← Resúmenes de sesiones
├── 📂 ejemplos/                ← Código de ejemplo
│
├── 📂 archivo/                 ← Documentación temporal y técnica archivada
│   ├── BUGFIXES-SESION-*.md
│   ├── TESTING-SESION-*.md
│   ├── SUPABASE_SETUP.md
│   ├── DATABASE_SCHEMA.md
│   ├── hyperframes-integration.md
│   └── ... (27 archivos)
│
├── DEPLOYMENT.md
├── SECURITY.md
├── ROADMAP.md
└── guia-desarrollo.md
```

---

## 🚀 Quick Start — ¿Por Dónde Empezar?

### Si sos nuevo en el equipo
👉 Lee: [GUIA-DEL-PROYECTO.md](GUIA-DEL-PROYECTO.md)  
⏱️ Tiempo: 10 minutos  
✅ Resultado: Entendés TODO el proyecto

---

### Si sos docente evaluando el proyecto
👉 Lee:
1. [TODOS-LOS-PROMPTS.md](TODOS-LOS-PROMPTS.md) — TODOS los prompts usados
2. [DECISIONES-Y-JUSTIFICACIONES.md](DECISIONES-Y-JUSTIFICACIONES.md) — Por qué tomamos cada decisión
3. [ARQUITECTURA-TECNICA.md](ARQUITECTURA-TECNICA.md) — Cómo está construido

⏱️ Tiempo: 30 minutos  
✅ Resultado: Entendés el proceso completo de desarrollo

---

### Si necesitás implementar algo nuevo
👉 Lee:
1. [guia-desarrollo.md](guia-desarrollo.md) — Convenciones y comandos
2. [user-stories/](user-stories/) — Revisar HUs existentes
3. [../CLAUDE.md](../CLAUDE.md) — Instrucciones para IA
4. [prompts/](prompts/) — Ver prompts anteriores como referencia

⏱️ Tiempo: 15 minutos  
✅ Resultado: Sabés cómo agregar features

---

### Si necesitás deployar/configurar
👉 Lee:
1. [DEPLOYMENT.md](DEPLOYMENT.md) — Guía paso a paso
2. [SUPABASE_SETUP.md](SUPABASE_SETUP.md) — Configurar DB
3. [SECURITY.md](SECURITY.md) — Buenas prácticas

⏱️ Tiempo: 20 minutos  
✅ Resultado: Podés deployar el proyecto

---

## 📊 Estadísticas de Documentación

- **Archivos en docs/** 11 archivos principales
- **Archivos archivados:** 27 archivos técnicos/temporales
- **Líneas de documentación:** ~10,000+ líneas
- **Historias de usuario:** 13 HUs (100% documentadas)
- **Prompts documentados:** 17 prompts estructurados + decenas iterativos
- **Sesiones documentadas:** 10 sesiones

---

## 🎯 Documentos por Audiencia

### 👨‍🎓 Para Docentes
1. [TODOS-LOS-PROMPTS.md](TODOS-LOS-PROMPTS.md) ⭐
2. [DECISIONES-Y-JUSTIFICACIONES.md](DECISIONES-Y-JUSTIFICACIONES.md)
3. [ARQUITECTURA-TECNICA.md](ARQUITECTURA-TECNICA.md)
4. [../CHANGELOG.md](../CHANGELOG.md)

---

### 👥 Para el Equipo (Carmela, Verónica)
1. [GUIA-DEL-PROYECTO.md](GUIA-DEL-PROYECTO.md) ⭐
2. [user-stories/](user-stories/)
3. [guia-desarrollo.md](guia-desarrollo.md)

---

### 👨‍💻 Para Desarrolladores Nuevos
1. [GUIA-DEL-PROYECTO.md](GUIA-DEL-PROYECTO.md)
2. [guia-desarrollo.md](guia-desarrollo.md)
3. [ARQUITECTURA-TECNICA.md](ARQUITECTURA-TECNICA.md)

---

### 🔧 Para DevOps/Deployment
1. [DEPLOYMENT.md](DEPLOYMENT.md)
2. [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
3. [SECURITY.md](SECURITY.md)

---

## 🗂️ Archivado

La carpeta `archivo/` contiene documentación temporal de sesiones específicas:
- Bugfixes de sesiones 9-10
- Reportes de testing
- Resúmenes de sesiones
- Diseños experimentales

**Propósito:** Mantener historial sin saturar el índice principal.

---

## ✅ Checklist de Documentación

### Documentación Esencial (COMPLETA)
- ✅ README.md (raíz) — Descripción pública
- ✅ CLAUDE.md (raíz) — Instrucciones para IA
- ✅ CHANGELOG.md (raíz) — Bitácora de sesiones
- ✅ GUIA-DEL-PROYECTO.md — Guía completa del proyecto
- ✅ TODOS-LOS-PROMPTS.md — Todos los prompts usados
- ✅ ARQUITECTURA-TECNICA.md — Arquitectura técnica
- ✅ DECISIONES-Y-JUSTIFICACIONES.md — Decisiones justificadas

### User Stories (COMPLETA)
- ✅ 13/13 HUs documentadas
- ✅ Criterios de aceptación definidos
- ✅ Archivos organizados por portal

### Arquitectura (COMPLETA)
- ✅ Diagrama de arquitectura
- ✅ Flujo de estados
- ✅ Modelo de datos (ER)
- ✅ ADRs de decisiones principales

### Deployment (COMPLETA)
- ✅ Guía de Vercel
- ✅ Configuración DNS
- ✅ Setup de Supabase
- ✅ Variables de entorno

### Seguridad (COMPLETA)
- ✅ Auditoría de riesgos
- ✅ Prevención de API keys
- ✅ RLS policies documentadas

---

## 📞 Contacto

**Equipo:**
- Carmela González
- Verónica Iriarte
- Juan Raimondo (juanraibo@gmail.com)

**Presentación Final:** 26 de mayo de 2026

---

## 🔄 Última Actualización

**Fecha:** 5 de mayo de 2026  
**Por:** Juan Raimondo  
**Cambios:**
- ✅ Creados 4 documentos maestros
- ✅ Archivados 19 documentos temporales
- ✅ Reorganizada estructura de docs/
- ✅ Creado este README como índice principal

**Próxima revisión:** Post-presentación (26 mayo)

---

**Navega la documentación con confianza. TODO está aquí. 📚✨**
