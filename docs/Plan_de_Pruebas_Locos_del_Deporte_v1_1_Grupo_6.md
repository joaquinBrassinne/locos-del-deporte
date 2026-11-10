# Plan de Pruebas de Software

## Locos del Deporte (CrazySports)

**Grupo A — Versión 2.0 (Reentrega Sprint 4)**  
**Fecha:** 10/11/2026

---

## 1. Historial de Versiones

| Fecha | Versión | Autor | Organización | Descripción |
|---|---:|---|---|---|
| 22/09/2026 | 1.0 | Grupo A | Escuela Superior de Comercio — Sede Regional Río Tercero | Versión inicial del plan de pruebas. |
| 17/10/2026 | 1.1 | Grupo A | Escuela Superior de Comercio — Sede Regional Río Tercero | Reentrega Sprint 2/3: incorporación de trazabilidad RF-HU-CA, separación de suspensión/rechazo, escala de severidades y riesgos de producto. |
| 10/11/2026 | 2.0 | Grupo A | Escuela Superior de Comercio — Sede Regional Río Tercero | Reentrega Sprint 4: inclusión de cobertura UI para `/solicitud` y `/admin`, automatización E2E en Playwright, pruebas de regresión en JUnit/Postman, suite de accesibilidad y re-ejecución sobre dataset DS-01. |

---

## 2. Información del Proyecto y Aprobaciones

### 2.1. Información General

- **Empresa / Organización:** Escuela Superior de Comercio — Sede Regional Río Tercero.
- **Proyecto:** Locos del Deporte (CrazySports).
- **Fecha de preparación:** 10/11/2026 (Versión 2.0).
- **Cliente:** Alejandra Jaime.
- **Patrocinador principal:** Viviana Guillen (Cátedra de Verificación y Validación de Programas).
- **Líder de Proyecto / QA Coordinator:** Joaquín Brassinne.
- **Equipo de Testing:** Cynthia Molina, Leonel López, Damián Buscemi.

### 2.2. Control de Aprobaciones

| Nombre y Apellido | Cargo / Rol | Departamento u Organización | Fecha | Estado |
|---|---|---|---|---|
| Viviana Guillen | Patrocinador / Docente Revisor | Escuela Superior de Comercio | 10/11/2026 | En revisión |
| Alejandra Jaime | Cliente del Producto | Locos del Deporte | 10/11/2026 | Aprobado |
| Joaquín Brassinne | Líder de Proyecto / DevOps QA | Grupo A | 10/11/2026 | Aprobado |
| Cynthia Molina | QA Tester (Frontend / Vista Pública) | Grupo A | 10/11/2026 | Aprobado |
| Leonel López | QA Tester (Backend / Seguridad y Admin) | Grupo A | 10/11/2026 | Aprobado |
| Damián Buscemi | QA Tester (Integración, BD y Solicitudes) | Grupo A | 10/11/2026 | Aprobado |

---

## 3. Resumen Ejecutivo

El presente documento constituye el Plan de Pruebas de Software para la plataforma web **Locos del Deporte (CrazySports)**, orientada a centralizar y difundir el ecosistema deportivo de la ciudad de Río Tercero, Córdoba. La plataforma brinda visibilidad a instituciones y clubes locales, permite registrar trayectorias de deportistas destacados y ofrece a la comunidad canales de búsqueda, filtros inclusivos y acceso a información de contacto.

El plan establece la estrategia de verificación y validación sobre el frontend desarrollado en **React + TypeScript (con Vite)** y el backend REST en **Spring Boot 3.4.x / Java 21**, respaldado por una base de datos relacional **PostgreSQL 16** ejecutada en contenedor Docker. La totalidad de los casos de prueba se vinculan unívocamente con sus Requerimientos Funcionales (RF), Historias de Usuario (HU) y Criterios de Aceptación (CA). Asimismo, la estrategia articula pruebas manuales con automatización en Playwright (E2E), Newman/Postman (API), JUnit 5 con MockMvc (regresión de seguridad) y verificación de accesibilidad web (WCAG 2.1).

