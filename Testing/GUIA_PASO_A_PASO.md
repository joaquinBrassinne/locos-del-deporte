# Guía paso a paso — Cierre V&V (entrega viernes 6 de noviembre)

> Nota: el archivo se llama `trabajo_guillen.md` (no `guillen_actividad.md`). Esta guía sale de ahí.

## 0. Qué te piden (checklist de aprobación)

| # | Requisito | Dónde se cumple |
|---|---|---|
| 1 | Video ≤ 15 min, 5 integrantes/casos de 2–3 min | Sección 6 |
| 2 | Wiki: Plan de pruebas | 5.1 |
| 3 | Wiki: Matriz de trazabilidad | 5.2 |
| 4 | Wiki: Informe de cierre por sprint | 5.3 |
| 5 | Issues: plantillas US / TC / BUG | `.github/ISSUE_TEMPLATE/` (ya creadas) |
| 6 | TC con ID, precondiciones, datos, pasos, esperado, obtenido, estado, evidencia | plantilla TC |
| 7 | BUG con pasos, esperado vs obtenido, entorno, severidad, prioridad, evidencia, TC que lo detectó | plantilla BUG |
| 8 | Labels: `test-case`, `bug`, `accesibilidad`, `user-story`, otros | Paso 2 |
| 9 | **Una evidencia por test ejecutado**, adjunta en el issue del TC | Paso 4 |
| 10 | Aprobado sin evidencia = no ejecutado | regla de oro |
| 11 | UI: obligatorios con `*` + leyenda "Campo obligatorio" / "Requerido"; "Recomendado*" no puede bloquear envío | Paso 7 |

## 1. Levantar el entorno (una vez)

Requisitos: Docker Desktop, JDK 21, Node. En **Git Bash**, desde la raíz del repo:

```bash
bash Testing/scripts/01-levantar-entorno.sh
```
- API: http://localhost:8080 — Swagger: http://localhost:8080/swagger-ui/index.html
- Front: http://localhost:5173
- Admin: `AdminRoot` / `locos1234` (Basic Auth)

Anotá el **entorno** (SO, navegador, URL API): va en el Plan de Pruebas y en cada TC/BUG.

## 2. Preparar GitHub (Issues + labels)

Repo: `joaquinBrassinne/locos-del-deporte`. **Ojo:** tu repo local no tiene commits todavía; hacé commit y push para que las plantillas de `.github/ISSUE_TEMPLATE/` aparezcan.

```bash
gh label create test-case -c 0E8A16 ; gh label create bug -c D73A4A ; gh label create accesibilidad -c 1D76DB
gh label create user-story -c FBCA04 ; gh label create seguridad -c B60205 ; gh label create automatizado -c 5319E7
```
Creá un issue **US** por cada HU de `Especificaciones/Historias de usuario.md` (HU-01…HU-09, HU-10 opcional).

## 3. Ejecutar las pruebas (cada una genera evidencia)

| Tipo | Comando | Evidencia que sale |
|---|---|---|
| Backend JUnit + JaCoCo | `bash Testing/scripts/05-tests-backend.sh` | `Backend/target/site/jacoco/index.html` |
| API smoke (curl) | `bash Testing/scripts/02-smoke-curl.sh` | captura de terminal |
| Postman/Newman | `bash Testing/scripts/03-correr-postman.sh` | `Testing/reporte-postman.html` |
| Playwright | `bash Testing/scripts/04-correr-playwright.sh` | screenshots/videos en `playwright-report` |

**Postman (manual):** importá `Testing/postman/CrazySports.postman_collection.json`. Variables ya definidas (`baseUrl`, `adminUser`, `adminPass`). Carpetas:
1. Públicos · 2. Solicitudes · 3. Moderación admin · 4. **Validación de campos** · 5. **Seguridad**.
Correr en orden (la 02 guarda `solicitudId` para la 03). Si cambiás algo, editá `Testing/postman/build.mjs` y corré `node build.mjs`.

**Fallos esperados (son hallazgos, no errores tuyos):** la carpeta 04 fallará en nombre 256 chars (500 en vez de 400), email/teléfono inválido (201 en vez de 400), edad 150. Eso coincide con BUG-02B/C/D de `docs/oral-longitud-y-formato-de-campos.md`. Es justo lo que pide la consigna: "generar las condiciones para que lo que no funciona salga a la luz rápido y barato". **No los arregles antes del video** si querés mostrarlos; o mostrá el rojo y luego el verde del fix.

**Playwright:** los selectores de login (`Usuario`/`Contraseña`) están verificados contra el código; el texto del botón y `/admin` sin login → redirección **no los pude verificar**: si fallan, ajustá el selector (puede ser un bug real: anotalo). Dato a investigar: `Admin.tsx` usa `PATCH /api/solicitudes/{id}/aprobar` (existe), mientras que `AdminController` expone `/api/admin/club/{id}`: dos caminos de aprobación, confirmá cuál usa el flujo real.

## 4. Registrar cada ejecución (regla: 1 evidencia por test)

Para **cada** TC:
1. Crear issue con plantilla **TC** (label `test-case`), enlazar `US #n`.
2. Ejecutar, sacar captura/GIF del resultado **obtenido** (Win+Shift+S / ScreenToGif).
3. Pegar la imagen en el issue, marcar estado.
4. Si falla: issue **BUG** (label `bug`, + `accesibilidad`/`seguridad` si aplica), con `Detectado por TC #n`; enlazar el BUG en el TC.
5. Cerrar TC aprobados; los BUG quedan abiertos hasta fix.

Casos mínimos sugeridos (ya mapeados a lo que automatizamos):

