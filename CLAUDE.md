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

### Fuentes de verdad (en `docs/`)

- `Plan_de_Pruebas_Locos_del_Deporte_v1_1_Grupo_6.md`: alcance, trazabilidad RF ↔ HU ↔ CA (CA-1.1 … CA-10.4), criterios de aceptación/rechazo, datos base DS-01.
- `Planilla_Test_Case_CrazySports_v1_10.xlsx`: 78 casos en 7 hojas, una por módulo. Columnas clave: ID, HU/RF/CA, Datos de prueba, Pasos, **Resultado esperado**, Postcondición / limpieza, Prioridad. Prefijos de ID: `TC-VP` (vista pública, 16), `TC-SR` (solicitud de registro, 10), `TC-AU` (autenticación, 11), `TC-PA` (panel admin, 16), `TC-API` (clubes y deportistas, 12), `TC-DB` (persistencia, 7), `TC-IT` (integración front-back, 6). Hoja "Leyenda y supuestos": rangos asumidos (edad 1–120, nombre ≤255, teléfono solo dígitos, email con formato válido) y nombres reales de tablas SQL (`solicitudes_registro`, `clubs`, `deportistas`, `admin`).
- Los casos de la planilla están redactados para ejecución manual (Swagger + TablePlus); los tests automatizados los traducen a MockMvc/Testcontainers.
- Ojo: `docs/tests-backend.md` documenta la suite JUnit ya existente con **otros IDs** (`TC-CTR-SOL-11`, `TC-ADM-02`, …) que no coinciden con los de la planilla. Los tests nuevos usan los IDs de la planilla.
- Defectos conocidos (BUG-01 a BUG-04 en `docs/tests-backend.md`): ids inexistentes dan 400/500 en vez de 404 (CA-10.3), validaciones faltantes de DTO, `AdminService` sin `@Transactional` ni `perfilCreadoId`, `rechazar` pisa `fechaEnvio`. Hay tests ROJOS a propósito: documentan bugs reales.

### Datos base DS-01

Clubes: Club Atlético Río Tercero (Fútbol), Club Náutico Río Tercero (Natación, `deporteAdaptado=true`), Club Atlético Sur (Básquet) → APROBADOS; Club Pendiente Uno (Vóley), Club Pendiente Dos (Fútbol) → PENDIENTES. Deportistas APROBADOS: Lucía Pérez (Fútbol), Mateo Gómez (Básquet), Sofía Díaz (Fútbol), Tomás Ruiz (Natación); PENDIENTE: Valentina Cruz (Vóley). Derivados esperados: 3 clubes, 4 deportistas, 3 disciplinas distintas, 1 club inclusivo. No hay script de seed: el plan los carga enviando solicitudes por Swagger y aprobando con `AdminRoot`.

### Reglas para escribir pruebas

- El resultado esperado sale de la planilla y de los CA, **no** de lo que el sistema devuelve hoy. Si el sistema no cumple, el test debe fallar y el fallo se reporta como bug; no ajustar el assert para que pase.
- Cada test limpia los datos que crea.
- Nombre: `TC-XXX-NN_descripcion`, para trazar contra la planilla.
- Verificar las rutas leyendo los controllers; no asumirlas (la planilla v1_10 ya corrigió las rutas de aprobar/rechazar a `/api/admin/*`, que responden 201 al aprobar).
- Los campos del JSON de club usan `nombreInstitucion`; el de deportista, `nombre`, `deporte`, `edad`, `historia`, `logros`, `deporteAdaptado`, `fotos`, `clubId`.
