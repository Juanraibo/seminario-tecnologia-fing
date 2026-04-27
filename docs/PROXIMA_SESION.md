# Notas para Próxima Sesión — EcoFIng

**Fecha:** Sesión 9  
**Estado actual:** MVP 100% completo (13/13 HUs)

---

## 🎯 Tareas Pendientes

### 1. **Revisión de Flujos Entre Roles (CRÍTICO)**

**Problema identificado:**  
Los roles actúan como items independientes sin un flujo integrado real.

**Acciones a tomar:**
- [ ] Mapear el flujo completo end-to-end de un lote:
  - Instituto crea lote → Ecopunto recibe → Ecopunto clasifica →  
    Ecopunto publica → Gestora solicita → Admin aprueba →  
    Gestora retira → Gestora sube certificado → Finaliza
- [ ] Identificar puntos de desconexión entre roles
- [ ] Validar que cada acción de un rol actualice correctamente el estado para el siguiente
- [ ] Verificar notificaciones/cambios de estado visibles en todos los portales afectados
- [ ] Testing E2E del flujo completo con datos mock

**Preguntas clave:**
- ¿Un instituto puede ver cuando el Ecopunto clasifica su lote?
- ¿El admin ve automáticamente las solicitudes de gestoras?
- ¿Las gestoras ven cuando un lote cambia de estado?
- ¿Los usuarios de cada rol ven solo la información relevante para su etapa?

---

### 2. **Integración con APIs de Medición de CO2**

**Opciones evaluadas:**

#### Opción A: **Climatiq API** (RECOMENDADO)
- **URL:** https://climatiq.io
- **Qué hace:** Calcula emisiones de CO2 para distintas actividades
- **Precio:** Free tier: 100 requests/mes, luego $0.01 por request
- **Ventajas:**
  - API REST simple
  - Factores de emisión certificados por organizaciones internacionales
  - Cobertura para electrónicos y reciclaje
- **Integración:**
  ```javascript
  // Endpoint: POST https://api.climatiq.io/v1/estimate
  {
    "activity_id": "waste_electrical_electronic_equipment-recycled",
    "parameters": {
      "weight": 10.5,
      "weight_unit": "kg"
    }
  }
  // Response: { co2e: 14.7 (kg CO2 equivalente) }
  ```

#### Opción B: **Carbon Interface API**
- **URL:** https://carboninterface.com
- **Qué hace:** Similar a Climatiq, enfoque en carbon footprint
- **Precio:** Free tier: 200 requests/mes
- **Ventajas:**
  - Más requests gratis
  - Documentación muy clara
- **Desventajas:**
  - Menos específico para electrónicos

#### Opción C: **Google Environmental Insights Explorer** (NO viable para MVP)
- **Qué hace:** Datos ambientales a nivel ciudad/región
- **Problema:** No tiene API pública, solo visualizador web

**Implementación recomendada (MVP+):**
1. Crear servicio `app/src/services/carbonAPI.js`
2. Llamar API al finalizar lote (certificado)
3. Guardar valor real de CO2 evitado en el lote
4. Mostrar comparación: factor fijo vs. API real
5. Agregar toggle en Dashboard Admin: "Ver datos reales de API"

**Ejemplo de implementación:**
```javascript
// app/src/services/carbonAPI.js
export async function calcularCO2Real(pesoKg) {
  const response = await fetch('https://api.climatiq.io/v1/estimate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_CLIMATIQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      activity_id: 'waste_electrical_electronic_equipment-recycled',
      parameters: {
        weight: pesoKg,
        weight_unit: 'kg'
      }
    })
  })
  const data = await response.json()
  return data.co2e
}
```

---

### 3. **Ampliaciones Funcionales Sugeridas**

#### A. Sistema de Notificaciones
- [ ] Notificaciones push cuando un lote cambia de estado
- [ ] Badge contador de notificaciones no leídas
- [ ] Panel de notificaciones por rol

