# Guía de uso de OpenCode — EcoFIng

## ¿Qué es OpenCode?

OpenCode es un agente de IA que corre en tu terminal y puede leer, escribir y modificar archivos de tu proyecto directamente. Lee el `CLAUDE.md` de la raíz para entender el contexto del proyecto.

---

## Cómo abrirlo

```bash
# Abrí una terminal en la raíz del repo
cd seminario-tecnologia-fing

# Iniciá OpenCode
opencode
```

OpenCode va a leer automáticamente el `CLAUDE.md` y va a tener todo el contexto del proyecto.

---

## Flujo de trabajo por sesión

```
1. Abrís OpenCode en la raíz del repo
2. Copiás el prompt del sprint correspondiente (de esta carpeta)
3. Lo pegás en OpenCode
4. Revisás lo que genera antes de aceptar cambios
5. Hacés commit con el formato correcto:
   git add .
   git commit -m "feat(portal): descripción HU-XXX"
   git push origin develop
```

---

## Reglas para trabajar con OpenCode

**Siempre decile dónde están los archivos.** OpenCode conoce la estructura del `CLAUDE.md` pero es mejor ser explícito:
> "Creá el archivo en `app/src/portals/instituto/Dashboard.jsx`"

**Revisá antes de aceptar.** OpenCode muestra un diff de los cambios. Leelo antes de confirmar.

**Un componente a la vez.** Si el prompt es muy grande, dividilo. Es mejor hacer HU-I01 completo y funcional que las 3 HUs a medias.

**Si algo no queda bien**, describí exactamente qué falla:
> "El botón 'Nueva solicitud' no navega a /instituto/nueva — arreglá el onClick para que use useNavigate"

---

## Prompts disponibles

| Archivo | Qué construye | Sesión |
|---|---|---|
| `00-setup-verificacion.md` | Verificar que todo funciona | 4 |
| `01-sprint1-instituto.md` | Portal Instituto completo (HU-I01, I02, I03) | 4 |
| `02-sprint2-ecopunto-gestora.md` | Ecopunto + Gestora (HU-E01, E03, G01, G02, G03) | 5 |
| `03-sprint3-ia.md` | Clasificación con IA — HU-E02 | 6 |
| `04-sprint3-admin.md` | Portal Administrador (HU-A01, A02, A03) | 6 |
| `05-sprint3-publica.md` | Vista pública QR — HU-P01 | 6 |
| `06-sprint4-pulido.md` | Consistencia visual, auth, ajustes finales | 7 |
