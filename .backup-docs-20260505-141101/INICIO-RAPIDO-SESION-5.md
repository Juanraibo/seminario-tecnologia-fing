# Guía de Inicio Rápido — Sesión 5

> Checklist para comenzar el desarrollo del Sprint 1 (Portal Instituto).  
> Lee esto ANTES de abrir el editor de código.

---

## 📋 Pre-vuelo: Checklist de verificación

### 1. Entorno de desarrollo

```bash
# ¿Tenés Node.js instalado?
node --version  # Debería mostrar v18 o superior

# ¿Tenés npm instalado?
npm --version   # Debería mostrar v9 o superior
```

Si no tenés Node.js: [Descargar aquí](https://nodejs.org/)

---

### 2. Dependencias del proyecto

```bash
# Navegá a la carpeta app
cd app

# Instalá dependencias (si no lo hiciste antes)
npm install

# Verificá que no haya errores
# Deberías ver: "added XXX packages, and audited YYY packages"
```

---

### 3. Servidor de desarrollo

```bash
# Levantá el servidor (desde app/)
npm run dev

# Deberías ver:
# ➜  Local:   http://localhost:5173/
# ➜  press h + enter to show help
```

**Abrí el navegador en http://localhost:5173/**

¿Ves la app corriendo? ✅ Perfecto, seguí al paso 4.  
¿Error? ⚠️ Ver sección de troubleshooting abajo.

---

### 4. Estado del repositorio

```bash
# Volvé a la raíz del proyecto
cd ..

# Verificá el estado de Git
git status

# Deberías ver archivos modificados de la sesión 4
# Si ves conflictos o cosas raras, NO HAGAS GIT RESET
# Consultá antes de perder trabajo
```

---

## 🎯 Objetivo de esta sesión

**Implementar Portal Instituto completo (HU-I01, I02, I03)**

### User Stories a cubrir

| HU | Nombre | Componentes a crear |
|----|--------|---------------------|
| HU-I01 | Dashboard de solicitudes | `Dashboard.jsx` (reemplazar) |
| HU-I02 | Nueva solicitud de retiro | `NuevaSolicitud.jsx` (crear) |
| HU-I03 | Detalle del lote con QR | `DetalleLote.jsx` (crear) |

**Componente compartido previo:**
- `components/StatusBadge.jsx` — Badge de estado con colores

---

## 📝 Prompts a ejecutar (en orden)

### Prompt 00: Verificación del setup ⚙️

**Archivo:** [`docs/prompts/00-setup-verificacion.md`](./prompts/00-setup-verificacion.md)

**Cuándo:** ANTES de empezar a desarrollar.

**Qué hace:** Verifica que todos los archivos base existen y son válidos.

**Resultado esperado:** Lista de archivos verificados + confirmación de que el proyecto está listo.

---

### Prompt 01: Sprint 1 — Portal Instituto 🚀

**Archivo:** [`docs/prompts/01-sprint1-instituto.md`](./prompts/01-sprint1-instituto.md)

**Cuándo:** Después de que Prompt 00 dio OK.

**Qué hace:** Construye los 4 componentes del Portal Instituto.

**Tiempo estimado:** 1-2 horas de generación + 1 hora de testing.

---

## ✅ Checklist de testing manual

Después de ejecutar el Prompt 01, verificá manualmente:

### Login
- [ ] Abrir http://localhost:5173
- [ ] Loguearse con `inco@fing.edu.uy` / `inco123`
- [ ] Debería redirigir a `/instituto` (Dashboard)

### Dashboard (HU-I01)
- [ ] Se ve la tabla de lotes del INCO
- [ ] Hay al menos 3 lotes (LOT-2026-001, 003, 006)
- [ ] Las columnas son: Fecha · ID · Tamaño · Estado
- [ ] El estado se muestra como badge con color correcto
- [ ] Cada fila es clickeable
- [ ] Hay botón "Nueva solicitud de retiro"

### Nueva Solicitud (HU-I02)
- [ ] Click en "Nueva solicitud de retiro" → navega a `/instituto/nueva`
- [ ] Hay selector de tamaño (Chico / Mediano / Grande)
- [ ] Hay input de foto (acepta imágenes)
- [ ] Hay textarea de observaciones
- [ ] Si envío sin foto → muestra error inline (NO alert del browser)
- [ ] Si envío con datos completos → genera ID formato `LOT-2026-XXX`
- [ ] Muestra mensaje de éxito con el ID
- [ ] Después de 2 segundos → redirige al dashboard
- [ ] El nuevo lote aparece en la tabla

### Detalle del Lote (HU-I03)
- [ ] Click en cualquier fila del dashboard → navega a `/instituto/lote/:id`
- [ ] Se ven los datos del lote (ID, tamaño, peso, categoría, etc.)
- [ ] Hay línea de tiempo vertical con hitos
- [ ] Los hitos con fecha muestran la fecha
- [ ] Los hitos sin fecha muestran "Pendiente"
- [ ] Hay código QR visible
- [ ] El QR apunta a `http://localhost:5173/trazabilidad?lote=<ID>`
- [ ] Hay botón "Descargar QR"
- [ ] Click en "Descargar QR" → descarga imagen PNG
- [ ] Si el lote está "Finalizado" → muestra número de certificado

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'react'"
```bash
cd app
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 5173 is already in use"
```bash
# Matá el proceso que está usando el puerto
# Windows:
netstat -ano | findstr :5173
taskkill /PID <número> /F

# O cambiá el puerto en vite.config.js
```

### Error: "Cannot read property 'lotes' of null"
Significa que el contexto no se está inicializando correctamente.
Verificá que `App.jsx` tiene el `<AppProvider>` envolviendo las rutas.

### La navegación no funciona
Verificá que estás usando `<Link>` de `react-router-dom` y NO `<a href>`.

---

## 📊 Al terminar la sesión

1. ✅ Ejecutar checklist de testing completo (arriba)
2. ✅ Tomar screenshots de cada pantalla funcionando
3. ✅ Crear `docs/sesiones/sesion-05.md` con el detalle
4. ✅ Actualizar `CHANGELOG.md` con resumen ejecutivo
5. ✅ Hacer commit:
   ```bash
   git add .
   git commit -m "feat(instituto): portal completo HU-I01, I02, I03"
   git push origin main
   ```
6. ✅ (Opcional) Exportar screenshots a `entregas/sesion-04/avance-sprint1.pdf`

---

## 🚨 Reglas de oro

1. **Lee el prompt completo ANTES de que el agente escriba código**
2. **Revisá cada componente generado ANTES de aceptar cambios**
3. **Probá en el navegador DESPUÉS de cada componente**
4. **Si algo no funciona, NO sigas adelante** — arreglalo primero
5. **Documentá todo** — futuro-vos te lo va a agradecer

---

## 📚 Documentos de referencia

- [`CLAUDE.md`](../CLAUDE.md) — Instrucciones generales del proyecto
- [`docs/user-stories/HU_Portal_Instituto.md`](./user-stories/HU_Portal_Instituto.md) — Criterios de aceptación detallados
- [`docs/SISTEMA-DOCUMENTACION.md`](./SISTEMA-DOCUMENTACION.md) — Cómo documentar cambios
- [`app/src/constants/estados.js`](../app/src/constants/estados.js) — Constantes de estados

---

## 🎉 Resultado esperado al final

**Portal Instituto 100% funcional:**
- ✅ Login simulado funciona
- ✅ Dashboard muestra lotes del instituto logueado
- ✅ Se puede crear nuevo lote con foto
- ✅ Se puede ver detalle de cualquier lote
- ✅ QR code se genera y es scaneable
- ✅ Navegación fluye correctamente entre pantallas

**Si lográs esto, Sprint 1 está COMPLETO. 🚀**

---

**Preparado por:** Juan Raimondo  
**Fecha:** 26 de abril de 2026  
**Próxima revisión:** Post-sesión 5
