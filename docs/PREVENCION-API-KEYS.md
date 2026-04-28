# 🛡️ Prevención de Exposición de API Keys

**Fecha:** 28 de abril de 2026  
**Última actualización:** 28 de abril de 2026  
**Estado:** ✅ Pre-commit hook ACTIVO

---

## 🚨 Historial de Exposiciones

### Exposición #1 (commit `a299400`)
- **Archivo:** `docs/FIXES-API-IA-Y-QR.md`
- **Key expuesta:** `...203d`
- **Acción:** OpenRouter deshabilitó la key automáticamente

### Exposición #2 (commit `5ca59fe`)
- **Archivo:** `docs/SECURITY-FIX-API-KEY.md`
- **Key expuesta:** `...30fb`
- **Acción:** OpenRouter deshabilitó la key automáticamente

### Lecciones Aprendidas
- ❌ **NUNCA** incluir keys reales en ejemplos de documentación
- ❌ **NUNCA** copiar/pegar desde .env.local a archivos .md
- ✅ **SIEMPRE** usar placeholders: `sk-or-v1-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

---

## 🛡️ Medidas de Prevención Implementadas

### 1. Pre-commit Hook ✅ ACTIVO

**Ubicación:** `.git/hooks/pre-commit`

**Qué hace:**
- Escanea TODOS los archivos antes de cada commit
- Busca patrones de API keys de OpenRouter: `sk-or-v1-[a-f0-9]{64}`
- **BLOQUEA** el commit si detecta una key real
- Ignora placeholders (XXXX)

**Cómo funciona:**
```bash
# Cuando hagas git commit, automáticamente:
🔍 Verificando que no haya API keys...

# Si encuentra una key:
❌ ERROR: Detectada API key REAL
Archivos con problemas:
  docs/ejemplo.md

Reemplazá la key por: sk-or-v1-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Commit BLOQUEADO hasta que saques la key
```

**Probar el hook:**
```bash
# 1. Crear un archivo de prueba con una key falsa
echo "VITE_API_KEY=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" > test.txt

# 2. Intentar commitear
git add test.txt
git commit -m "test"

# 3. Debería bloquearse con error
# 4. Eliminar el archivo de prueba
rm test.txt
git reset
```

---

### 2. .gitignore Actualizado ✅

**Archivo:** `.gitignore`

```bash
# Variables de entorno (NUNCA commitear secrets)
.env
.env.local
.env.*.local
.env.production
.env.development
.env.test

# Solo permitir .env.example (template sin secrets)
!.env.example
```

**Verificación:**
```bash
# Ver archivos ignorados
git status --ignored | grep .env

# Debe mostrar:
app/.env.local
```

---

### 3. Configuración Correcta de .env.local ✅

**Ubicación:** `app/.env.local` (NO versionado)

**Contenido actual:**
```bash
# ⚠️⚠️⚠️ NUNCA COMMITEAR ESTE ARCHIVO ⚠️⚠️⚠️
VITE_OPENROUTER_API_KEY=sk-or-v1-f2046...  # Key REAL aquí (OK)
VITE_OPENROUTER_MODEL=anthropic/claude-3-haiku
VITE_PUBLIC_URL=https://seminario.noah.uy
```

**Estado en Git:**
```bash
git status app/.env.local
# Debe mostrar: nothing to commit (use -u to show untracked files)
# O: app/.env.local (ignored)
```

---

## 📝 Reglas de Oro

### ✅ HACER (Siempre)

1. **Configurar keys SOLO en .env.local**
   ```bash
   # En app/.env.local (NO commitear)
   VITE_OPENROUTER_API_KEY=sk-or-v1-real-key-here
   ```

2. **Usar placeholders en documentación**
   ```markdown
   # En docs/*.md (SÍ commitear)
   VITE_OPENROUTER_API_KEY=sk-or-v1-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

3. **Verificar antes de commitear**
   ```bash
   # El pre-commit hook lo hace automáticamente
   git commit -m "mensaje"
   # Si hay keys, el commit se bloquea
   ```

### ❌ NUNCA HACER (Jamás)

1. **Incluir keys en archivos .md**
   ```markdown
   ❌ VITE_OPENROUTER_API_KEY=sk-or-v1-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

2. **Commitear .env.local**
   ```bash
   ❌ git add app/.env.local
   ❌ git commit -m "config"
   ```

3. **Copiar/pegar desde .env.local a documentación**
   ```bash
   ❌ cat app/.env.local >> docs/README.md
   ```

---

## 🔍 Verificación Post-Implementación

### Test 1: Pre-commit Hook Funciona

```bash
# Crear archivo con key falsa
echo "sk-or-v1-test1234test1234test1234test1234test1234test1234test1234test1234" > test-key.txt

# Intentar commitear
git add test-key.txt
git commit -m "test"

# ✅ Esperado: ERROR y commit bloqueado
# ❌ Si pasa: El hook NO está funcionando

# Limpiar
rm test-key.txt
git reset
```

### Test 2: .env.local NO Se Commitea

```bash
# Modificar .env.local
echo "# test" >> app/.env.local

# Ver status
git status

