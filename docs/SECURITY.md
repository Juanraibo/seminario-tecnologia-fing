# Guía de Seguridad — EcoFIng

**⚠️ IMPORTANTE:** Este proyecto estará públicamente accesible en `seminario.noah.uy`

---

## 🔒 Riesgos de Seguridad Identificados

### **1. API Key Expuesta en el Frontend (ALTO RIESGO)**

**Problema:**
- La API key de OpenRouter se usa en el código del frontend (client-side)
- Cualquier usuario puede ver la key en el código JavaScript del navegador
- Esto permite que **cualquiera haga requests ilimitados** usando tu cuenta

**Impacto:**
- 💰 **Costo ilimitado:** Alguien malintencionado puede consumir toda tu cuota
- 🚨 **Abuso de servicio:** Requests masivos pueden agotar tu API key
- 📊 **Sin control:** No hay límites de uso por usuario

**Mitigación actual (MVP):**
- ✅ Monitoreo manual de uso en OpenRouter dashboard
- ✅ Límite de presupuesto configurado en OpenRouter
- ⚠️ Confiar en que no habrá abuso masivo

**Solución ideal (post-MVP):**
- ✅ Mover API calls a backend serverless (Vercel Functions)
- ✅ Rate limiting por IP
- ✅ Autenticación real (no login simulado)
- ✅ Presupuesto diario automático

---

### **2. Login Simulado (MEDIO RIESGO)**

**Problema:**
- El login actual es solo visual, no hay autenticación real
- Cualquiera puede acceder a todos los portales
- No hay control de acceso

**Impacto:**
- 🔓 **Acceso público total:** Cualquiera puede usar todo el sistema
- 📝 **Datos mock expuestos:** Todos los datos de ejemplo son públicos
- ⚠️ **Reputación:** Si alguien hace mal uso, afecta la demostración

**Mitigación actual (MVP):**
- ✅ Solo datos mock (no hay datos reales sensibles)
- ✅ Es una demostración académica, no producción
- ⚠️ Advertencia en el sitio de que es un MVP

**Solución ideal (post-MVP):**
- ✅ HTTP Basic Auth en Vercel para proteger todo el sitio
- ✅ Autenticación real con JWT
- ✅ Roles y permisos reales

---

### **3. Rate Limiting Inexistente (ALTO RIESGO)**

**Problema:**
- No hay límites de requests por usuario/IP
- Alguien puede hacer miles de clasificaciones de imágenes
- Cada clasificación cuesta ~$0.0001 → 10,000 requests = $1

**Impacto:**
- 💰 **Costo descontrolado:** $100+ en horas si hay abuso
- 🚨 **DDoS accidental:** Puede sobrecargar la API
- 📊 **Sin visibilidad:** No sabrías hasta ver la factura

**Mitigación actual (MVP):**
- ⚠️ Confiar en uso normal
- ⚠️ Monitoreo manual diario
- ⚠️ Presupuesto máximo en OpenRouter

**Solución ideal (post-MVP):**
- ✅ Rate limiting: 10 clasificaciones/hora por IP
- ✅ Captcha después de 5 clasificaciones
- ✅ Alertas automáticas si uso > $10/día

---

### **4. Secrets en Historial de Git (CRÍTICO - RESUELTO)**

**Problema:**
- ~~API key commiteada en GitHub~~
- ~~Cualquiera puede ver la key en el historial~~

**Solución aplicada:**
- ✅ Key vieja deshabilitada por OpenRouter
- ✅ Nueva key generada
- ✅ Historial de Git limpiado
- ✅ `.gitignore` actualizado
- ✅ Documentación usa solo placeholders

---

## 🛡️ Medidas de Protección Implementadas

### **Nivel 1: Protección Básica (ACTUAL)**

1. **Variables de entorno protegidas:**
   - ✅ `.env.local` y `.env.production` en `.gitignore`
   - ✅ Solo `.env.example` como template público
   - ✅ Secrets solo en Vercel Environment Variables

2. **Documentación segura:**
   - ✅ Placeholders en lugar de keys reales
   - ✅ Advertencias de seguridad en DEPLOYMENT.md
   - ✅ Este documento SECURITY.md

3. **Monitoreo manual:**
   - ✅ Dashboard de OpenRouter revisado diariamente
   - ✅ Límite de presupuesto: $20/mes
   - ✅ Alertas de email activadas

### **Nivel 2: Protección Avanzada (RECOMENDADO)**