---

## 4. Alcance de las Pruebas

### 4.1. Elementos Dentro del Alcance

- **Vista Pública (UI + API):** Navegación y componentes del catálogo público en `/`, `/clubes` y `/deportistas`, validando contadores estadísticos del Home, listados dinámicos, búsquedas reactivas con insensibilidad a mayúsculas y diacríticos, y filtrado por deporte adaptado.
- **Formulario de Registro (UI + API):** Validación integral de la pantalla `/solicitud`, abarcando restricciones de longitud en inputs, sanitización contra Stored XSS, formato de número telefónico, verificación de que campos con badge "Recomendado" vacíos no bloqueen el envío, y persistencia de solicitudes en estado PENDIENTE en base de datos.
- **Panel de Administración (UI + API):** Gestión operativa en la ruta protegida `/admin`, testeando el renderizado de solicitudes pendientes, visualización modal de detalles y los flujos interactivos de aprobación y rechazo.
- **API REST — Clubes y Deportistas:** Pruebas funcionales de endpoints CRUD: `GET /api/clubes`, `GET /api/deportistas`, `GET /api/clubes/{id}`, `PUT /api/clubes/{id}`, `PUT /api/deportistas/{id}`, `DELETE /api/clubes/{id}` y `DELETE /api/deportistas/{id}`.
- **Seguridad y Control de Acceso:** Protección con Spring Security mediante HTTP Basic Auth sobre endpoints administrativos y transacciones destructivas (verificando respuestas 401 Unauthorized ante peticiones anónimas).
- **Persistencia e Integración en Base de Datos:** Verificación relacional en PostgreSQL (`:5432`), asegurando que la aprobación de una solicitud inserte el registro en club o deportista, actualice `solicitud_registro.estado = 'APROBADO'` y asocie correctamente el `perfil_creado_id`.

### 4.2. Funcionalidades a NO Probar (Exclusiones Justificadas y Riesgos Asumidos)

- **Mapa interactivo:** No implementado en esta versión. **Riesgo asumido:** El usuario no cuenta con visualización geolocalizada en mapa satelital.
- **Subida y almacenamiento binario de archivos:** Las imágenes se vinculan mediante URLs externas en texto plano. **Riesgo asumido:** Dependencia de la disponibilidad de servidores externos de imágenes (ej. Unsplash o Picsum).
- **Registro multi-administrador y recuperación de contraseña:** La plataforma opera con un único usuario administrador raíz (`AdminRoot`) declarado por variables de entorno del servidor. **Riesgo asumido:** Si se pierden las credenciales, se requiere intervención directa en la base de datos o en la configuración del contenedor Docker.
- **Pasarela de pagos y resultados deportivos en vivo:** Módulos expresamente fuera del alcance académico de la entrega.

---

## 5. Requerimientos Funcionales y Trazabilidad (RF ↔ HU ↔ CA)

