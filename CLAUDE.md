# CLAUDE.md — EcoFIng

> Instrucciones para el agente IA (OpenCode).  
> Leer **siempre antes** de escribir código, crear archivos o tomar decisiones.

---

## ¿Qué es este proyecto?

**EcoFIng** es un MVP web para gestión de RAEE (Residuos de Aparatos Eléctricos y Electrónicos) en la Facultad de Ingeniería de UdelaR, Uruguay. Trabajo Final del Seminario de Tecnologías 2026.

**Equipo:** Carmela González · Verónica Iriarte · Juan Raimondo  
**Presentación:** 26 de mayo de 2026

---

## Estructura del repositorio

```
seminario-tecnologia-fing/
│
├── CLAUDE.md          ← Este archivo (instrucciones para el agente)
├── CHANGELOG.md       ← Bitácora de sesiones — actualizar siempre
├── README.md          ← Descripción pública del proyecto
├── .env.example       ← Variables de entorno de referencia
├── .gitignore
│
├── app/               ← TODO el código fuente de la aplicación
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── constants/estados.js        ← Estados del lote como constantes
│       ├── context/AppContext.jsx      ← Estado global de la app
│       ├── data/                       ← JSON mock (fuente de verdad del MVP)
│       │   ├── lotes.json
│       │   ├── institutos.json
│       │   ├── gestoras.json
│       │   ├── usuarios.json
│       │   └── config.json
│       ├── services/
│       │   └── claudeVision.js         ← Llamada a OpenRouter API (HU-E02)
│       └── portals/
│           ├── auth/LoginPage.jsx      ← HU-AUTH01
│           ├── instituto/              ← HU-I01, I02, I03
│           ├── ecopunto/               ← HU-E01, E02, E03
│           ├── gestora/                ← HU-G01, G02, G03
│           ├── admin/                  ← HU-A01, A02, A03
│           └── publico/                ← HU-P01 (sin login)
│
├── docs/              ← Toda la documentación del proyecto
│   ├── user-stories/  ← Una HU por portal
│   ├── decisions/     ← ADRs (Architecture Decision Records)
│   ├── arquitectura/  ← Diagramas y flujos
│   ├── prompts/       ← Prompts listos para usar en OpenCode
│   └── guia-desarrollo.md
│
└── entregas/          ← Entregables formales por sesión académica
    └── sesion-XX/
```

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | React 18 + Vite 5 |
| Estilos | TailwindCSS 3 |
| Routing | React Router v6 |
| Estado global | React Context + useReducer |
| Gráficos | Recharts |
| QR codes | qrcode.react |
| IA (solo HU-E02) | OpenRouter API — modelo `anthropic/claude-sonnet-4-5` |
| Datos | JSON estáticos en `app/src/data/` |

**Sin backend. Sin base de datos real.** El estado vive en React Context inicializado desde los JSON.

---

## Comandos para trabajar

```bash
# Instalar dependencias (solo la primera vez)
cd app && npm install

# Levantar servidor de desarrollo
cd app && npm run dev
# → http://localhost:5173

# Build de producción
cd app && npm run build
```

---

## Variable de entorno

Solo necesaria para HU-E02 (clasificación con IA). Crear `app/.env.local`:
```
VITE_OPENROUTER_API_KEY=sk-or-...tu-key...
```

---

## Flujo de estados de un lote

```
Pendiente envío Ecopunto → En Ecopunto → Clasificado (no publicado)
→ Disponible para retiro → Solicitado por Gestora/s
→ Retiro Aprobado — Pendiente de Certificado → Finalizado
```

Siempre usar las constantes de `app/src/constants/estados.js`. Nunca hardcodear strings de estado.

---

## Convenciones de código

- **Componentes:** PascalCase, un archivo por componente
- **Funciones/variables:** camelCase
- **Comentarios:** en español
- **TODOs de producción:** `// TODO(producción): explicación`
- **Datos:** nunca hardcodear en componentes — siempre leer del contexto (`useApp()`)
- **Imports de datos:** solo desde `AppContext`, nunca importar JSON directamente en componentes

---

## Convenciones de commits

```
feat(portal):  nueva funcionalidad — referenciar HU
fix(portal):   corrección de bug
docs:          solo documentación
style:         cambios visuales sin lógica
refactor:      limpieza de código
chore:         dependencias, configuración

Ejemplos:
feat(instituto): dashboard de solicitudes HU-I01
feat(ecopunto): integración OpenRouter para clasificación HU-E02
docs: agregar prompts de sprint 2
fix(gestora): calcular scoring correctamente HU-G03
```

---

## Regla de oro

Antes de crear cualquier archivo, preguntar:
- ¿Es código? → Va en `app/src/`
- ¿Es documentación? → Va en `docs/`
- ¿Es un entregable académico? → Va en `entregas/sesion-XX/`
- ¿Es un prompt para OpenCode? → Va en `docs/prompts/`
