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
├── vercel.json        ← Configuración de deployment
│
├── app/               ← TODO el código fuente de la aplicación
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── .env.local     ← Variables de entorno locales (NO en git)
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   ├── atoms/          ← Componentes básicos (Button, Badge, etc.)
│       │   ├── molecules/      ← Componentes compuestos (Card, StatusBadge, etc.)
│       │   ├── organisms/      ← Componentes complejos (DataTable, etc.)
│       │   └── layout/         ← Layouts y estructura (Sidebar, TopBar, etc.)
│       ├── constants/estados.js        ← Estados del lote como constantes
│       ├── context/AppContext.jsx      ← Estado global (carga desde Supabase)
│       ├── config/
│       │   └── supabase.config.js      ← Configuración de Supabase
│       ├── services/
│       │   ├── supabase.js             ← Cliente y helpers de Supabase
│       │   ├── claudeVision.js         ← Clasificación IA (OpenRouter)
│       │   └── carbonAPI.js            ← Cálculo CO2 (Climatiq API)
│       ├── utils/
│       │   └── normalizeData.js        ← Normalización de datos
│       └── portals/
│           ├── auth/LoginPage.jsx      ← HU-AUTH01
│           ├── instituto/              ← HU-I01, I02, I03
│           ├── ecopunto/               ← HU-E01, E02, E03
│           ├── gestora/                ← HU-G01, G02, G03
│           ├── admin/                  ← HU-A01, A02, A03
│           └── publico/                ← HU-P01 (Landing, Trazabilidad, Calculadora)
│
├── docs/              ← Toda la documentación del proyecto
│   ├── user-stories/  ← Una HU por portal
│   ├── decisions/     ← ADRs (Architecture Decision Records)
│   ├── arquitectura/  ← Diagramas y flujos
│   └── prompts/       ← Prompts listos para usar en OpenCode
│
└── entregas/          ← Entregables formales por sesión académica
    └── sesion-XX/
```

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | React 18 + Vite 5 |
| Estilos | TailwindCSS 3 + Atomic Design |
| Routing | React Router v6 |
| Estado global | React Context + useReducer |
| Base de datos | Supabase (PostgreSQL) |
| Backend | Supabase (Auth, Storage, Realtime) |
| Gráficos | Recharts |
| QR codes | qrcode.react |
| Iconos | lucide-react |
| IA - Clasificación | OpenRouter API (Claude 3 Haiku / Gemini Flash) |
| IA - Cálculo CO2 | Climatiq API (con fallback a factores estimados) |
| Deployment | Vercel |

**Arquitectura:** Frontend React + Supabase como BaaS (Backend as a Service). El estado se carga desde Supabase al iniciar la app y se sincroniza con la base de datos.

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

## Variables de entorno

Copiar `.env.example` como `app/.env.local` y configurar:

```bash
# OpenRouter (clasificación IA)
VITE_OPENROUTER_API_KEY=sk-or-v1-...
VITE_OPENROUTER_MODEL=anthropic/claude-3-haiku

# Supabase (base de datos)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# Climatiq (cálculo CO2) - opcional, usa fallback si no está
VITE_CLIMATIQ_API_KEY=tu-key...
```

**IMPORTANTE:** 
- Nunca commitear archivos `.env.local` o `.env.production`
- En Vercel, configurar las variables en: Project Settings → Environment Variables
- Las credenciales de Supabase ya NO están hardcodeadas en el código

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
- **Acceso a datos:** usar hooks del contexto y servicios de Supabase
- **Credenciales:** NUNCA hardcodear API keys — usar variables de entorno

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