| RF | Historia de Usuario (HU) | Criterios de Aceptación (CA) | Módulo / Capa |
|---|---|---|---|
| **RF-01** | **HU-01:** Como visitante quiero ver el catálogo público de clubes para conocer las instituciones locales. | **CA-1.1:** Lista exclusivamente instituciones en estado APROBADO.<br>**CA-1.2:** Cada tarjeta exhibe nombre, dirección y disciplinas.<br>**CA-1.3:** No exige inicio de sesión. | Vista Pública (UI/API) |
| **RF-02** | **HU-02:** Como visitante quiero consultar el perfil de deportistas destacados para conocer sus trayectorias. | **CA-2.1:** Lista solo deportistas aprobados.<br>**CA-2.2:** Muestra nombre, disciplina, edad y logros. | Vista Pública (UI/API) |
| **RF-03** | **HU-03:** Como visitante quiero buscar clubes por nombre y disciplina para acceder a opciones puntuales. | **CA-3.1:** Filtra coincidencias parciales por nombre.<br>**CA-3.2:** Filtra por disciplina seleccionada.<br>**CA-3.3:** Búsqueda sin distinguir mayúsculas ni acentos.<br>**CA-3.4:** Ante término sin coincidencias muestra mensaje de lista vacía. | Vista Pública (UI) |
| **RF-04** | **HU-04:** Como visitante quiero filtrar por deporte inclusivo para identificar entidades con deporte adaptado. | **CA-4.1:** Al activar el switch muestra únicamente registros con `deporteAdaptado = true`.<br>**CA-4.2:** Al desactivarlo restaura el catálogo general. | Vista Pública (UI) |
| **RF-05** | **HU-05:** Como representante de un club quiero enviar una solicitud de registro para solicitar nuestra incorporación. | **CA-5.1:** Con datos válidos crea la solicitud en estado PENDIENTE.<br>**CA-5.2:** Campos obligatorios vacíos bloquean el envío.<br>**CA-5.3:** Campos "Recomendado" vacíos permiten el envío exitoso. | Solicitud (UI/API) |
| **RF-06** | **HU-05:** Como deportista destacado quiero postular mi perfil para figurar en la plataforma. | **CA-6.1:** Registra solicitud de tipo DEPORTISTA en estado PENDIENTE.<br>**CA-6.2:** Valida rango etario y formato de datos de contacto. | Solicitud (UI/API) |
| **RF-07** | **HU-05:** Como plataforma quiero almacenar las postulaciones para su posterior análisis. | **CA-7.1:** Los datos completos del formulario persisten íntegros en la tabla `solicitud_registro`. | Backend / BD |
| **RF-08** | **HU-06:** Como administrador quiero autenticarme mediante Basic Auth para operar los servicios internos. | **CA-8.1:** Credenciales válidas conceden acceso.<br>**CA-8.2:** Peticiones sin autenticación o erróneas devuelven HTTP 401. | Seguridad / API |
| **RF-09** | **HU-06:** Como administrador quiero listar las solicitudes pendientes para evaluar nuevas incorporaciones. | **CA-9.1:** El panel visualiza únicamente postulaciones en estado PENDIENTE. | Admin (UI/API) |
| **RF-10** | **HU-06:** Como administrador quiero aprobar una solicitud para dar de alta el perfil institucional o deportivo. | **CA-10.1:** La solicitud pasa a APROBADO.<br>**CA-10.2:** Se inserta el registro en la tabla definitiva (club/deportista).<br>**CA-10.3:** Se completa `perfilCreadoId` en la solicitud. | Admin (UI/API/BD) |
| **RF-11** | **HU-06:** Como administrador quiero rechazar una postulación para descartar datos inválidos o duplicados. | **CA-11.1:** La solicitud pasa a RECHAZADO.<br>**CA-11.2:** Permite ingresar un motivo de rechazo explicativo. | Admin (UI/API) |
| **RF-12** | **HU-07:** Como visitante quiero que los perfiles aprobados se reflejen en la vista pública de forma oportuna. | **CA-12.1:** El perfil recién aprobado figura en el catálogo público.<br>**CA-12.2:** Las solicitudes rechazadas nunca se hacen visibles al público. | Integración E2E |
| **RF-13** | **HU-08:** Como visitante quiero ver estadísticas agregadas en la Home para conocer el volumen deportivo. | **CA-13.1:** Los contadores (clubes y deportistas) coinciden exactamente con los registros aprobados en BD.<br>**CA-13.2:** No contabiliza solicitudes pendientes en los totales. | Vista Pública (UI/BD) |
| **RF-14** | **HU-09:** Como visitante quiero buscar deportistas por disciplina deportiva para encontrar referentes. | **CA-14.1:** Búsqueda reactiva por disciplina con tolerancia a diacríticos (ej. "Natacion" = "Natación"). | Vista Pública (UI) |
| **RF-15** | **HU-10:** Como administrador quiero actualizar y eliminar clubes y deportistas vía API para sanear datos. | **CA-15.1:** PUT actualiza registros existentes.<br>**CA-15.2:** DELETE autenticado remueve el recurso con HTTP 204.<br>**CA-15.3:** DELETE o PUT sin autenticación retorna 401.<br>**CA-15.4:** Operaciones con ID inexistente responden 404. | API CRUD |

