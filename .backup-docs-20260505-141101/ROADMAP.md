# Roadmap EcoFIng — Próximos Pasos

**Fecha:** 27 de abril de 2026  
**Estado:** MVP 100% completo (13/13 HUs)  
**Presentación:** 26 de mayo de 2026 (29 días restantes)

---

## 🎯 Resumen Ejecutivo

**Lo que tenemos:**
- ✅ MVP funcional 100%
- ✅ Deployment automático
- ✅ Documentación completa
- ✅ Todos los portales implementados

**Lo que necesitamos:**
- 🔴 **CRÍTICO:** Validar flujo end-to-end entre roles
- 🟡 **IMPORTANTE:** Testing de funcionalidades críticas
- 🟢 **DESEABLE:** Mejoras de UX y pulido visual

---

## 📋 Prioridades por Urgencia

### 🔴 CRÍTICO (Hacer ANTES del 5 de mayo)

#### 1. **Validación de Flujos Entre Roles** 
**Tiempo estimado:** 4-6 horas  
**Por qué es crítico:** Sin esto, el sistema son 4 apps independientes, no un sistema integrado.

**Tareas:**
- [ ] **Test E2E del flujo completo:**
  1. Instituto crea lote → ¿Aparece en Ecopunto?
  2. Ecopunto clasifica → ¿Se actualiza estado en Instituto?
  3. Ecopunto publica → ¿Aparece en catálogo Gestora?
  4. Gestora cotiza → ¿Aparece en Admin para aprobar?
  5. Admin aprueba → ¿Se notifica/actualiza en Gestora?
  6. Gestora finaliza → ¿Se ve certificado en Vista Pública?

- [ ] **Identificar y documentar desconexiones:**
  - Crear checklist de validación en `docs/TESTING-E2E.md`
  - Documentar qué funciona y qué no
  - Priorizar fixes si hay bugs

- [ ] **Fix de integraciones críticas:**
  - Asegurar que cambios de estado se reflejen en todos los portales
  - Validar que las notificaciones/badges actualicen correctamente

**Entregable:** Documento `docs/TESTING-E2E.md` con resultados de pruebas

---

#### 2. **Testing de Funcionalidades Críticas**
**Tiempo estimado:** 3-4 horas

**Escenarios a probar:**

**Portal Instituto:**
- [ ] Crear lote nuevo → verificar que aparece en lista
- [ ] Ver detalle de lote → verificar datos correctos
- [ ] Generar QR → verificar que funciona el link

**Portal Ecopunto:**
- [ ] Clasificar ítem con IA → verificar que guarda imagen
- [ ] Clasificar sin IA (manual) → verificar que funciona
- [ ] Publicar lote → verificar que agrupa correctamente por categoría
- [ ] Verificar que NO se pueden publicar ítems sin clasificar

**Portal Gestora:**
- [ ] Ver catálogo → verificar filtros funcionan
- [ ] Enviar cotización → verificar que se guarda
- [ ] No poder cotizar 2 veces el mismo lote
- [ ] Ver scoring actualizado

**Portal Admin:**
- [ ] Ver KPIs → verificar cálculos correctos
- [ ] Agregar operario → verificar que aparece en lista
- [ ] Habilitar/deshabilitar gestora → verificar toggle
- [ ] Aprobar retiro → verificar que actualiza estado del lote

**Vista Pública:**
- [ ] Acceder con QR → verificar timeline completo
- [ ] Verificar que muestra todos los pasos del lote

**Entregable:** Checklist de testing con ✅/❌ por funcionalidad

---

### 🟡 IMPORTANTE (Hacer del 5 al 15 de mayo)

#### 3. **Mejoras de UX y Feedback Visual**
**Tiempo estimado:** 4-6 horas

**Problemas actuales de UX:**
- [ ] **Falta feedback al usuario:**
  - Al crear lote → mostrar mensaje de éxito
  - Al clasificar ítem → mostrar progreso de clasificación
  - Al enviar cotización → mostrar confirmación
  - Al aprobar retiro → mostrar toast de éxito

- [ ] **Estados de carga:**
  - Agregar spinners cuando se clasifica con IA
  - Mostrar "Cargando..." en listas vacías vs. "No hay datos"
  - Skeleton loaders en dashboards

- [ ] **Validaciones de formularios:**
  - No poder enviar formularios vacíos
  - Mensajes de error claros (no solo alerts)
  - Validación de email, números, etc.

**Implementación sugerida:**
```javascript
// Crear componente Toast reutilizable
// app/src/components/molecules/Toast.jsx
export function Toast({ message, type, onClose }) {
  return (
    <div className={`toast toast-${type}`}>
      {message}
      <button onClick={onClose}>×</button>
    </div>
  )
}

// Usar en acciones:
dispatch({ type: 'SHOW_TOAST', payload: { message: '✅ Lote creado', type: 'success' } })
```

---

