# **Épica: Autenticación y Control de Acceso**

Esta épica cubre el acceso al sistema por parte de todos los perfiles operativos. La Vista Pública (trazabilidad QR) es la única sección accesible sin autenticación.

---

## **HU-AUTH01: Login por Perfil de Usuario (Pantalla L1)**

**Como** usuario del sistema (Administrador, representante de Instituto, operario de Ecopunto o representante de Gestora)

**Quiero** autenticarme con mis credenciales en una pantalla de login única

**Para** acceder al portal correspondiente a mi rol y operar sobre los datos que me competen.

**Criterios de Aceptación:**

1. Existe una pantalla de login común para todos los perfiles, con campos de usuario (email) y contraseña.
2. Según el rol del usuario autenticado, el sistema redirige automáticamente al portal correspondiente:
   - `Administrador FIng` → Portal Administrador (Pantallas D1–D3)
   - `Representante Instituto` → Portal Instituto (Pantallas A1–A3)
   - `Operario Ecopunto` → Portal Ecopunto (Pantallas B1–B3)
   - `Representante Gestora` → Portal Gestora (Pantallas C1–C3)
3. Si las credenciales son incorrectas, se muestra un mensaje de error claro sin revelar cuál campo falló.
4. Todos los portales autenticados deben mostrar un botón de "Cerrar sesión" visible en el encabezado.
5. Si un usuario intenta acceder directamente a una URL de un portal que no le corresponde, el sistema lo redirige a su portal correcto.

**Prioridad:** Alta

**Notas Técnicas:** En el MVP, la autenticación es simulada con un listado de usuarios hardcodeados. No se implementará JWT ni sesiones reales. Los usuarios de prueba son:

| Email | Contraseña | Rol | Portal |
|---|---|---|---|
| admin@fing.edu.uy | admin123 | Administrador | D1–D3 |
| inco@fing.edu.uy | inco123 | Instituto (INCO) | A1–A3 |
| iie@fing.edu.uy | iie123 | Instituto (IIE) | A1–A3 |
| ecopunto@fing.edu.uy | eco123 | Operario Ecopunto | B1–B3 |
| gestora1@reciclauY.com | gest123 | Gestora (ReciclaUY) | C1–C3 |
| gestora2@ecotech.com.uy | gest456 | Gestora (EcoTech) | C1–C3 |