---

## 6. Pruebas de Regresión

Las pruebas de regresión aseguran que modificaciones en la infraestructura o en la lógica de negocio no alteren el comportamiento establecido:

- **Visualización del catálogo público:** Garantizar que refactorizaciones sobre el modelo de datos no degraden la carga de tarjetas públicas (TC-VP-01, TC-VP-02).
- **Normalización de búsquedas y filtros:** Verificar que el buscador y el conmutador inclusivo mantengan su comportamiento reactivo (TC-VP-03, TC-VP-10, TC-VP-11).
- **Persistencia del estado inicial:** Confirmar que toda nueva solicitud ingrese invariablemente con estado PENDIENTE (TC-SR-05).
- **Endpoints públicos vs. protegidos:** Verificar que los endpoints públicos (`GET /api/clubes/**`, `GET /api/deportistas/**`) permanezcan abiertos y que las operaciones privilegiadas exijan credenciales (TC-AU-04, TC-AU-05, TC-API-12).
- **Regresión TC-API-12:** Test automatizado de regresión que aserta 401 Unauthorized ante intentos de eliminación sin credenciales (cubierto por JUnit en `SecurityConfigTest` y colección Postman).
- **Persistencia ante reinicio:** Comprobar que los registros aprobados de DS-01 se mantengan consistentes tras reiniciar contenedores de PostgreSQL (TC-DB-07).

---

## 7. Estrategia y Técnicas de Diseño de Pruebas

### 7.1. Tipos de Prueba y Herramientas

| Tipo de Prueba | Descripción | Herramienta | Capa |
|---|---|---|---|
| Funcional UI / E2E | Verificación de flujos de catálogo, formularios y panel de administración en navegador. | Playwright (Chromium headless) + Chrome DevTools | Frontend / Interfaz |
| Servicios REST / API | Ejecución de peticiones HTTP, cabeceras, códigos de estado y payloads JSON. | Postman / Newman + Swagger UI | Backend / API |
| Seguridad Básica | Validación de autenticación HTTP Basic, inyección XSS en inputs y bypass de rutas protegidas. | JUnit 5 (MockMvc) + Postman | Backend / Controlador |
| Persistencia e Integración BD | Comprobación de integridad relacional, llaves foráneas y actualización de estados transaccionales. | TablePlus / psql sobre PostgreSQL 16 | Base de Datos |
| Accesibilidad Web | Checklist manual de accesibilidad WCAG 2.1 (contraste de color, navegación por teclado y etiquetas aria). | Google Chrome DevTools / Lighthouse | Frontend / UI |

### 7.2. Técnicas de Diseño de Casos (Estándar ISTQB)

- **Partición de Equivalencia (EP):** Separación de entradas válidas e inválidas en formularios (ej. correos sintácticamente correctos vs. incompletos; campos requeridos presentes vs. ausentes).
- **Análisis de Valores Límite (BVA):** Verificación de fronteras numéricas y longitudes de cadena (edad = 0, 1, 120, 150; nombres vacíos y de 256 caracteres; teléfonos de 8 a 15 dígitos).
- **Transición de Estados (ST):** Validación del ciclo de vida de la entidad `SolicitudRegistro`:

  \[
  \text{PENDIENTE} \xrightarrow{\text{Aprobar}} \text{APROBADO}
  \]

  \[
  \text{PENDIENTE} \xrightarrow{\text{Rechazar}} \text{RECHAZADO}
  \]

  Se evalúan explícitamente las transiciones inválidas: intentar aprobar o rechazar solicitudes que ya se encuentran en APROBADO o RECHAZADO.