#### 4. **Mejoras de Datos Mock**
**Tiempo estimado:** 2-3 horas

**Problemas actuales:**
- [ ] Pocos lotes de ejemplo (solo 3 publicados)
- [ ] Pocos ítems clasificados
- [ ] Solo 1 gestora con solicitudes

**Tareas:**
- [ ] Agregar 5-8 lotes de publicación más (variedad de categorías)
- [ ] Agregar 20-30 ítems clasificados
- [ ] Agregar solicitudes de múltiples gestoras (para ver competencia)
- [ ] Agregar 2-3 lotes finalizados con certificados
- [ ] Variar estados de lotes (tener ejemplos de cada estado)

**Beneficio:** Demo más rica, se ven mejor las funcionalidades

---

#### 5. **Pulido Visual y Consistencia**
**Tiempo estimado:** 3-4 horas

**Inconsistencias a corregir:**
- [ ] **Colores:** Verificar que primary/secondary sean consistentes
- [ ] **Espaciados:** Algunos componentes tienen padding/margin irregulares
- [ ] **Tipografía:** Tamaños de fuente consistentes (h1, h2, p)
- [ ] **Iconos:** Verificar que todos tengan el mismo tamaño en contextos similares
- [ ] **Buttons:** Estilos consistentes (primary, secondary, ghost)

**Checklist visual:**
- [ ] Todos los dashboards tienen el mismo layout base
- [ ] Todos los formularios tienen el mismo estilo
- [ ] Todas las tablas tienen el mismo diseño
- [ ] Todos los cards tienen bordes/sombras similares

---

### 🟢 DESEABLE (Si hay tiempo, 15-25 de mayo)

#### 6. **Funcionalidades Bonus**
**Tiempo estimado:** Variable

**Opciones (elegir 1-2):**

**Opción A: Notificaciones en tiempo real**
- Badge con número de notificaciones pendientes
- Lista de notificaciones por rol:
  - Instituto: "Tu lote LOT-123 fue clasificado"
  - Ecopunto: "Nuevo lote recibido de INCO"
  - Gestora: "Tu solicitud fue aprobada"
  - Admin: "Nueva solicitud de retiro pendiente"

**Opción B: Búsqueda y filtros avanzados**
- Búsqueda por ID de lote en todos los portales
- Filtros por fecha, rango de peso, etc.
- Ordenamiento de tablas (por fecha, peso, estado)

**Opción C: Exportación de datos**
- Admin puede exportar KPIs a CSV/PDF
- Instituto puede descargar historial de lotes
- Gestora puede exportar reporte de scoring

**Opción D: Modo oscuro/claro toggle**
- Ya está implementado dark mode
- Agregar botón para switchear en runtime
- Guardar preferencia en localStorage

**Opción E: Integración con Climatiq API**
- Cálculo real de CO2 (vs. factor fijo)
- Mostrar comparación en Dashboard Admin
- Agregar toggle "Ver datos reales" vs. "Estimados"

---

#### 7. **Mejoras de Performance**
**Tiempo estimado:** 2-3 horas

**Optimizaciones opcionales:**
- [ ] Lazy loading de imágenes de ítems
- [ ] Paginación en listas grandes (>20 items)
- [ ] Memoización de cálculos pesados (KPIs, gráficos)
- [ ] Code splitting por ruta (React.lazy)

---

#### 8. **Accesibilidad (A11y)**
**Tiempo estimado:** 3-4 horas

**Mejoras de accesibilidad:**
- [ ] Atributos ARIA en componentes interactivos
- [ ] Navegación por teclado (Tab, Enter, Escape)
- [ ] Labels en formularios (para screen readers)
- [ ] Contraste de colores (WCAG AA)
- [ ] Textos alternativos en imágenes

---

## 🎓 Preparación de la Presentación (20-25 de mayo)

### 9. **Material de Presentación**
**Tiempo estimado:** 6-8 horas

**Entregables:**

**A. Documento de presentación (`docs/PRESENTACION.md`):**
- [ ] Resumen ejecutivo (1 página)
- [ ] Problema que resuelve el sistema
- [ ] Arquitectura del sistema (diagrama)
- [ ] Stack tecnológico con justificación
- [ ] Funcionalidades clave (1 párrafo cada portal)
- [ ] KPIs ambientales destacados
- [ ] Capturas de pantalla de cada portal
- [ ] Aprendizajes técnicos del equipo

**B. Slides de presentación (15-20 slides):**
- [ ] Portada (título, equipo, fecha)
- [ ] Contexto y problema (RAEE en FIng)
- [ ] Objetivos del sistema
- [ ] Arquitectura y stack
- [ ] Demo de funcionalidades (1 slide por portal)
- [ ] KPIs de impacto ambiental
- [ ] Decisiones técnicas destacadas
- [ ] Desafíos y soluciones
- [ ] Conclusiones y trabajo futuro
- [ ] Demo en vivo (preparar)

