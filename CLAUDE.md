# CLAUDE.md — EcoFIng

> Archivo de instrucciones para agentes de IA (OpenCode, Claude Code).  
> Leer **siempre** antes de escribir código, crear archivos o tomar decisiones de arquitectura.

---

## Contexto del proyecto

**EcoFIng** es un MVP web para la gestión de RAEE (Residuos de Aparatos Eléctricos y Electrónicos) en la Facultad de Ingeniería de UdelaR (Uruguay). Es el Trabajo Final del Seminario de Tecnologías 2026.

**Equipo:** Carmela González · Verónica Iriarte · Juan Raimondo  
**Presentación final:** 26 de mayo de 2026  
**Repositorio:** https://github.com/Juanraibo/seminario-tecnologia-fing

---

## Stack tecnológico (NO cambiar sin actualizar este archivo y crear un ADR)

| Capa | Tecnología | Versión |
|---|---|---|
| Framework UI | React | 18 |
| Build tool | Vite | 5 |
| Estilos | TailwindCSS | 3 |
| Routing | React Router | v6 |
| Gráficos | Recharts | latest |
| QR codes | qrcode.react | latest |
| IA (clasificación) | OpenRouter API (modelo: anthropic/claude-sonnet-4-5) | — |
| Estado global | React Context + useReducer | — |
| Datos mock | JSON estáticos en src/data/ | — |

**Sin backend. Sin base de datos real.** Todo el estado vive en React Context inicializado desde JSON locales.

---

## Estructura del proyecto

```
seminario-tecnologia-fing/
├── CLAUDE.md                        ← Este archivo
├── CHANGELOG.md                     ← Bitácora de sesiones (actualizar por sesión)
├── README.md                        ← Descripción pública
├── .env.example                     ← Variables de entorno de ejemplo
├── package.json
├── vite.config.js
├── tailwind.config.js
│
├── datos/                           ← Datasets y archivos de referencia no técnicos
│
├── docs/
│   ├── user-stories/                ← HUs completas por portal
│   │   ├── HU_Autenticacion.md
│   │   ├── HU_Portal_Instituto.md
│   │   ├── HU_Portal_Ecopunto.md
│   │   ├── HU_Portal_Gestora.md
│   │   ├── HU_Portal_Administrador.md
│   │   └── HU_Vista_Publica.md
│   ├── decisions/                   ← Architecture Decision Records (ADRs)
│   │   ├── ADR-001-stack.md
│   │   └── ADR-002-arquitectura-datos.md
│   ├── arquitectura/
│   │   └── flujo-estados.md         ← Estados posibles de un lote
│   └── guia-desarrollo.md           ← Cómo trabajar en este repo
│
├── entregas/                        ← Entregables formales por sesión
│   ├── sesion-01/
│   ├── sesion-02/
│   └── ...
│
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    │
    ├── constants/
    │   └── estados.js               ← Estados de lote como constantes
    │
    ├── data/                        ← JSON mock (fuente de verdad del MVP)
    │   ├── lotes.json
    │   ├── institutos.json
    │   ├── gestoras.json
    │   ├── usuarios.json
    │   └── config.json
    │
    ├── context/
    │   └── AppContext.jsx           ← Estado global + acciones
    │
    ├── services/
    │   └── claudeVision.js          ← Llamada a Anthropic API (HU-E02)
    │
    ├── components/                  ← Componentes compartidos entre portales
    │   ├── Layout.jsx
    │   ├── Navbar.jsx
    │   ├── StatusBadge.jsx
    │   ├── LotTimeline.jsx
    │   ├── QRCode.jsx
    │   └── ConfirmDialog.jsx
    │
    └── portals/
        ├── auth/
        │   └── LoginPage.jsx         ← HU-AUTH01
        ├── instituto/
        │   ├── Dashboard.jsx         ← HU-I01
        │   ├── NuevaSolicitud.jsx    ← HU-I02
        │   └── DetalleLote.jsx       ← HU-I03
        ├── ecopunto/
        │   ├── BandejaEntrante.jsx   ← HU-E01
        │   ├── Clasificacion.jsx     ← HU-E02
        │   └── ListosParaPublicar.jsx← HU-E03
        ├── gestora/
        │   ├── Catalogo.jsx          ← HU-G01
        │   ├── DetalleLote.jsx       ← HU-G02
        │   └── MisRetiros.jsx        ← HU-G03
        ├── admin/
        │   ├── Dashboard.jsx         ← HU-A01
        │   ├── GestionActores.jsx    ← HU-A02
        │   └── AprobacionRetiros.jsx ← HU-A03
        └── publico/
            └── Trazabilidad.jsx      ← HU-P01
```

---

## Flujo de estados de un lote

```
"Pendiente envío Ecopunto"
    → "En Ecopunto"
    → "Clasificado (no publicado)"
    → "Disponible para retiro"
    → "Solicitado por Gestora/s"
    → "Retiro Aprobado — Pendiente de Certificado"
    → "Finalizado"
```

Usar siempre las constantes de `src/constants/estados.js`. Nunca hardcodear strings de estado.

---

## Variables de entorno

```
VITE_OPENROUTER_API_KEY=tu_api_key_aqui
```

- Nunca commitear `.env.local` (está en `.gitignore`)
- El archivo `.env.example` sí se commitea (sin valores reales)
- En el MVP solo se usa para la clasificación de imágenes (HU-E02)
- OpenRouter permite cambiar de modelo sin tocar el código, solo cambiando el string del modelo en `claudeVision.js`

---

## Convenciones de commits

Formato: `tipo(scope): descripción breve`

| Tipo | Cuándo usarlo |
|---|---|
| `feat` | Nueva funcionalidad (referenciar HU) |
| `fix` | Corrección de bug |
| `docs` | Solo documentación |
| `style` | Cambios de estilos sin lógica |
| `refactor` | Refactorización sin cambio de comportamiento |
| `chore` | Config, dependencias, setup |

**Ejemplos correctos:**
```
feat(instituto): implementar dashboard de solicitudes HU-I01
feat(ecopunto): integrar Claude Vision para clasificación HU-E02
docs: agregar ADR-002 sobre arquitectura de datos
fix(gestora): corregir cálculo de scoring al subir certificado
```

---

## Convenciones de código

- Componentes en **PascalCase**, un archivo por componente
- Funciones y variables en **camelCase**
- Comentarios en **español**
- Usar `// TODO(producción):` para marcar lo que en un sistema real sería diferente
- Nunca hardcodear datos en componentes — siempre leer de `src/data/` vía contexto
- Cada portal vive en su propia carpeta dentro de `src/portals/`

---

## Orden de construcción (roadmap)

Ver `docs/guia-desarrollo.md` para el detalle sprint a sprint.

### Resumen de fases:
1. **Setup** — Vite + React + Tailwind + Router + datos mock + contexto
2. **Portal Instituto** — HU-I01, I02, I03
3. **Portal Ecopunto** — HU-E01, E02 (con IA), E03
4. **Portal Gestora** — HU-G01, G02, G03
5. **Portal Admin** — HU-A01, A02, A03
6. **Vista Pública** — HU-P01
7. **Auth + Pulido** — HU-AUTH01 + consistencia visual

---

## Documentación obligatoria por sesión

Al finalizar cada sesión de trabajo, actualizar:
1. `CHANGELOG.md` — qué se hizo, qué decisiones se tomaron
2. `entregas/sesion-XX/` — artefacto o resumen de la sesión
3. Si se tomó una decisión de arquitectura significativa → crear `docs/decisions/ADR-XXX.md`