- **Tabla de Decisión:** Combinación de filtros concurrentes en el catálogo (búsqueda por nombre \( \cap \) filtro de deporte adaptado activo).
- **Adivinanza de Errores (Error Guessing):** Payloads con scripts (`<script>alert(1)</script>`), consultas SQL en el buscador (`' OR 1=1 --`), JSON malformado en campos dinámicos y solicitudes con IDs inexistentes (999999).

---

## 8. Criterios de Aceptación, Rechazo, Suspensión y Reanudación

### 8.1. Escala de Severidad de Defectos

- **Bloqueante (Severidad 1):** Impide el inicio de la plataforma o anula la ejecución del plan de pruebas (ej. base de datos inaccesible, fallo de arranque en Spring Boot).
- **Crítico (Severidad 2):** Falla en un requerimiento funcional principal o quiebre de seguridad sin alternativa operativa (ej. visualización pública de solicitudes pendientes, fallo transaccional que no crea el perfil al aprobar, bypass de autenticación en endpoints privilegiados).
- **Mayor (Severidad 3):** Falla en una función relevante pero que admite una alternativa operativa documentada (workaround) (ej. endpoints que responden HTTP 500 en lugar de 404 ante IDs inexistentes).
- **Menor (Severidad 4):** Desviaciones cosméticas, errores ortográficos o inconsistencias menores de alineación que no perjudican la operación del sistema (ej. duplicación continua horizontal de mapas interactivos al alejar zoom).

### 8.2. Criterios de Suspensión y Reanudación

**Criterios de Suspensión:**

- Indisponibilidad de los servicios en contenedores Docker (PostgreSQL `:5432` o backend `:8080`).
- Detección de un defecto Bloqueante que impida ejecutar más del 30 % de los casos planificados para un módulo.
- Corrupción o inconsistencia de los datos base DS-01 que invalide las precondiciones.

**Criterios de Reanudación:**

- Despliegue y verificación del parche correctivo (hotfix) que solvente el bloqueo.
- Re-inicialización de la base de datos mediante la ejecución de `node seed-ds01.js`.
- Confirmación de arranque y estado saludable (healthcheck) de frontend y backend.

### 8.3. Criterios de Aceptación y Rechazo de la Release (Sin zonas grises)

| Condición / Métrica | Criterio de Aceptación (Release Aprobada) | Criterio de Rechazo (Release Rechazada) |
|---|---|---|
| Bugs Bloqueantes abiertos | 0 defectos abiertos. | \( \geq \) 1 defecto Bloqueante abierto. |
| Bugs Críticos abiertos | 0 defectos abiertos. | \( \geq \) 1 defecto Crítico abierto. |
| Tasa de PASS en Casos Críticos | 100 % de los casos críticos en PASS. | \( < \) 100 % (Un solo fallo en caso crítico rechaza la entrega). |
| Tasa de PASS en Casos Globales | \( \geq \) 90 % del total de casos planificados. | \( < \) 85 % del total de casos planificados en estado PASS. |
| Cobertura de Requerimientos | 100 % de los RF (RF-01 a RF-15) cubiertos con al menos 1 caso. | \( \geq \) 1 RF declarado sin cobertura de casos de prueba. |
| Defectos Mayores / Menores | Permitidos si cuentan con workaround y ticket abierto en backlog. | Defectos Mayores no mitigados que comprometan la usabilidad general. |

---

## 9. Prioridad de los Casos de Prueba

La prioridad define la secuencia de ejecución ante restricciones de tiempo, garantizando que los casos de prioridad Crítica no excedan el 25 % del total planificado:

- **Crítica (15–20 % del total):** Casos que mitigan riesgos de producto de impacto mayor (seguridad básica, persistencia de aprobaciones y consistencia del catálogo público).
- **Alta (30–35 % del total):** Funcionalidades de negocio indispensables (búsquedas reactivas, filtros por disciplina y validaciones requeridas de formulario).
- **Media (30–35 % del total):** Pruebas de borde, valores límite, sanitización contra entradas maliciosas y verificación de normalización ortográfica.
- **Baja (10–15 % del total):** Pruebas visuales, renderizado responsivo en vistas móviles y navegación estética.

---

## 10. Entregables

| Entregable | Plataforma / Formato | Responsable | Mecanismo de Control |
|---|---|---|---|
| Plan de Pruebas IEEE 829 | Google Docs (Modo Editor) | Grupo A | Historial de versiones público con aportes individuales. |
| Planilla de Test Cases | Google Sheets (Modo Editor) | Grupo A | Matriz de trazabilidad (RF/HU/CA), diseñador por caso y enlaces a screenshots. |
| Wiki de Testing del Repositorio | GitHub Wiki (`/wiki/Testing`) | Joaquín Brassinne | Publicación íntegra de `Testing.md` con enlaces directos. |
| Circuito de Defectos (Issues) | GitHub Issues (tag: `bug`) | Todo el equipo | Tickets con pasos para reproducir, severidad, fix aplicado y test de regresión. |
| Suites Automatizadas | Repositorio GitHub | Joaquín / Leonel | Código de tests en `/tests/playwright`, Postman y `/src/test/java`. |

---

## 11. Recursos y Entornos

### 11.1. Infraestructura de Hardware

- **Estaciones de trabajo de testers:** Equipos PC x64, mínimo 8 GB de memoria RAM y procesador multi-núcleo.
- **Servidor de Base de Datos:** Contenedor Docker de PostgreSQL 16 ejecutándose localmente en el puerto 5432.
- **Espacio en disco:** Mínimo 2 GB libres para imágenes Docker, librerías Maven y `node_modules`.

### 11.2. Entorno de Software

- **Java Development Kit (JDK):** Versión 21.
- **Apache Maven:** Versión 3.9+.
- **Node.js:** Versión 20+ con npm.
- **Docker Desktop / Docker Engine:** Contenedor `locos_deporte_db`.
- **Navegador Web:** Google Chrome (versión 120+) para ejecución manual y Chromium para Playwright.
- **Cliente SQL:** TablePlus / DBeaver / psql para auditoría de tablas relacionales.

### 11.3. Herramientas de Pruebas

- **Playwright:** Automatización de pruebas funcionales de interfaz y E2E sobre `http://localhost:5173`.
- **Postman / Newman:** Ejecución y reporte de la colección automatizada de endpoints REST.
- **JUnit 5 / Spring MockMvc:** Pruebas automatizadas de controladores y reglas de seguridad en backend.
- **Swagger UI:** Exploración manual de contratos REST en `http://localhost:8080/swagger-ui.html`.
- **Google Chrome DevTools:** Inspección de llamadas de red (códigos HTTP), consola y auditoría de accesibilidad.

---

## 12. Datos de Prueba Base (Dataset DS-01)

Todos los casos de prueba toman como base este conjunto de datos consistente, sembrado de forma determinística en PostgreSQL mediante el script `seed-ds01.js` (`npm run seed:ds01`):

### 12.1. Clubes Aprobados en DS-01

- **Club Náutico (ID: 1)** — Dirección: Av. del Sol y Costanera 150 — Deporte Adaptado: `true` — Disciplinas: Natación, Remo.
- **Club Sportivo 9 de Julio (ID: 2)** — Dirección: Av. San Martín 350 — Deporte Adaptado: `false` — Disciplinas: Tenis, Básquet.
- **Club Atlético Río Tercero (ID: 3)** — Dirección: Int. Dellagiovanna 250 — Deporte Adaptado: `false` — Disciplinas: Fútbol, Vóley.

### 12.2. Deportistas Aprobados en DS-01