#### B. Reportes y Exportación
- [ ] Exportar datos a CSV/Excel
- [ ] Generar reporte PDF de impacto ambiental
- [ ] Gráficos de tendencias mensuales/anuales

#### C. Búsqueda y Filtros Avanzados
- [ ] Búsqueda por ID de lote en todos los portales
- [ ] Filtros por rango de fechas
- [ ] Filtros por peso/categoría combinados

#### D. Gestión de Certificados
- [ ] Upload de PDF del certificado real
- [ ] Galería de certificados en lote finalizado
- [ ] Validación de formato de certificado

---

### 4. **Mejoras de UX Identificadas**

#### Dashboard Instituto
- [ ] Gráfico de evolución de lotes en el tiempo
- [ ] Comparativa con otros institutos (anónimo)

#### Portal Ecopunto
- [ ] Vista de "cola de trabajo" (lotes pendientes de clasificar)
- [ ] Estadísticas de productividad (items/día)

#### Portal Gestora
- [ ] Sistema de "favoritos" para categorías preferidas
- [ ] Alertas de nuevos lotes en categorías de interés

#### Portal Admin
- [ ] Dashboard de alertas (lotes atascados, scoring bajo)
- [ ] Comparativa histórica de gestoras

---

### 5. **Testing y Validación**

#### Tests E2E Pendientes
- [ ] Flujo Instituto → Ecopunto → Gestora → Admin
- [ ] Test de cada rol por separado
- [ ] Test de permisos (usuario X no puede acceder a portal Y)
- [ ] Test de imágenes reales en clasificación IA

#### Tests de Performance
- [ ] Tiempo de carga con 100+ lotes
- [ ] Rendimiento de gráficos Recharts
- [ ] Tamaño de imágenes base64 en memoria

---

### 6. **Documentación Faltante**

- [ ] Manual de usuario por rol (PDF o video)
- [ ] Guía de deployment para producción real
- [ ] Diagrama de flujo de datos actualizado
- [ ] Decisiones de arquitectura (ADRs pendientes)

---

## 📊 Estado Actual del MVP

**HUs Completadas:** 13/13 (100%)

| Portal | HUs | Estado |
|--------|-----|--------|
| Instituto | I01, I02, I03 | ✅ Completo |
| Ecopunto | E01, E02, E03 | ✅ Completo |
| Gestora | G01, G02, G03 | ✅ Completo |
| Admin | A01, A02, A03 | ✅ Completo |
| Público | P01 | ✅ Completo |

**Funcionalidades Clave:**
- ✅ Login simulado con 4 roles
- ✅ Clasificación con IA (Claude 3 Haiku)
- ✅ Imágenes reales guardadas en base64
- ✅ Sistema de scoring de gestoras
- ✅ Aprobación de retiros con comparación de cotizaciones
- ✅ Trazabilidad pública sin login
- ✅ CRUD completo de actores (operarios, gestoras)
- ✅ Dashboard con KPIs ambientales y gráficos (Recharts)

---

## 🚀 Deployment

**Plataforma:** Vercel  
**URL producción:** seminario.noah.uy  
**Auto-deploy:** ✅ Configurado (push a `main`)  
**Estado:** 🟢 Funcionando

---

## 💡 Ideas para Demostración Final

1. **Video demo del flujo completo** (5 minutos)
   - Mostrar cada rol en acción
   - Destacar la integración entre portales
   
2. **Métricas de impacto** 
   - Mostrar cómo el sistema ayuda a FIng a ser más sustentable
   - Proyección de kg de CO2 evitados en 1 año
   
3. **Live demo interactivo**
   - Dejar que jurado pruebe el sistema
   - QR codes impresos para trazabilidad pública

---

**Documentado por:** Claude Sonnet 4.5  
**Última actualización:** 27 de abril de 2026  
**Próxima revisión:** Sesión 9
