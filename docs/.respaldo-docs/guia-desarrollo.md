# Guía de Desarrollo — EcoFIng

Metodología de trabajo para el equipo durante el período de desarrollo (Sesiones 4–7).

---

## Estrategia de branches (Git Flow simplificado)

```
main          → Rama protegida. Solo recibe merges desde develop.
               Siempre representa un estado funcional y demostrable.

develop       → Rama de integración. Todo el trabajo se integra aquí.
               Se mergea a main al final de cada sesión si está estable.

feature/HU-XX → Una rama por historia de usuario.
               Ejemplo: feature/HU-I01-dashboard-instituto
               Se abre desde develop, se cierra con PR a develop.
```

### Flujo de trabajo por HU

```bash
# 1. Siempre partir de develop actualizado
git checkout develop
git pull origin develop

# 2. Crear rama para la HU
git checkout -b feature/HU-I01-dashboard-instituto

# 3. Desarrollar. Commits frecuentes con el formato correcto:
git commit -m "feat(instituto): estructura inicial dashboard HU-I01"
git commit -m "feat(instituto): tabla de lotes con estados y colores HU-I01"
git commit -m "feat(instituto): botón nueva solicitud y navegación HU-I01"

# 4. Push y abrir Pull Request a develop
git push origin feature/HU-I01-dashboard-instituto
# → Abrir PR en GitHub con título: "[HU-I01] Dashboard de solicitudes — Portal Instituto"

# 5. Al final de cada sesión: merge develop → main si está estable
```

---

## Formato de Pull Requests

**Título:** `[HU-XXX] Nombre de la historia — Portal`  
**Ejemplo:** `[HU-E02] Clasificación con IA — Portal Ecopunto`

**Descripción mínima del PR:**
```
## Qué implementa
Descripción de lo que hace esta PR.

## HU relacionada
HU-E02: Recepción y Clasificación con Asistencia IA

## Criterios de aceptación cubiertos
- [x] CA1: Upload de imagen con preview
- [x] CA2: Llamada a Claude Vision y display de sugerencia
- [x] CA3: Aceptar o corregir categoría
- [x] CA4: Ingreso de peso real
- [x] CA7: Manejo de error si la IA no responde

## Cómo probarlo
1. Loguearse como ecopunto@fing.edu.uy / eco123
2. Ir a un lote en estado "En Ecopunto"
3. Subir una foto y presionar "Clasificar con IA"
```

---

## Roadmap de desarrollo (Sesiones 4–7)

### Sesión 4 — 28 de abril: Sprint 1 — Base + Instituto

**Objetivo:** Proyecto corriendo localmente, Portal Instituto funcional.

| Tarea | Responsable sugerido | Branch |
|---|---|---|
| Setup Vite + React + Tailwind | Juan | chore/setup-inicial |
| Crear JSON mock completos | Carmela | chore/datos-mock |
| AppContext + Router base | Verónica | chore/contexto-base |
| HU-AUTH01: Login simulado | Juan | feature/HU-AUTH01 |
| HU-I01: Dashboard Instituto | Carmela | feature/HU-I01 |
| HU-I02: Nueva solicitud | Verónica | feature/HU-I02 |
| HU-I03: Detalle + QR | Juan | feature/HU-I03 |

**Entregable sesión 4:** Portal Instituto navegable con datos mock.

---

### Sesión 5 — 5 de mayo: Sprint 2 — Ecopunto + Gestora

**Objetivo:** Flujo de clasificación y catálogo de gestoras operativos.

| Tarea | Branch |
|---|---|
| HU-E01: Bandeja entrante | feature/HU-E01 |
| HU-E03: Lotes para publicar | feature/HU-E03 |
| HU-G01: Catálogo + scoring | feature/HU-G01 |
| HU-G02: Detalle + solicitud | feature/HU-G02 |
| HU-G03: Mis retiros + cert. | feature/HU-G03 |

**Entregable sesión 5:** Flujo completo Instituto → Ecopunto → Gestora (sin IA aún).

---

### Sesión 6 — 12 de mayo: Integración GenAI + Admin

**Objetivo:** IA funcionando en Ecopunto, Portal Admin con KPIs.

| Tarea | Branch |
|---|---|
| HU-E02: Clasificación con Claude Vision | feature/HU-E02-ia |
| HU-A01: Dashboard global KPIs | feature/HU-A01 |
| HU-A02: Gestión actores | feature/HU-A02 |
| HU-A03: Aprobación retiros | feature/HU-A03 |
| HU-P01: Vista pública QR | feature/HU-P01 |

**Entregable sesión 6:** Sistema completo con IA integrada.

---

### Sesión 7 — 19 de mayo: Pruebas y ajustes

**Objetivo:** Sistema pulido y listo para presentar.

- Revisión de todos los flujos end-to-end
- Consistencia visual entre portales
- README actualizado con instrucciones de ejecución
- Preparación de demo data (lotes en distintos estados para mostrar)
- Ensayo de presentación

---

## Cómo ejecutar el proyecto localmente

```bash
# Clonar el repo
git clone https://github.com/Juanraibo/seminario-tecnologia-fing.git
cd seminario-tecnologia-fing

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local y agregar tu VITE_ANTHROPIC_API_KEY

# Levantar servidor de desarrollo
npm run dev
# → Abre http://localhost:5173
```

### Usuarios de prueba para la demo

| Email | Contraseña | Portal |
|---|---|---|
| admin@fing.edu.uy | admin123 | Administrador |
| inco@fing.edu.uy | inco123 | Instituto (INCO) |
| ecopunto@fing.edu.uy | eco123 | Ecopunto |
| gestora1@reciclauY.com | gest123 | Gestora (ReciclaUY) |

---

## Documentación obligatoria al finalizar cada sesión

1. **`CHANGELOG.md`** — agregar entrada con: qué se hizo, qué decisiones se tomaron, qué queda pendiente
2. **`entregas/sesion-XX/`** — subir el artefacto o resumen pedido por los profesores
3. Si hubo decisión arquitectónica relevante → crear `docs/decisions/ADR-XXX.md`
4. Hacer merge de `develop` a `main` si el estado es estable y demostrable