**C. Video de demo (opcional, 3-5 min):**
- [ ] Grabar recorrido por cada portal
- [ ] Mostrar flujo completo: Instituto → Ecopunto → Gestora → Admin
- [ ] Destacar clasificación con IA
- [ ] Mostrar vista pública (QR)

**D. Script de demo en vivo:**
- [ ] Preparar escenario de demostración
- [ ] Tener datos pre-cargados
- [ ] Practicar el flujo 2-3 veces
- [ ] Backup plan si falla WiFi/deployment

---

### 10. **Testing Pre-Presentación**
**Tiempo estimado:** 2-3 horas

**Checklist final (1-2 días antes):**
- [ ] Verificar que seminario.noah.uy está online
- [ ] Probar desde móvil (responsive)
- [ ] Probar desde otro navegador (Chrome, Firefox, Safari)
- [ ] Verificar que todos los usuarios de prueba funcionan
- [ ] Tener datos de ejemplo variados y realistas
- [ ] Backup del código (por si algo se rompe)

---

## 📊 Cronograma Sugerido

| Fecha | Tareas | Prioridad |
|-------|--------|-----------|
| **28 abril - 5 mayo** | Testing E2E + Validación de flujos | 🔴 CRÍTICO |
| **5-10 mayo** | Mejoras UX + Feedback visual | 🟡 IMPORTANTE |
| **10-15 mayo** | Datos mock + Pulido visual | 🟡 IMPORTANTE |
| **15-20 mayo** | 1-2 features bonus (opcional) | 🟢 DESEABLE |
| **20-25 mayo** | Material presentación + Slides | 🎓 PRESENTACIÓN |
| **25-26 mayo** | Testing final + Ensayo demo | 🎓 PRESENTACIÓN |
| **26 mayo** | 🎯 **PRESENTACIÓN FINAL** | |

---

## 🚨 Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Flujos entre roles no integrados** | Alta | Alto | Dedicar 1 sesión completa a testing E2E |
| **Deployment cae antes de presentación** | Media | Alto | Tener backup local + video grabado |
| **Bugs en demo en vivo** | Media | Medio | Practicar script 3+ veces, tener plan B |
| **Falta tiempo para todo** | Alta | Medio | Priorizar solo 🔴 CRÍTICO + 🟡 IMPORTANTE |
| **Datos mock poco realistas** | Baja | Bajo | Agregar variedad de lotes/items |

---

## ✅ Definición de "Listo para Presentar"

El proyecto está listo cuando:
- [x] 13/13 HUs implementadas ✅
- [ ] Flujo E2E validado (Instituto → Admin)
- [ ] Testing de funcionalidades críticas pasado
- [ ] Feedback visual en acciones clave
- [ ] Datos mock variados y realistas
- [ ] Material de presentación completo
- [ ] Demo ensayada 2+ veces
- [ ] Deployment estable en seminario.noah.uy

**Estado actual:** 1/8 completo (12.5%)

---

## 💡 Recomendaciones Finales

### Para maximizar impacto en la presentación:

1. **Enfocarse en la narrativa:**
   - No mostrar código, mostrar el sistema funcionando
   - Contar una historia: "Un instituto tiene RAEE → Sistema lo gestiona → Impacto ambiental"

2. **Destacar lo diferencial:**
   - ✨ Clasificación con IA (Claude 3.5 Haiku)
   - 🌍 KPIs de impacto ambiental reales
   - 🔗 Trazabilidad pública sin login
   - 🏭 4 roles integrados en un flujo

3. **Preparar para preguntas:**
   - ¿Por qué React y no Next.js?
   - ¿Por qué mock data y no base de datos?
   - ¿Cómo escalaría a producción?
   - ¿Qué aprendieron del proyecto?

4. **Tener métricas listas:**
   - "Sistema gestiona X kg de RAEE"
   - "Evita Y kg de CO2"
   - "Recupera Z kg de cobre/aluminio"
   - "13 funcionalidades en N semanas"

---

## 📈 Próximos Pasos Inmediatos

**Esta semana (28 abril - 3 mayo):**
1. ✅ Leer este roadmap
2. ⬜ Hacer testing E2E del flujo completo
3. ⬜ Documentar resultados en `docs/TESTING-E2E.md`
4. ⬜ Priorizar fixes críticos (si hay)

**Próxima semana (5-10 mayo):**
1. ⬜ Agregar feedback visual (toasts, spinners)
2. ⬜ Mejorar datos mock (más variedad)
3. ⬜ Pulido visual básico

**Semana de presentación (20-26 mayo):**
1. ⬜ Crear slides
2. ⬜ Ensayar demo
3. ⬜ Testing final
4. ⬜ 🎯 Presentar

---

**Creado por:** Claude Sonnet 4.5  
**Fecha:** 27 de abril de 2026  
**Próxima revisión:** 5 de mayo de 2026