4. **Proxy de API (Vercel Functions):**
   ```javascript
   // api/classify.js
   export default async function handler(req, res) {
     // Rate limiting por IP
     const ip = req.headers['x-forwarded-for']
     if (isRateLimited(ip)) {
       return res.status(429).json({ error: 'Too many requests' })
     }
     
     // Llamada a OpenRouter con API key del servidor
     const result = await fetch('https://openrouter.ai/api/v1/chat/completions', {
       headers: {
         'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
       },
       body: req.body
     })
     
     return res.json(result)
   }
   ```

5. **HTTP Basic Auth en Vercel:**
   - Protege todo el sitio con usuario/contraseña
   - Configuración en `vercel.json`:
   ```json
   {
     "routes": [
       {
         "src": "/(.*)",
         "headers": {
           "WWW-Authenticate": "Basic realm=\"EcoFIng MVP\""
         },
         "status": 401,
         "continue": true
       }
     ]
   }
   ```

6. **Rate Limiting por IP:**
   - Usar Vercel Edge Middleware
   - Límite: 100 requests/hora por IP
   - Implementación simple con Map en memoria

---

## 📊 Monitoreo Recomendado

### **Dashboard de OpenRouter**
- URL: https://openrouter.ai/activity
- Revisar: Diariamente (MVP) → Semanal (producción)
- Alertas: Configurar email si costo > $10/día

### **Vercel Analytics**
- Requests por minuto
- Bandwidth usage
- Error rate

### **Logs de errores**
- Vercel logs para errores 5xx
- Sentry.io para errores del cliente (opcional)

---

## 🚨 Plan de Respuesta a Incidentes

### **Si detectás uso anormal:**

1. **Inmediato (< 5 min):**
   - Deshabilitar API key en OpenRouter
   - Pausar deployment en Vercel

2. **Corto plazo (< 1 hora):**
   - Generar nueva API key
   - Actualizar en Vercel
   - Implementar HTTP Basic Auth temporal

3. **Mediano plazo (< 1 día):**
   - Analizar logs para identificar fuente
   - Implementar rate limiting
   - Considerar proxy de API

---

## ✅ Checklist de Seguridad (antes de hacer público)

### **Mínimo para MVP:**
- [x] API key nueva y segura
- [x] Secrets fuera de Git
- [x] `.gitignore` actualizado
- [x] Historial de Git limpio
- [x] Presupuesto en OpenRouter configurado
- [ ] **HTTP Basic Auth en Vercel** (RECOMENDADO)
- [ ] Monitoreo diario configurado
- [ ] Equipo notificado de riesgos

### **Recomendado antes de demostración pública:**
- [ ] Proxy de API (Vercel Functions)
- [ ] Rate limiting básico (10 req/hora)
- [ ] Alertas automáticas de costo
- [ ] Captcha después de 5 clasificaciones

### **Ideal para producción:**
- [ ] Autenticación real
- [ ] Backend completo
- [ ] Base de datos real
- [ ] Auditoría de seguridad profesional

---

## 🔐 Buenas Prácticas para el Equipo

1. **NUNCA commitear secrets:**
   - Usar `.env.local` para desarrollo
   - Usar Vercel Environment Variables para producción
   - Verificar con `git diff` antes de cada commit

2. **Revisar PRs cuidadosamente:**
   - GitHub detecta secrets, pero no siempre
   - Buscar manualmente: `sk-`, `api_key`, contraseñas

3. **Rotar API keys regularmente:**
   - Cada 30 días en desarrollo
   - Cada 7 días si hay incidente

4. **Monitorear costos:**
   - OpenRouter dashboard diariamente
   - Configurar presupuesto máximo: $20/mes

5. **Documentar cambios de seguridad:**
   - Actualizar este documento
   - Notificar al equipo

---

## 📞 Contactos de Emergencia

**Si hay un incidente de seguridad:**

1. **OpenRouter Support:** support@openrouter.ai
2. **Vercel Support:** support@vercel.com
3. **Equipo EcoFIng:** 
   - Juan: juanraibo@gmail.com
   - Carmela: [email]
   - Verónica: [email]

---

## 📚 Recursos

- **OpenRouter Security:** https://openrouter.ai/docs/security
- **Vercel Security:** https://vercel.com/docs/security
- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **GitHub Secret Scanning:** https://docs.github.com/en/code-security/secret-scanning

---

**Documentado por:** Claude Sonnet 4.5  
**Última actualización:** 27 de abril de 2026  
**Próxima revisión:** Antes de cada deployment público