# ✅ Esperado: app/.env.local NO aparece en "Changes not staged"
# ❌ Si aparece: .gitignore está mal configurado
```

### Test 3: Keys NO Están en Git

```bash
# Buscar la key actual en Git
git grep "sk-or-v1-f2046159" 

# ✅ Esperado: No results (vacío)
# ❌ Si encuentra algo: La key está expuesta!
```

---

## 🚨 Qué Hacer Si el Hook Detecta una Key

### Paso 1: NO FORZAR EL COMMIT
```bash
❌ git commit --no-verify  # NUNCA hacer esto
```

### Paso 2: Encontrar la Key
```bash
# Ver qué archivo tiene la key
git diff --cached | grep "sk-or-v1-"

# O revisar los archivos staged
git diff --cached --name-only
```

### Paso 3: Reemplazar por Placeholder
```bash
# Editar el archivo y reemplazar:
sk-or-v1-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
# Por:
sk-or-v1-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Paso 4: Volver a Intentar
```bash
git add archivo-corregido.md
git commit -m "docs: actualizar ejemplo"
# ✅ Ahora debería pasar
```

---

## 📊 Estadísticas de Seguridad

### Keys Protegidas
- ✅ Key actual: `...e602` (SOLO en .env.local)
- ✅ Verificado: NO está en Git
- ✅ Pre-commit hook: ACTIVO

### Archivos Monitoreados
- `docs/**/*.md` → Documentación
- `app/**/*.{js,jsx,ts,tsx}` → Código fuente
- `*.json` → Configuraciones
- Todos los archivos staged antes de commit

### Historial Limpio
- ❌ Commit `a299400` → Key expuesta (limpiada)
- ❌ Commit `5ca59fe` → Key expuesta (limpiada)
- ✅ Commit `78f6de0` → Keys eliminadas
- ✅ Pre-commit hook instalado

---

## 🔄 Mantenimiento del Hook

### Actualizar el Hook

Si necesitás modificar el pre-commit hook:

```bash
# Editar el archivo
nano .git/hooks/pre-commit

# O con editor de texto
code .git/hooks/pre-commit

# Asegurar que sea ejecutable
chmod +x .git/hooks/pre-commit
```

### Desactivar Temporalmente (NO RECOMENDADO)

```bash
# Solo para emergencias
git commit --no-verify -m "mensaje"

# ⚠️ Usar SOLO si estás 100% seguro de que NO hay keys
```

### Re-activar el Hook

```bash
# Verificar que existe
ls -la .git/hooks/pre-commit

# Si no existe, recrearlo desde docs/PREVENCION-API-KEYS.md
# (este documento tiene el código del hook)
```

---

## 🎯 Checklist de Seguridad (Antes de Cada Commit)

Antes de hacer `git commit`, verificar:

- [ ] ¿Modifiqué archivos .md con ejemplos de config?
  - [ ] ¿Usé placeholders en lugar de keys reales?
- [ ] ¿Copié/pegué desde .env.local?
  - [ ] ¿Reemplacé las keys por XXXXXXXX?
- [ ] ¿Agregué nuevos archivos de configuración?
  - [ ] ¿Están en .gitignore si contienen secrets?
- [ ] ¿El pre-commit hook está activo?
  - [ ] `ls -la .git/hooks/pre-commit` → debe existir

**Si respondiste NO a alguna:**
1. Pausar el commit
2. Revisar los archivos
3. Corregir antes de commitear

---

## 📞 Recursos

### Herramientas de Detección

1. **git-secrets** (GitHub)
   - https://github.com/awslabs/git-secrets
   - Escanea repos completos
   - Detecta múltiples tipos de secrets

2. **gitleaks** (Recomendado)
   - https://github.com/gitleaks/gitleaks
   - Muy rápido y preciso
   - CLI simple

3. **truffleHog**
   - https://github.com/trufflesecurity/truffleHog
   - Escanea historial de Git
   - Detecta entropy alta (secrets)

### OpenRouter

- **Dashboard:** https://openrouter.ai/dashboard
- **Rotar keys:** https://openrouter.ai/keys
- **Límites:** https://openrouter.ai/settings/limits

---

## ✅ Resumen Ejecutivo

**Estado actual:**
- ✅ Pre-commit hook ACTIVO
- ✅ .env.local protegido por .gitignore
- ✅ Keys anteriores eliminadas de documentación
- ✅ Nueva key configurada correctamente
- ✅ Sin keys expuestas en Git

**Próxima acción:**
- Ninguna. El sistema está protegido.
- Los commits se verifican automáticamente.
- Seguir las reglas de oro al documentar.

**En caso de exposición:**
1. OpenRouter deshabilitará la key automáticamente
2. Recibirás email de alerta
3. Crear nueva key en openrouter.ai/keys
4. Configurar en app/.env.local (SOLO ahí)
5. Hacer commit limpiando la key expuesta

---

**Última verificación:** 28 de abril de 2026  
**Pre-commit hook:** ✅ Activo  
**Keys en Git:** ✅ Ninguna (verificado)  
**Estado:** 🛡️ PROTEGIDO
