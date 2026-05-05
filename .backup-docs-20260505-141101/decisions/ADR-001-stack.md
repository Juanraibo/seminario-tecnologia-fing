# ADR-001: Stack Tecnológico del MVP

**Estado:** Aceptado  
**Fecha:** 21 de abril de 2026  
**Autores:** Carmela González, Verónica Iriarte, Juan Raimondo

---

## Contexto

Necesitamos elegir el stack para construir un MVP funcional de EcoFIng en aproximadamente 4 semanas de desarrollo efectivo (Sesiones 4–7), considerando que el equipo tiene experiencia variada y que la presentación final es el 26 de mayo de 2026.

El sistema requiere:
- Múltiples portales con roles diferenciados (5 perfiles)
- Integración con una API de IA para análisis de imágenes
- Generación de QR codes
- Gráficos de indicadores (KPIs)
- Vista pública mobile-first sin autenticación

---

## Opciones consideradas

### Opción A: React + Vite + TailwindCSS ✅ ELEGIDA
**Pros:**
- Setup inicial en minutos (`npm create vite@latest`)
- Vite ofrece HMR (Hot Module Replacement) ultrarrápido — crítico para iterar rápido
- TailwindCSS permite construir UI consistente sin escribir CSS custom desde cero
- React Router v6 maneja las rutas de los 5 portales limpiamente
- Ecosistema de librerías maduro: Recharts (gráficos), qrcode.react (QR)
- Todo el equipo tiene al menos familiaridad básica con JavaScript/React

**Contras:**
- Sin server-side rendering (no necesario para MVP)
- Requiere manejar la API key de Anthropic con cuidado en el cliente

### Opción B: Next.js + TailwindCSS
**Pros:** SSR, API routes (podría esconder la API key en el servidor)  
**Contras:** Overhead de configuración mayor, curva de aprendizaje para el equipo, innecesario para un MVP sin backend real

### Opción C: HTML + CSS + JavaScript vanilla
**Pros:** Sin dependencias, máxima simplicidad  
**Contras:** Sin componentes reutilizables, el código de 5 portales se volvería inmantenible rápidamente, no demuestra conocimiento de tecnologías modernas

---

## Decisión

**React 18 + Vite 5 + TailwindCSS 3 + React Router v6**

Stack complementario:
- **Recharts** para gráficos del Dashboard Admin (HU-A01)
- **qrcode.react** para generación de QR en frontend (HU-I03, HU-E03)
- **OpenRouter API** (modelo: `anthropic/claude-sonnet-4-5`) para clasificación de imágenes (HU-E02)
- **React Context + useReducer** para estado global (sin Redux — innecesario para esta escala)

### ¿Por qué OpenRouter en lugar de la API de Anthropic directamente?

OpenRouter es un proxy unificado que da acceso a múltiples modelos (Anthropic, OpenAI, Google, etc.) a través de una sola API compatible con el estándar OpenAI. Para el MVP ofrece ventajas prácticas:
- **Una sola API key** que da acceso a distintos modelos sin cambiar el código
- **Flexibilidad de modelo:** si Claude no está disponible o hay restricciones de cuota, se puede cambiar a otro modelo de visión simplemente modificando el string del modelo en `claudeVision.js`
- **Precios competitivos** y créditos de prueba más accesibles para equipos académicos
- El endpoint es compatible con el formato de OpenAI (`/chat/completions`), ampliamente documentado

---

## Consecuencias

- La API key de OpenRouter queda expuesta en el cliente (aceptable para demo/MVP académico; en producción iría por un backend)
- No hay persistencia de datos entre recargas de página (aceptable para MVP)
- El código está diseñado para ser escalable: separación clara de portales, contexto centralizado, datos mock en JSON que podrían reemplazarse por llamadas a API real

---

## Relación con el curso

Esta decisión aplica los conceptos de **Habilitadores Tecnológicos e IA** del Seminario:
- La integración de **GenAI** (Claude Vision) demuestra el uso práctico de IA generativa en un flujo de negocio real
- La arquitectura de **componentes reutilizables** refleja principios de sistemas modulares similares a los módulos de un ERP