- **Lucía Pérez (ID: 1)** — Deporte: Natación — Edad: 20 — Club Asociado: Club Náutico (ID 1).
- **Sofía Díaz (ID: 2)** — Deporte: Tenis — Edad: 22 — Club Asociado: Club Sportivo 9 de Julio (ID 2).
- **Lucas Gabriel Martínez (ID: 3)** — Deporte: Remo — Edad: 24 — Club Asociado: Club Náutico (ID 1).
- **Martina López (ID: 4)** — Deporte: Vóley — Edad: 21 — Club Asociado: Club Atlético Río Tercero (ID 3).

### 12.3. Solicitudes de Registro

- **Solicitudes 1 a 3:** Tipo CLUB, estado APROBADO, con `perfilCreadoId` vinculados a los clubes 1, 2 y 3.
- **Solicitudes 4 a 7:** Tipo DEPORTISTA, estado APROBADO, con `perfilCreadoId` vinculados a los deportistas 1, 2, 3 y 4.

### 12.4. Credenciales de Administrador

- **Usuario:** AdminRoot
- **Contraseña:** locos1234

---

## 13. Planificación, Procedimiento y Organización

### 13.1. Procedimiento de Ejecución en 6 Pasos

1. **Preparación y Seeding:** Levantar contenedores Docker, backend (`:8080`) y frontend (`:5173`). Ejecutar `node seed-ds01.js` para asegurar datos consistentes.
2. **Ejecución de Suites:** Correr los casos en orden de prioridad (Crítica \( \rightarrow \) Alta \( \rightarrow \) Media/Baja), ejecutando las suites de Playwright y Newman.
3. **Registro Individual:** Anotar resultado obtenido exacto, fecha de ejecución y nombre del tester en Google Sheets.
4. **Tratamiento de Defectos:** Ante discrepancias, calificar el caso como FAIL (o BLOCKED si falló la precondición), abrir ticket en GitHub Issues con etiqueta `bug` y enlazarlo en la planilla.
5. **Verificación de Regresión y Cierre:** Una vez aplicado el commit correctivo, re-ejecutar el test, asociar el hash de confirmación y cerrar el Issue.
6. **Consolidación de Métricas:** Calcular la tasa global de éxito en la carátula y verificar el cumplimiento de los criterios de aceptación.

### 13.2. Matriz de Responsabilidades (RACI)

| Actividad | Joaquín (Líder) | Cynthia (UI) | Leonel (Backend) | Damián (BD/Integ) |
|---|:---:|:---:|:---:|:---:|
| Redacción y ajuste del Plan de Pruebas | A | C | C | C |
| Casos de Vista Pública y Accesibilidad | I | R | I | I |
| Casos de Autenticación, Seguridad y Admin | I | I | R | I |
| Casos de Solicitudes, Formularios y Persistencia BD | I | I | I | R |
| Automatización E2E en Playwright | R | R | I | I |
| Automatización API y Regresión en JUnit/Postman | R | I | R | I |
| Gestión y Cierre de Issues en GitHub | A | R | R | R |

**R:** Responsable — **A:** Aprobador — **C:** Consultado — **I:** Informado

### 13.3. Cronograma de Actividades (Sprint 4)