| TC | HU | Tipo | Dónde |
|---|---|---|---|
| TC-01 Listar clubes público | HU-06 | Postman | 01 / GET clubes |
| TC-02 Enviar solicitud de club | HU-04 | Manual + Postman | `/solicitud` |
| TC-03 Solicitud sin tipo → 400 | HU-04 | Postman | 02 |
| TC-04 Login admin válido/ inválido | HU-01 | Playwright | login-seguridad |
| TC-05 Búsqueda por nombre | HU-09 | Manual / Postman | `/buscar` |
| TC-06 Mapa carga | HU-07 | Playwright | navegacion |
| TC-07 Longitud nombre 256 | — | Postman | 04 (BUG) |
| TC-08 Endpoints sin auth → 401 | HU-01 | Postman/curl | 05 |
| TC-09 SQLi en buscar | HU-09 | Postman | 05 |
| TC-10 A11y (axe) | — | Playwright | accesibilidad |

## 5. Wiki (GitHub → Wiki). Plantillas

Reutilizá `docs/Plan_de_Pruebas_Locos_del_Deporte_v1_1_Grupo_6.md` (ya tiene alcance, estrategia, criterios) y completá lo que falta.

### 5.1 `Testing` – Plan de pruebas
Alcance (qué SÍ / qué NO), estrategia, tipos (funcional, API, E2E, seguridad, accesibilidad, validación de campos), **entorno** (SO, navegador/emulador, `http://localhost:8080`, Postgres 16, JDK 21), **criterios de entrada** (API y front levantan, datos base cargados) y **de salida** (0 defectos críticos abiertos, 100% TC ejecutados con evidencia).

### 5.2 Matriz de trazabilidad
| HU | Criterio | TC | Resultado | BUG |
|---|---|---|---|---|
| HU-01 | Login admin | TC-04, TC-08 | | |
| HU-04 | Solicitud de registro | TC-02, TC-03 | | |
| HU-06 | Ver perfiles | TC-01 | | |
| HU-07 | Mapa | TC-06 | | |
| HU-09 | Búsqueda | TC-05, TC-09 | | |
(sumar BUG-02B/C/D en la fila que corresponda y en TC-07)

### 5.3 Informe de cierre por sprint
Por sprint: casos ejecutados / aprobados / fallidos / bloqueados; defectos abiertos y cerrados; lecciones aprendidas. Cifras salen de `gh issue list --label test-case --state all` y del reporte Newman.

## 6. Video (≤ 15 min) — un caso por integrante, 2–3 min

Intro común (~1 min): importancia del testing, fases, ciclo (planificar → diseñar → ejecutar → reportar → cerrar), buenas prácticas.

**Somos 2 integrantes:** la consigna pide 5 casos distintos (2–3 min cada uno) y sugiere uno por persona. Con 2 personas, cada uno presenta 2–3 casos de tipos distintos, sin repetir. Se mantienen los 5 tipos, repartidos por afinidad:

| Integrante | Caso (tiempo) | Qué mostrar |
|---|---|---|
| **A (backend/API)** | 1. Postman (2 min) | Newman corriendo; carpeta 04 en rojo y qué BUG revela |
| | 2. Seguridad (2 min) | 401 sin auth, SQLi, XSS, Swagger público |
| | 3. Manual + trazabilidad (2 min) | TC en issue → US → evidencia (captura) |
| **B (frontend)** | 4. Playwright (2,5 min) | `npx playwright test` + reporte; criterio costo-beneficio |
| | 5. Accesibilidad (2,5 min) | Un issue `accesibilidad` real (violación axe, WCAG, fix propuesto) |

Tiempos: intro 1,5 min (A) + 6 min (A) + 5 min (B) + cierre 1 min (B) ≈ 13,5 min, bajo el límite de 15. Mantené cada caso en 2–3 min y ensayá con cronómetro.

Alternativa si el docente exige "un caso por integrante" más estricto: A hace Postman + manual con trazabilidad; B hace Playwright + accesibilidad + seguridad (la seguridad se muestra con el test de Playwright de `/admin` sin login). Aclará el reparto al inicio del video.

Reparto del resto: A = TC/BUG de API y seguridad + Plan de pruebas; B = TC/BUG de front/accesibilidad + matriz de trazabilidad; el informe de cierre lo hacen entre los dos. Asigná (assignee) cada TC a quien lo ejecutó.

**Decisión de automatización (con tus palabras):** automatizamos lo repetitivo, estable y de alto riesgo (API, login, regresión de rutas) porque el costo se amortiza en cada corrida; dejamos manual lo que cambia seguido o exige juicio humano. **Ejemplo manual a propósito:** la visualización del mapa Leaflet / diseño visual (tiles de OpenStreetMap externos, layout subjetivo: automatizar es frágil y caro, y un humano lo evalúa en segundos). Ajustalo si tu grupo eligió otro.

Mensaje clave: *no demostrar que todo funciona, sino hacer aflorar rápido lo que no funciona.*

## 7. Interfaz: campos obligatorios

Revisar `/solicitud`, `/login` y modales de admin: obligatorios con `*` + leyenda "`*` Campo obligatorio" (o "Requerido"). Un campo "Recomendado*" no debe tener `required` ni bloquear submit. Si falta, hacer el fix y agregar TC-E2E-04 (ya está en `solicitud.spec.ts`).

## 8. Orden de trabajo sugerido
1. Entorno → 2. Labels + plantillas + US → 3. Correr suites (ver rojos) → 4. TC/BUG con evidencia → 5. Wiki → 6. Ensayo del video (cronometrar) → 7. Entrega.
