# TODO — EcoFIng

**Última actualización:** 27 de abril de 2026  
**Días hasta presentación:** 29 días

---

## 🔴 CRÍTICO (Esta semana: 28 abril - 5 mayo)

### Testing End-to-End
- [ ] **Test completo del flujo Instituto → Ecopunto → Gestora → Admin**
  - [ ] Instituto crea lote → ¿Aparece en Ecopunto?
  - [ ] Ecopunto clasifica ítem → ¿Se actualiza en Instituto?
  - [ ] Ecopunto publica lote → ¿Aparece en Gestora?
  - [ ] Gestora envía cotización → ¿Aparece en Admin?
  - [ ] Admin aprueba retiro → ¿Se actualiza en Gestora?
  - [ ] ¿Vista Pública muestra timeline completo?

- [ ] **Documentar resultados en `docs/TESTING-E2E.md`**
  - [ ] Crear documento con checklist
  - [ ] Marcar ✅ funciona o ❌ bug encontrado
  - [ ] Listar bugs críticos a fixear

- [ ] **Fix de bugs críticos encontrados**
  - [ ] Bug 1: _________________
  - [ ] Bug 2: _________________
  - [ ] Bug 3: _________________

### Testing de Funcionalidades Críticas
- [ ] **Portal Instituto**
  - [ ] Crear lote funciona
  - [ ] Ver detalle muestra datos correctos
  - [ ] QR genera link correcto

- [ ] **Portal Ecopunto**
  - [ ] Clasificar con IA guarda imagen
  - [ ] Clasificar manual funciona
  - [ ] Publicar lote agrupa por categoría
  - [ ] No se pueden publicar ítems sin clasificar

- [ ] **Portal Gestora**
  - [ ] Filtros funcionan
  - [ ] Enviar cotización se guarda
  - [ ] No se puede cotizar 2 veces
  - [ ] Scoring se muestra correctamente

- [ ] **Portal Admin**
  - [ ] KPIs calculan correctamente
  - [ ] Agregar operario funciona
  - [ ] Toggle habilitación funciona
  - [ ] Aprobar retiro actualiza lote

- [ ] **Vista Pública**
  - [ ] Timeline completo se muestra
  - [ ] Todos los pasos aparecen

---

## 🟡 IMPORTANTE (Semana 2: 5-15 mayo)

### Mejoras de UX
- [ ] **Feedback visual en acciones**
  - [ ] Toast/mensaje al crear lote
  - [ ] Loading spinner al clasificar con IA
  - [ ] Confirmación al enviar cotización
  - [ ] Success toast al aprobar retiro

- [ ] **Estados de carga**
  - [ ] Spinner en clasificación IA
  - [ ] Skeleton en dashboards vacíos
  - [ ] "Cargando..." vs "No hay datos"

- [ ] **Validaciones de formularios**
  - [ ] No enviar formularios vacíos
  - [ ] Mensajes de error claros
  - [ ] Validación de email/números

### Mejoras de Datos Mock
- [ ] Agregar 5-8 lotes de publicación
- [ ] Agregar 20-30 ítems clasificados
- [ ] Solicitudes de múltiples gestoras
- [ ] 2-3 lotes finalizados con certificados
- [ ] Variedad de estados de lotes

### Pulido Visual
- [ ] Verificar colores consistentes
- [ ] Espaciados uniformes
- [ ] Tipografía consistente
- [ ] Iconos mismo tamaño
- [ ] Estilos de botones uniformes

---

## 🟢 DESEABLE (Si hay tiempo: 15-20 mayo)

### Features Bonus (elegir 1-2)
- [ ] **Opción A:** Notificaciones por rol
- [ ] **Opción B:** Búsqueda y filtros avanzados
- [ ] **Opción C:** Exportación de datos (CSV/PDF)
- [ ] **Opción D:** Toggle modo oscuro/claro
- [ ] **Opción E:** Integración Climatiq API (CO2 real)

### Performance (opcional)
- [ ] Lazy loading de imágenes
- [ ] Paginación en listas >20 items
- [ ] Memoización de cálculos
- [ ] Code splitting por ruta

### Accesibilidad (opcional)
- [ ] Atributos ARIA
- [ ] Navegación por teclado
- [ ] Labels para screen readers
- [ ] Contraste WCAG AA

---

## 🎓 PRESENTACIÓN (20-26 mayo)

### Material de Presentación
- [ ] **Documento PRESENTACION.md**
  - [ ] Resumen ejecutivo
  - [ ] Problema que resuelve
  - [ ] Diagrama de arquitectura
  - [ ] Stack con justificación
  - [ ] Funcionalidades clave
  - [ ] KPIs destacados
  - [ ] Capturas de pantalla
  - [ ] Aprendizajes del equipo

- [ ] **Slides (15-20)**
  - [ ] Portada
  - [ ] Contexto y problema
  - [ ] Objetivos
  - [ ] Arquitectura
  - [ ] Demo por portal
  - [ ] KPIs ambientales
  - [ ] Decisiones técnicas
  - [ ] Desafíos
  - [ ] Conclusiones

- [ ] **Video demo (opcional)**
  - [ ] Grabar recorrido
  - [ ] Mostrar flujo completo
  - [ ] Destacar IA
  - [ ] Vista pública

- [ ] **Script de demo**
  - [ ] Preparar escenario
  - [ ] Datos pre-cargados
  - [ ] Practicar 2-3 veces
  - [ ] Plan B sin WiFi

### Testing Pre-Presentación (24-25 mayo)
- [ ] seminario.noah.uy online
- [ ] Probar en móvil
- [ ] Probar otros navegadores
- [ ] Usuarios de prueba funcionan
- [ ] Datos variados y realistas
- [ ] Backup del código

---

## 📅 Cronograma Visual

```
28 abril ════════════════════════════════════════════════════ 26 mayo
│
├─ Semana 1 (28 abril - 5 mayo): 🔴 TESTING E2E + CRÍTICO
│   └─ Entregable: docs/TESTING-E2E.md
│
├─ Semana 2 (5-10 mayo): 🟡 UX + DATOS MOCK
│   └─ Entregable: Sistema pulido
│
├─ Semana 3 (10-15 mayo): 🟡 PULIDO VISUAL
│   └─ Entregable: UI consistente
│
├─ Semana 4 (15-20 mayo): 🟢 BONUS (opcional)
│   └─ Entregable: 1-2 features extra
│
└─ Semana 5 (20-26 mayo): 🎓 PRESENTACIÓN
    └─ Entregable: Slides + Demo practicada
```

---

## ✅ Definición de "Hecho"

Una tarea está completa cuando:
- ✅ Funcionalidad probada manualmente
- ✅ No genera errores en consola
- ✅ Funciona en Chrome + Firefox
- ✅ Responsive (funciona en móvil)
- ✅ Committed y pusheado a GitHub

---

## 🎯 Objetivo de la Semana

**Semana actual (28 abril - 5 mayo):**
> Validar que el sistema funciona end-to-end y documentar cualquier bug crítico

**Tareas mínimas:**
1. Hacer testing E2E completo
2. Documentar en docs/TESTING-E2E.md
3. Fixear 1-2 bugs críticos (si hay)

---

## 📝 Notas Rápidas

- **¿Encontraste un bug?** Agregalo aquí:
  - [ ] _____________________
  - [ ] _____________________

- **Ideas para la presentación:**
  - _____________________
  - _____________________

- **Preguntas para resolver:**
  - _____________________
  - _____________________

---

**Última revisión:** 27 de abril de 2026  
**Próxima revisión:** 5 de mayo de 2026