| ID | Actividad | Responsable | Inicio | Fin | Horas | Predecesoras |
|---|---|---|---|---|---:|---|
| ACT-01 | Ajuste integral del Plan de Pruebas IEEE 829 (v2.0) | Joaquín Brassinne | 05/11/2026 | 06/11/2026 | 6 hs | — |
| ACT-02 | Creación y ejecución de script determinístico `seed-ds01.js` | Joaquín Brassinne | 06/11/2026 | 07/11/2026 | 4 hs | ACT-01 |
| ACT-03 | Re-ejecución de casos de Vista Pública en Playwright y evidencias | Cynthia Molina | 07/11/2026 | 08/11/2026 | 8 hs | ACT-02 |
| ACT-04 | Verificación técnica de TC-API-12 y suites de JUnit/Postman | Leonel López | 08/11/2026 | 08/11/2026 | 4 hs | ACT-02 |
| ACT-05 | Redacción y prueba de casos UI de formulario `/solicitud` y `/admin` | Damián Buscemi | 08/11/2026 | 09/11/2026 | 6 hs | ACT-02 |
| ACT-06 | Saneamiento de Issues #5, #16, #17 y cierre de bugs resueltos | Damián / Leonel | 09/11/2026 | 09/11/2026 | 4 hs | ACT-04, ACT-05 |
| ACT-07 | Evaluación de accesibilidad web (WCAG 2.1) | Cynthia Molina | 09/11/2026 | 10/11/2026 | 4 hs | ACT-03 |
| ACT-08 | Apertura y revisión cruzada de Pull Requests colaborativos | Todo el equipo | 10/11/2026 | 10/11/2026 | 4 hs | ACT-06, ACT-07 |
| ACT-09 | Publicación en GitHub Wiki y entrega de Google Docs/Sheets | Todo el equipo | 10/11/2026 | 11/11/2026 | 3 hs | ACT-08 |

---

## 14. Análisis de Riesgos

### 14.1. Riesgos de Proyecto (Entorno y Gestión)

- **Desalineación en dependencias de NodeJS / Docker:** Incompatibilidad en módulos npm o configuraciones locales. **Mitigación:** Estandarización de `package.json` y script automatizado `npm run seed:ds01`.
- **Disparidad en la evidencia de participación colaborativa:** Concentración de actividad en pocos integrantes en GitHub. **Mitigación:** Regla obligatoria de un PR formal por cada integrante con revisión y aprobación cruzada.

### 14.2. Riesgos de Producto (Perspectiva del Usuario)

- **RP-01: Exposición de perfiles no aprobados:** Visualización de instituciones en estado pendiente o rechazado. **Mitigación:** Casos TC-VP-01 y TC-VP-02 con aserciones sobre endpoints públicos.
- **RP-02: Bloqueo de la gestión administrativa:** Pérdida de acceso del usuario AdminRoot sin circuito de recuperación. **Mitigación:** Verificación de arranque con creación de admin por defecto en `AdminCreado.java` y pruebas TC-AU-01 a TC-AU-04.
- **RP-03: Corrupción o pérdida de datos al aprobar:** Solicitud marcada como aprobada sin impactar la creación de la entidad. **Mitigación:** Casos TC-PA-02 y verificación transaccional en PostgreSQL con `perfilCreadoId` consistente.
- **RP-04: Inyección de código malicioso (Stored XSS):** Ingreso de etiquetas `<script>` a través de los inputs del formulario de inscripción. **Mitigación:** Caso TC-UI-03, asegurando el escape de caracteres en el renderizado de componentes React.
- **RP-05: Inconsistencia entre contadores del Home y el catálogo:** Métricas que totalicen solicitudes no aprobadas. **Mitigación:** Caso TC-VP-08, validando que el conteo provenga de entidades activas de la tabla `club`.

---

## 15. Glosario

- **TC:** Test Case (Caso de Prueba documentado).
- **HU:** Historia de Usuario.
- **RF / CA:** Requerimiento Funcional / Criterio de Aceptación.
- **PASS / FAIL / BLOCKED:** Estados de ejecución del caso (Exitoso / Fallido / Bloqueado por precondición).
- **DS-01:** Dataset de pruebas determinístico de base.
- **Basic Auth:** Autenticación HTTP mediante credenciales en cabecera `Authorization` Base64.
- **Playwright:** Framework de pruebas automatizadas E2E sobre navegadores Chromium, Firefox y WebKit.
- **MockMvc:** Framework de Spring para pruebas de controladores REST simulando peticiones HTTP.
- **datosAdjuntos:** Estructura JSON serializada que preserva los datos de inscripción en `solicitud_registro`.
