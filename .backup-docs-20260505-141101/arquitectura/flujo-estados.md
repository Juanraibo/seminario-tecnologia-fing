# Flujo de Estados de un Lote — EcoFIng

## Diagrama de estados

```
┌─────────────────────────────────────────────────────────────────┐
│                        CICLO DE VIDA DE UN LOTE                 │
└─────────────────────────────────────────────────────────────────┘

  [Instituto registra lote]
           │
           ▼
  ┌─────────────────────────────┐
  │  Pendiente envío Ecopunto   │  Actor: Instituto
  │  Color: Amarillo 🟡         │  Pantalla: A1, A2
  └─────────────────────────────┘
           │  Operario marca como recibido (HU-E01)
           ▼
  ┌─────────────────────────────┐
  │       En Ecopunto           │  Actor: Ecopunto
  │       Color: Azul 🔵        │  Pantalla: B1, B2
  └─────────────────────────────┘
           │  Operario clasifica con IA + pesa (HU-E02)
           ▼
  ┌─────────────────────────────┐
  │  Clasificado (no publicado) │  Actor: Ecopunto
  │  Color: Gris ⚫             │  Pantalla: B3
  └─────────────────────────────┘
           │  Operario publica al catálogo (HU-E03)
           ▼                         ↑
  ┌─────────────────────────────┐    │ Si Admin rechaza todas las
  │   Disponible para retiro    │    │ ofertas (HU-A03)
  │   Color: Verde claro 🟢     │    │
  │   Pantalla: C1 (Gestoras)   │────┘
  └─────────────────────────────┘
           │  Una o más gestoras ofrecen retiro (HU-G02)
           ▼
  ┌─────────────────────────────┐
  │  Solicitado por Gestora/s   │  Actor: Admin aprueba
  │  Color: Naranja 🟠          │  Pantalla: D3
  └─────────────────────────────┘
           │  Admin aprueba una gestora (HU-A03)
           ▼
  ┌─────────────────────────────┐
  │  Retiro Aprobado —          │  Actor: Gestora
  │  Pendiente de Certificado   │  Pantalla: C3
  │  Color: Violeta             │
  └─────────────────────────────┘
           │  Gestora sube certificado (HU-G03)
           ▼
  ┌─────────────────────────────┐
  │        Finalizado ✅        │  Visible para todos
  │        Color: Verde 🟢      │  Pantalla: A3, E1, C3, P01
  └─────────────────────────────┘
```

## Reglas de transición

| Desde | Hacia | Actor | Condición |
|---|---|---|---|
| Pendiente envío | En Ecopunto | Operario Ecopunto | Lote recibido físicamente |
| En Ecopunto | Clasificado | Operario Ecopunto | Foto + categoría + peso ingresados |
| Clasificado | Disponible | Operario Ecopunto | Publicación al catálogo |
| Disponible | Solicitado | Gestora | Una o más gestoras ofrecen retiro |
| Solicitado | Retiro Aprobado | Administrador | Aprueba una gestora |
| Solicitado | Disponible | Administrador | Rechaza todas las ofertas |
| Retiro Aprobado | Finalizado | Gestora | Sube certificado de disposición |

## Constantes (src/constants/estados.js)

```javascript
export const ESTADOS_LOTE = {
  PENDIENTE_ENVIO:      "Pendiente envío Ecopunto",
  EN_ECOPUNTO:          "En Ecopunto",
  CLASIFICADO:          "Clasificado (no publicado)",
  DISPONIBLE:           "Disponible para retiro",
  SOLICITADO:           "Solicitado por Gestora/s",
  RETIRO_APROBADO:      "Retiro Aprobado — Pendiente de Certificado",
  FINALIZADO:           "Finalizado",
};

export const COLORES_ESTADO = {
  [ESTADOS_LOTE.PENDIENTE_ENVIO]: "yellow",
  [ESTADOS_LOTE.EN_ECOPUNTO]:     "blue",
  [ESTADOS_LOTE.CLASIFICADO]:     "gray",
  [ESTADOS_LOTE.DISPONIBLE]:      "green",
  [ESTADOS_LOTE.SOLICITADO]:      "orange",
  [ESTADOS_LOTE.RETIRO_APROBADO]: "purple",
  [ESTADOS_LOTE.FINALIZADO]:      "emerald",
};
```
