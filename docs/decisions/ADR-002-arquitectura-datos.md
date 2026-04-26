# ADR-002: Arquitectura de Datos — Sin Backend, JSON + React Context

**Estado:** Aceptado  
**Fecha:** 21 de abril de 2026  
**Autores:** Carmela González, Verónica Iriarte, Juan Raimondo

---

## Contexto

El MVP requiere mostrar datos de lotes, institutos y gestoras de forma consistente entre los 5 portales. El tiempo de desarrollo disponible (4 semanas) hace inviable implementar un backend real con base de datos.

---

## Decisión

**Arquitectura puramente frontend:** los datos viven en archivos JSON en `src/data/` y se cargan en un React Context global al iniciar la aplicación. Las "acciones" del usuario (aprobar retiro, subir certificado, etc.) actualizan el estado en memoria de React, sin persistencia real.

### Estructura de datos (`src/data/`)

```
lotes.json        → Array de lotes con todos sus atributos y estado
institutos.json   → Array de institutos registrados
gestoras.json     → Array de gestoras con scoring y habilitación
usuarios.json     → Usuarios de prueba por rol (para auth simulada)
config.json       → Parámetros configurables (topes kg, factores CO2, etc.)
```

### Patrón de acceso

```
JSON files → AppContext (inicialización) → Componentes (useContext)
                    ↑
             dispatch(acciones)
```

Los componentes **nunca** leen los JSON directamente. Siempre van a través del contexto.

---

## Consecuencias

**Positivas:**
- Setup en minutos, sin configurar servidores ni bases de datos
- Los datos mock permiten demostrar todos los flujos del sistema en la presentación
- Fácil de reemplazar en una versión real: cambiar el contexto para que llame a una API real en lugar de leer JSONs

**Negativas:**
- Los cambios no persisten al recargar la página (esperado y aceptado para MVP)
- La API key de Anthropic queda en el cliente (aceptable solo para demo)

---

## Nota para escalar a producción

En un sistema real, `AppContext` se reemplazaría por llamadas a una API REST o GraphQL. La estructura de los JSONs fue diseñada para mapear directamente a modelos de base de datos relacionales (cada lote tiene foreign keys a instituto y gestora por ID).
