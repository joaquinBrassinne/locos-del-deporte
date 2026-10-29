# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

"Locos del Deporte" (CrazySports): TP de la Tecnicatura en Desarrollo de Software. Directorio de clubes y deportistas de Río Tercero (Córdoba). Monorepo con carpetas independientes: `Backend/` (Spring Boot), `Frontend/` (React web), `Android/` (Expo/React Native, tiene su propio `AGENTS.md`), `Disenio/` (diagramas PlantUML), `Especificaciones/` (requerimientos, historias de usuario) y `docs/`. `formulario.md` en la raíz documenta los JSON de las solicitudes.

Versiones reales (leídas de `pom.xml` / `package.json`; no confiar en descripciones viejas): Spring Boot **4.0.6**, Java 21, Maven, PostgreSQL 16; React **19** + TypeScript + Vite + Tailwind 3 + React Compiler.

## Comandos

Base de datos (desde la raíz; `docker-compose.yml` monta `Backend/init.sql`):
```bash
docker compose up -d
```

Backend (desde `Backend/`, puerto 8080, Swagger en `/swagger-ui.html`):
```bash
./mvnw spring-boot:run
./mvnw clean test                              # requiere Docker activo (Testcontainers)
./mvnw test -Dtest=SecurityConfigTest          # una clase
./mvnw test -Dtest=AdminServiceTest#debeRechazarSolicitudConMotivo_cuandoSolicitudEsPendiente   # un método
./mvnw clean verify                            # empaquetado + JaCoCo (target/site/jacoco/index.html)
```
- `maven-surefire-plugin` tiene `testFailureIgnore=true`: **`mvn test` termina en éxito aunque haya tests rojos**. Revisar el resumen de Surefire (`target/surefire-reports`), no el exit code.
- Surefire fuerza `-Duser.timezone=UTC` (PostgreSQL en Windows rechaza `America/Buenos_Aires`).

Frontend (desde `Frontend/`, puerto 5173):
```bash
npm run dev
npm run build     # tsc -b && vite build
npm run lint      # oxlint (no ESLint)
```
No hay test runner en el frontend.

## Arquitectura backend

Paquete `com.pp2.crazySports`, capas clásicas: `controller` → `service` (interfaz `IXxxService` + impl) → `repository` (`IXxxRepository`, Spring Data JPA) → `model`. DTOs en `dto/<dominio>`; los services mapean entidad↔DTO a mano.

Entidades: `Club`, `Deportista` (ManyToOne a `Club`), `SolicitudRegistro`, `Administrador`.

**Flujo de solicitudes** (lo que requiere leer varios archivos):
- `POST /api/solicitudes` (público) crea una `SolicitudRegistro` en estado `PENDIENTE`. El payload del club/deportista viaja como **JSON en texto** dentro de `datosAdjuntos`, con `tipo` = `CLUB` | `DEPORTISTA`.
- Hay **dos caminos de aprobación/rechazo distintos y no equivalentes**:
  - `SolicitudRegistroController` (`PATCH /api/solicitudes/{id}/aprobar` y `/rechazar?motivo=`): `SolicitudRegistroService.aprobar` deserializa `datosAdjuntos` con `ObjectMapper`, crea el perfil vía `ClubService`/`DeportistaService` y guarda `perfilCreadoId`.
  - `AdminController` (`POST /api/admin/club/{id}`, `POST /api/admin/deportista/{id}`, `PUT /api/admin/rechazar/{id}/{motivo}`): `AdminService` recibe el DTO en el body en vez de leerlo de la solicitud.
- Enums de estado duplicados: `EstadoSolicitud` y `EstadosSolicitudE` (verificar cuál usa cada código antes de tocar).

**Seguridad** (`config/SecurityConfig`): HTTP Basic + BCrypt, CSRF off, CORS abierto a `localhost:*`. Públicos: `POST /api/solicitudes`, `GET /api/clubes/**`, `GET /api/deportistas/**`, Swagger. `/api/admin/**` y `/api/solicitudes/**` (salvo el POST) exigen `ROLE_ADMIN`; cualquier otra ruta (incl. POST/PUT/DELETE de clubes y deportistas) solo requiere estar autenticado. `CustomUserDetailsService` carga el `Administrador`; `AdminCreado` (CommandLineRunner) crea el admin inicial desde `app.admin.*` solo si la tabla está vacía. Credenciales dev: `AdminRoot` / `locos1234`.

**Errores**: `GlobalExceptionHandler` solo mapea `IllegalArgumentException` → 400. Los services lanzan `RuntimeException` genérica para "no encontrado", que termina en 500.

**Config**: `application.properties` apunta a `localhost:5432/locos_deporte` con `ddl-auto=update`. Los tests usan `application-test.properties` con Testcontainers (`jdbc:tc:postgresql:16`) y `create-drop`, admin `AdminTest`/`test1234`.

## Frontend

`src/pages/*` (rutas), `src/components/*`, `src/hooks/useClubes.ts`, `src/services/api.ts` (cliente HTTP al backend), `src/types`. Rutas de admin: `/login` → `/admin`. Hay archivos residuales `App.tsx.orig` y `App.tsx.original`: ignorarlos.

## Pruebas

Suite existente documentada en `docs/tests-backend.md`: matriz `TC-XXX-NN` ↔ test, más la lista de defectos conocidos (BUG-01 a BUG-04: 404 vs 400/500, validaciones faltantes de DTO, `AdminService` sin `@Transactional` ni `perfilCreadoId`, `rechazar` pisa `fechaEnvio`). Hay tests ROJOS a propósito: documentan bugs reales.

Reglas para escribir pruebas:
- El resultado esperado sale de la planilla de casos y de los criterios de aceptación, **no** de lo que el sistema devuelve hoy. Si el sistema no cumple, el test debe fallar y se reporta como bug; no ajustar el assert para que pase.
- Cada test limpia los datos que crea.
- Nombre del test: `TC-XXX-NN_descripcion`, para trazar contra la planilla. (La suite actual usa `debeX_cuandoY` y mapea el ID en `docs/tests-backend.md`; en tests nuevos usar el prefijo `TC-XXX-NN_`.)
- Verificar las rutas leyendo los controllers; no asumirlas.
- Datos base DS-01: 3 clubes aprobados, 2 pendientes, 4 deportistas aprobados y 1 pendiente.

**Pendiente de ubicar**: el "Plan de pruebas v1.1", la planilla de casos y el seed DS-01 **no están en el repo** (`docs/` solo tiene `tests-backend.md`; `Backend/init.sql` no los referencia). Pedirlos al usuario antes de escribir tests contra ellos; no inferir resultados esperados desde el código.
