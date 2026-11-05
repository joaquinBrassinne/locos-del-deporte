**Plan de Pruebas de Software**

***Locos del Deporte (CrazySports)***
***Grupo 6 — Versión 1.1 — Fecha: 16/10/2026***

**Tabla de contenido**

Historial de Versiones · Información del Proyecto · Aprobaciones · Resumen Ejecutivo · Alcance de las Pruebas (Elementos de Pruebas, Nuevas Funcionalidades a Probar, Trazabilidad RF ↔ HU ↔ CA, Pruebas de Regresión, Funcionalidades a No Probar) · Enfoque de Pruebas (Estrategia y Técnicas de Diseño) · Criterios de Aceptación o Rechazo · Severidad de Defectos · Prioridad de los Casos · Criterios de Suspensión · Criterios de Reanudación · Entregables · Recursos · Datos de Prueba Base · Planificación y Organización · Premisas · Supuestos a Confirmar · Dependencias y Riesgos (de Proyecto y de Producto) · Referencias · Glosario

---

## Historial de Versiones

| Fecha | Versión | Autor | Organización | Descripción |
| :---: | :---: | :---: | :---: | :---: |
| 22/09/2026 | 1.0 | Grupo 6 | Escuela Superior de Comercio — Sede Regional Río Tercero | Versión inicial del plan de pruebas |
| 17/10/2026 | 1.1 | Grupo 6 | Escuela Superior de Comercio — Sede Regional Río Tercero | Reentrega: alcance sin contradicciones, trazabilidad RF↔HU↔CA, criterios de aceptación/rechazo/suspensión sin huecos, escala de severidad, técnicas de diseño, riesgos de producto, cronograma con dependencias, datos de prueba base, supuestos de validación explícitos y entregables en Google Docs/Sheets |

## Información del Proyecto

| Empresa / Organización | Escuela Superior de Comercio — Sede Regional Río Tercero |
| :---- | :---- |
| Proyecto | Locos del Deporte (CrazySports) |
| Fecha de preparación | 17/10/2026 (v1.1; v1.0 del 22/09/2026) |
| Cliente | Alejandra Jaime |
| Patrocinador principal | Viviana Guillen / Verificación y validación de programas |
| Gerente / Líder de Proyecto | Joaquín Brassinne |
| Gerente / Líder de Pruebas de Software | Joaquín Brassinne (coordinación); testers: Cynthia Molina, Leonel López, Damián Buscemi |

## Aprobaciones

| Nombre y Apellido | Cargo | Departamento u Organización | Fecha | Firma |
| :---: | :---: | :---: | :---: | :---: |
| Joaquín Brassinne | Líder de Proyecto | Grupo 6 — Escuela Superior de Comercio |
| Alejandra Jaime | Cliente | Cliente del proyecto | 
| Viviana Guillen | Patrocinador | Escuela Superior de Comercio — Sede Regional Río Tercero | 
| Cynthia Molina / Leonel López / Damián Buscemi | Analistas / Testers | Grupo 6 | 

## Resumen Ejecutivo

El presente documento constituye el Plan de Pruebas de Software del proyecto Locos del Deporte, una plataforma web destinada a centralizar y visibilizar el ecosistema deportivo de la ciudad de Río Tercero, Argentina. La plataforma permite a clubes e instituciones registrar sus perfiles, a deportistas destacados publicar sus trayectorias y logros, y a cualquier vecino buscar y descubrir la actividad deportiva local.

Este plan cubre la verificación y validación de los módulos desarrollados con Spring Boot (backend REST) y React + TypeScript (frontend), con base de datos PostgreSQL 16 ejecutada en contenedor Docker. El objetivo es asegurar que el sistema cumpla con los requerimientos funcionales y los criterios de aceptación de las Historias de Usuario antes de su entrega final. Cada caso de prueba se vincula con su Historia de Usuario (HU), su requerimiento (RF) y su criterio de aceptación (CA), y el riesgo de producto guía el orden de ejecución.

---

## Alcance de las Pruebas

### Elementos de Pruebas

| Módulo | Nivel de prueba en esta versión | Tecnología | Descripción |
| :---- | :---- | :---- | :---- |
| **Vista pública** | Interfaz web (UI) + API | React + TypeScript | Listado, búsqueda y filtros de clubes y deportistas; estadísticas del home |
| **Solicitud de registro** | **Solo API (Swagger UI)** | Spring Boot | Endpoints que generan una solicitud en estado PENDIENTE. La pantalla `/solicitud` no se prueba |
| **Gestión de solicitudes (admin)** | **Solo API (Swagger UI)** | Spring Boot + Spring Security | Listar, aprobar y rechazar solicitudes. La pantalla `/admin` no se prueba |
| **API REST — Clubes** | API | Spring Boot | Endpoints CRUD: GET (listar/buscar), PUT (actualizar), DELETE (eliminar) |
| **API REST — Deportistas** | API | Spring Boot | Endpoints CRUD: GET (listar/buscar), PUT (actualizar), DELETE (eliminar) |
| **Acceso a endpoints protegidos** | API | Spring Security + BCrypt | Basic Auth en cada petición: no existe pantalla ni endpoint de login |
| **Persistencia en base de datos** | Consultas SQL en TablePlus | PostgreSQL 16 | Que aprobar/rechazar actualice `solicitud_registro` y cree el registro en `club`/`deportista` con `perfilCreadoId` completo |

> **Aclaración de alcance:** en esta versión los módulos *Solicitud de registro* y *Gestión de solicitudes* se prueban únicamente a nivel API desde Swagger UI. Las pantallas `/solicitud` y `/admin` del frontend están fuera del alcance (ver «Funcionalidades a No Probar»). Ningún elemento figura a la vez dentro y fuera del alcance.

> **Cobertura:** todo elemento listado arriba tiene al menos un caso de prueba. La planilla v1.1 contiene **78 casos** en 7 hojas: Vista Pública (16), Solicitud de Registro (10), Autenticación (11), Panel de Administración (16), API Clubes y Deportistas (12), Persistencia BD (7) e Integración Frontend-Backend (6); más las hojas «Trazabilidad» (RF ↔ HU ↔ CA ↔ casos, con conteo automático), «Resumen de ejecución» (aplica los criterios de aceptación) y «Leyenda y supuestos». Todos los RF (RF-01 a RF-15) tienen al menos un caso.

### Módulos fuera del alcance

| Módulo | Motivo |
| :---- | :---- |
| Mapa interactivo | No implementado en la v1 |
| Subida directa de imágenes | No implementado; se usan URLs externas |
| Registro de múltiples administradores | Solo existe un admin predefinido en v1 |
| Pantallas `/solicitud` y `/admin` del frontend | No completadas en este sprint (se prueban por API) |
| Procesamiento de pagos | Fuera del scope del proyecto |
| Resultados en tiempo real | Fuera del scope del proyecto |

### Nuevas Funcionalidades a Probar

| ID | Requerimiento | Módulo |
| :---- | :---- | :---- |
| RF-01 | Un visitante puede ver el listado de clubes aprobados | Vista pública |
| RF-02 | Un visitante puede ver el listado de deportistas aprobados | Vista pública |
| RF-03 | Un visitante puede buscar clubes por nombre y disciplina | Vista pública |
| RF-04 | Un visitante puede filtrar por deporte inclusivo/adaptado | Vista pública |
| RF-05 | Un club puede enviar una solicitud de registro con sus datos | Solicitud (API) |
| RF-06 | Un deportista puede enviar una solicitud de registro con sus datos | Solicitud (API) |
| RF-07 | El sistema guarda la solicitud en estado PENDIENTE | Solicitud (API) |
| RF-08 | El admin accede a los endpoints protegidos con credenciales válidas (Basic Auth) y es rechazado con credenciales inválidas o ausentes | Acceso / Autenticación |
| RF-09 | El admin puede ver las solicitudes pendientes | Admin (API) |
| RF-10 | El admin puede aprobar una solicitud → se crea el perfil | Admin (API) |
| RF-11 | El admin puede rechazar una solicitud con motivo opcional | Admin (API) |
| RF-12 | Un perfil aprobado aparece en la vista pública | Integración |
| RF-13 | El home muestra estadísticas reales: clubes, deportistas, disciplinas y clubes con deporte inclusivo | Vista pública |
| RF-14 | Un visitante puede buscar deportistas por deporte, sin distinguir tildes ni mayúsculas | Vista pública |
| RF-15 | Un administrador puede actualizar y eliminar clubes y deportistas | API Clubes / Deportistas |

### Trazabilidad RF ↔ HU ↔ Criterios de Aceptación

> Los IDs de HU de esta tabla son los que usa la planilla de casos. Si el documento de requerimientos numera las HU distinto, se ajusta la numeración aquí y en la columna «HU» de la planilla (el contenido no cambia).

| HU | Historia de Usuario | RF | Criterios de Aceptación (CA) |
| :---- | :---- | :---- | :---- |
| HU-01 | Como visitante quiero ver los clubes aprobados para conocer la oferta deportiva de Río Tercero | RF-01 | **CA-1.1** Se listan solo clubes en estado aprobado. **CA-1.2** No requiere iniciar sesión. **CA-1.3** Cada card muestra nombre, dirección y disciplinas |
| HU-02 | Como visitante quiero ver los deportistas aprobados para conocer sus trayectorias | RF-02 | **CA-2.1** Se listan solo deportistas aprobados. **CA-2.2** No requiere iniciar sesión. **CA-2.3** Cada card muestra nombre, deporte y logros |
| HU-03 | Como visitante quiero buscar clubes por nombre y disciplina para encontrar rápido el que me interesa | RF-03 | **CA-3.1** Busca por nombre. **CA-3.2** Busca por disciplina. **CA-3.3** Sin resultados se muestra «No se encontraron clubes.». **CA-3.4** No distingue mayúsculas/minúsculas. **CA-3.5** Nunca devuelve clubes pendientes. **CA-3.6** Entradas con caracteres especiales no rompen la búsqueda |
| HU-04 | Como visitante quiero filtrar por deporte inclusivo para encontrar clubes con deporte adaptado | RF-04 | **CA-4.1** El filtro muestra solo clubes con `deporteAdaptado = true`. **CA-4.2** Al desactivarlo se muestran todos. **CA-4.3** Se puede combinar con la búsqueda |
| HU-05 | Como club o deportista quiero enviar mi solicitud de registro para aparecer en la plataforma | RF-05, RF-06, RF-07 | **CA-5.1** Con datos válidos la solicitud se guarda en PENDIENTE. **CA-5.2** Con datos inválidos/incompletos se rechaza con error indicando el campo |
| HU-06 | Como administrador quiero gestionar las solicitudes para publicar solo perfiles legítimos | RF-08, RF-09, RF-10, RF-11 | **CA-6.1** Solo el admin autenticado accede a los endpoints de gestión. **CA-6.2** Ve las solicitudes pendientes. **CA-6.3** Al aprobar se crea el perfil y la solicitud queda APROBADO. **CA-6.4** Al rechazar queda RECHAZADO con motivo opcional. **CA-6.5** No se puede aprobar/rechazar una solicitud que ya no está pendiente |
| HU-07 | Como visitante quiero que un perfil aprobado aparezca en la web para que la información esté actualizada | RF-12 | **CA-7.1** Tras aprobar, el perfil aparece en la vista pública. **CA-7.2** Una solicitud rechazada o pendiente no aparece |
| HU-08 | Como visitante quiero ver estadísticas en el home para dimensionar la actividad deportiva local | RF-13 | **CA-8.1** Los 4 contadores coinciden con los datos reales de la BD |
| HU-09 | Como visitante quiero buscar deportistas por deporte, sin preocuparme por tildes | RF-14 | **CA-9.1** Busca por deporte. **CA-9.2** «Futbol» encuentra «Fútbol». **CA-9.3** Las pills de disciplina filtran los destacados |
| HU-10 | Como administrador quiero actualizar y eliminar clubes y deportistas para mantener los datos correctos | RF-15 | **CA-10.1** PUT con datos válidos actualiza el registro. **CA-10.2** DELETE elimina el registro. **CA-10.3** Operaciones sobre ids inexistentes devuelven 404. **CA-10.4** Sin credenciales devuelven 401 |

### Pruebas de Regresión

Las siguientes funcionalidades no forman parte del desarrollo activo de este sprint pero sus componentes subyacentes son compartidos y podrían verse afectados ante cambios. Deben probarse para asegurar que continúan funcionando correctamente.

Desde el punto de vista del usuario:

* **Visualización pública de clubes y deportistas:** ante cualquier cambio en el modelo `Club` o `Deportista` (agregar campos, cambiar tipos), el visitante debe seguir pudiendo ver todos los perfiles aprobados sin errores en pantalla.
* **Buscador por nombre y disciplina:** si se modifican los endpoints de búsqueda o los repositorios, el visitante debe seguir pudiendo filtrar resultados correctamente.
* **Filtro de deporte inclusivo:** si se agrega lógica al campo `deporteAdaptado`, el botón toggle debe seguir mostrando solo los perfiles correspondientes.
* **Estado PENDIENTE de nuevas solicitudes:** si se modifica el flujo de aprobación, las nuevas solicitudes deben seguir llegando en estado PENDIENTE y no directamente como APROBADO.
* **Acceso sin login a endpoints públicos:** si se modifica `SecurityConfig.java`, los endpoints `GET /api/clubes/**` y `GET /api/deportistas/**` deben seguir siendo accesibles sin autenticación.
* **Creación automática del admin al iniciar:** si se modifica `AdminCreado.java` o el modelo `Administrador`, el sistema debe seguir creando el admin por defecto al arrancar si no existe ninguno.
* **Persistencia de datos tras reiniciar la BD:** si se modifica la configuración de Docker o de JPA (`ddl-auto`, volúmenes), los perfiles ya aprobados deben seguir existiendo después de reiniciar el contenedor.

Los casos de regresión se identifican con la etiqueta `#Regresion` en la planilla, y solo la llevan los casos que cubren estas siete funcionalidades: TC-VP-01 y TC-VP-02 (visualización pública), TC-VP-03 y TC-VP-11 (buscador por nombre y disciplina), TC-VP-05 (filtro inclusivo), TC-SR-05 (estado PENDIENTE), TC-AU-05 y TC-AU-10 (acceso sin login a endpoints públicos), TC-AU-11 (admin por defecto) y TC-DB-07 (persistencia tras reinicio).

### Funcionalidades a No Probar

Las siguientes funcionalidades quedan fuera del alcance de este plan de pruebas, con sus respectivas justificaciones y riesgos asumidos:

| Funcionalidad | Razón | Riesgo asumido |
| ----- | ----- | ----- |
| **Mapa interactivo** | No implementado en v1 del proyecto | El usuario no puede visualizar la ubicación geográfica de los clubes en un mapa |
| **Subida directa de imágenes** | No implementado; se usan URLs externas (ej. picsum.photos) | Las imágenes dependen de servicios externos que pueden no estar disponibles o cambiar sus URLs |
| **Registro de múltiples administradores** | Solo existe un admin predefinido en v1 | Si el admin pierde sus credenciales no hay mecanismo de recuperación |
| **Pantalla `/solicitud` del frontend** | No fue completada en este sprint (el flujo se prueba por API) | Los clubes y deportistas no pueden registrarse desde la interfaz web; deben hacerlo vía API |
| **Pantalla `/admin` del frontend** | No fue completada en este sprint (el flujo se prueba por API) | El admin debe usar Swagger UI para gestionar las solicitudes |
| **Pruebas de rendimiento / carga** | Fuera del alcance académico y sin herramientas configuradas | No se conoce el comportamiento del sistema bajo múltiples usuarios simultáneos |
| **Pruebas de compatibilidad cross-browser** | Solo se prueba en Google Chrome | Posibles diferencias visuales o funcionales en Firefox, Safari o Edge |
| **Pruebas en dispositivos móviles reales** | Solo se prueba en desktop con DevTools modo responsive | El comportamiento táctil y de gestos no está verificado en dispositivos físicos |
| **Evento (entidad)** | Definida en el diagrama de clases pero excluida de la v1 | La plataforma no puede publicar eventos deportivos en esta versión |
| **Recuperación de contraseña** | No implementado | No hay mecanismo de reset de password para el admin |

---

## Enfoque de Pruebas (Estrategia)

| Tipo | Descripción | Herramienta | Justificación |
| ----- | ----- | ----- | ----- |
| **Pruebas funcionales manuales** | Verificar que cada función opera según las especificaciones y los CA de las HU | Swagger UI, Navegador (Chrome) | Es el tipo más apropiado dado el alcance académico y el tiempo disponible |
| **Pruebas de integración** | Verificar la comunicación entre frontend, backend y base de datos | Swagger UI, Chrome DevTools, TablePlus | Permite detectar errores de contrato entre capas (ej. CORS, serialización JSON) |
| **Pruebas de validación** | Verificar que el sistema rechaza datos inválidos o incompletos | Swagger UI | Asegura que las anotaciones de validación (@NotBlank, @NotNull) funcionan correctamente |
| **Pruebas de seguridad básica** | Verificar autenticación y autorización de endpoints, y entradas maliciosas en el buscador | Swagger UI, Navegador | Garantiza que los endpoints del admin no son accesibles sin credenciales |
| **Pruebas de regresión** | Verificar que funcionalidades previas siguen operando ante nuevos cambios | Checklist manual (casos `#Regresion`) | Previene que correcciones o nuevas features rompan lo que ya funcionaba |

### Técnicas de diseño de casos de prueba

| Técnica | Dónde se aplica | Ejemplo |
| ----- | ----- | ----- |
| **Partición de equivalencia** | Búsquedas, validación de formularios, filtros | Búsqueda con texto que existe / que no existe / vacío; `tipo` válido (CLUB, DEPORTISTA) vs. inválido |
| **Análisis de valores límite** | Campos numéricos y de longitud | Rango válido de edad 1–120: se prueban -1, 0 y 150 (inválidos; TC-PA-10, 11, 12 y TC-API-11) y 25 (válido). Nombre: vacío y 256 caracteres inválidos (TC-PA-13, 14, TC-API-04); hasta 255 caracteres válido |
| **Transición de estados** | Ciclo de vida de la solicitud (PENDIENTE → APROBADO / RECHAZADO) | Aprobar o rechazar una solicitud que ya no está PENDIENTE debe ser rechazado |
| **Tabla de decisión** | Combinación de filtros de la vista pública | Filtro inclusivo activo + búsqueda por nombre: se muestra la intersección |
| **Adivinanza de errores (error guessing)** | Seguridad y entradas inesperadas | `' OR 1=1 --`, caracteres especiales, JSON malformado en `datosAdjuntos`, ids inexistentes |

---

## Criterios de Aceptación o Rechazo

Los criterios se evalúan al cierre de la ejecución y cubren todos los resultados posibles, sin huecos:

| Decisión | Condición (se deben cumplir todas) |
| ----- | ----- |
| **ACEPTADO** | 100 % de los casos de prioridad Crítica en PASS **y** al menos 90 % del total en PASS **y** ningún bug Bloqueante ni Crítico abierto **y** todos los RF con al menos un caso ejecutado |
| **RECHAZADO** | Se cumple **al menos una**: algún bug Bloqueante abierto; menos del 90 % de los casos críticos en PASS (es decir, más del 10 % en FAIL); menos del 80 % del total en PASS |
| **ACEPTADO CON OBSERVACIONES** | Cualquier otro resultado (no cumple todo lo de Aceptado ni nada de lo de Rechazado). Los FAIL deben tener Issue reportado y fecha de corrección acordada con el cliente |

*Ejemplo:* si falla el 10 % de los críticos con ningún bug Bloqueante y el total supera el 80 %, el resultado es «Aceptado con observaciones»; si fallara más del 10 % de los críticos, es «Rechazado».

## Severidad de Defectos

La **severidad** clasifica el bug; la **prioridad** (Crítica / Alta / Media / Baja) clasifica el caso de prueba. Son escalas distintas.

| Severidad | Definición | Ejemplo en Locos del Deporte |
| ----- | ----- | ----- |
| **Bloqueante** | Impide ejecutar otros casos o usar el sistema | El backend no arranca; el admin no puede autenticarse con credenciales válidas |
| **Crítica** | Falla una función central o expone/pierde datos, sin solución alternativa | La vista pública muestra clubes pendientes; al aprobar no se crea el perfil |
| **Mayor** | Falla una función importante con solución alternativa | El buscador no filtra por disciplina, pero el listado completo funciona |
| **Menor** | Defecto cosmético o de texto que no afecta la función | Mensaje con error ortográfico; botón desalineado |

## Prioridad de los Casos

La prioridad define **qué se ejecuta primero** cuando falta tiempo. Para que siga sirviendo como criterio, se asigna con estas reglas y se controla que los casos Críticos no superen el 25 % del total (hoy: 15 de 78, 19 %; la hoja «Resumen de ejecución» lo calcula).

| Prioridad | Regla de asignación | Ejemplo |
| ----- | ----- | ----- |
| **Crítica** | Mitiga un riesgo de producto de impacto Crítico (RP-01, RP-02, RP-03) o es camino principal de un flujo central | TC-VP-01 (solo aparecen aprobados), TC-AU-04 (endpoint protegido sin credenciales), TC-PA-02 (aprobar crea el perfil) |
| **Alta** | Función importante o validación de entrada con riesgo de datos inválidos | TC-VP-03 (buscar por nombre), TC-SR-04 (datosAdjuntos vacío) |
| **Media** | Variantes, límites y casos de borde de funciones ya cubiertas por un caso Alto o Crítico | TC-VP-12 (mayúsculas), TC-PA-14 (nombre de 256 caracteres) |
| **Baja** | Aspecto cosmético o de conveniencia | TC-IT-04 (imagen en la card) |

## Criterios de Suspensión

La **suspensión** pausa la ejecución de pruebas; no equivale a rechazar el producto.

* El backend no arranca o no es accesible en `:8080`, o PostgreSQL no conecta en `:5432`.
* Se detecta un bug **Bloqueante** que impide ejecutar más del 30 % de los casos pendientes.
* Cambia el código (nuevo commit) durante la ejecución y no se puede garantizar la versión probada.

## Criterios de Reanudación

* El bug bloqueante fue corregido y verificado por el desarrollador.
* El entorno de pruebas fue restaurado y verificado (Docker, backend y frontend corriendo).
* La base de datos fue reiniciada con los datos de prueba base DS-01.

---

## Entregables

| Entregable | Formato | Responsable |
| ----- | ----- | ----- |
| Documento Plan de Pruebas | **Google Docs**, compartido como Editor (historial de versiones visible) | Grupo 6 |
| Planilla de casos de prueba (Test Cases) | **Google Sheets**, compartida como Editor, con columnas HU / RF / CA y «Diseñado por» con el nombre de cada integrante | Grupo 6 |
| Evidencias de ejecución | Capturas / GIF enlazados desde la columna «Evidencia» de cada caso y desde la página «Evidencias» de la wiki | Grupo 6 |
| Reporte de bugs (mínimo 3) | Issues con etiqueta `bug` en GitHub, enlazadas desde la columna «Bug» de la planilla y desde la página «Reporte de bugs» de la wiki | Grupo 6 |
| Wiki con enlaces a todos los documentos | Wiki del repositorio: página Testing (índice), «Evidencias» y «Reporte de bugs». URL: https://github.com/joaquinBrassinne/locos-del-deporte/wiki/Testing | Grupo 6 |

---

## Recursos

### Requerimientos de Entornos – Hardware

| Recurso | Especificación mínima | Uso |
| ----- | ----- | ----- |
| PC / Notebook de cada tester | 8 GB RAM, procesador x64 | Ejecutar backend, frontend y Docker simultáneamente |
| Base de datos | PostgreSQL 16 en contenedor Docker, puerto 5432, local en cada PC | Persistencia de las pruebas; se reinicia con DS-01 |
| Conexión a internet | Banda ancha estable | Carga de imágenes desde URLs externas (ej. picsum.photos) y acceso a Google Docs/Sheets y a GitHub |
| Espacio en disco | 2 GB libres | Imagen de PostgreSQL + dependencias del proyecto |

### Requerimientos de Entornos – Software

| Software | Versión | Uso |
| ----- | ----- | ----- |
| Java (JDK) | 21 | Compilar y ejecutar el backend Spring Boot |
| Maven | 3.9+ | Gestión de dependencias del backend |
| Node.js | 20+ | Ejecutar el frontend con Vite |
| Docker Desktop | Última estable | Contenedor de PostgreSQL 16 |
| Google Chrome | 120+ | Ejecución y verificación de pruebas del frontend |
| TablePlus | Última estable | Inspección de la base de datos y consultas de verificación |
| Swagger UI | Incluido en Spring Boot | Ejecución de pruebas de API REST |

### Herramientas de Pruebas Requeridas

| Herramienta | Tipo | Uso específico |
| ----- | ----- | ----- |
| **Swagger UI** | Pruebas de API | Ejecutar todos los casos de los endpoints REST con autenticación Basic Auth |
| **Google Chrome DevTools** | Depuración frontend | Verificar errores de consola, CORS, red (códigos HTTP) y rendering |
| **Docker Desktop** | Infraestructura | Levantar el contenedor de PostgreSQL para las pruebas |
| **TablePlus** | Inspección de BD | Verificar que los datos se persisten correctamente tras cada prueba |
| **GitHub Issues + Wiki** | Gestión de defectos y evidencias | Reportar bugs y publicar evidencias |

### Personal

| Nombre | Rol | Responsabilidades |
| ----- | ----- | ----- |
| Joaquín Brassinne | Líder de Proyecto / Tester | Coordinación general, pruebas de integración y de API, reporte de bugs |
| Cynthia Molina | Analista / Tester | Diseño y ejecución de casos de Vista Pública |
| Leonel López | Analista / Tester | Diseño y ejecución de casos de Autenticación/Acceso y Admin |
| Damián Buscemi | Analista / Tester | Diseño y ejecución de casos de Solicitudes y Persistencia BD |

### Entrenamiento

| Área | Necesidad | Cómo se cubre |
| ----- | ----- | ----- |
| Uso de Swagger UI | Ejecución de pruebas REST con Basic Auth | Demostración práctica durante la sesión de pruebas |
| Lectura de logs de Spring Boot | Identificación de errores en consola del backend | Revisión del stack trace en conjunto por el equipo |
| Uso de TablePlus | Inspección y verificación de datos en PostgreSQL | Configuración y uso básico demostrado al inicio |
| Docker Desktop | Levantar y verificar el contenedor de la BD | Comandos `docker compose up -d` y `docker ps` documentados |

---

## Datos de Prueba Base (DS-01)

Todos los casos parten de este conjunto de datos, para que cualquier tester obtenga el mismo resultado. Se carga sobre una base limpia: `docker compose down -v && docker compose up -d`, iniciar backend, enviar las solicitudes de la tabla desde Swagger y aprobar con `AdminRoot` las marcadas APROBADO (las PENDIENTE se dejan sin aprobar).

**Clubes**

| Nombre | Dirección | Disciplinas | deporteAdaptado | Estado |
| ----- | ----- | ----- | ----- | ----- |
| Club Atlético Río Tercero | Av. San Martín 100 | Fútbol | false | APROBADO |
| Club Náutico Río Tercero | Costanera 250 | Natación | true | APROBADO |
| Club Atlético Sur | Calle Belgrano 45 | Básquet | false | APROBADO |
| Club Pendiente Uno | Calle Test 1 | Vóley | false | PENDIENTE |
| Club Pendiente Dos | Calle Test 2 | Fútbol | false | PENDIENTE |

**Deportistas**

| Nombre | Deporte | Logros | Estado |
| ----- | ----- | ----- | ----- |
| Lucía Pérez | Fútbol | Campeona Liga Regional 2025 | APROBADO |
| Mateo Gómez | Básquet | MVP Torneo Provincial 2025 | APROBADO |
| Sofía Díaz | Fútbol | Goleadora Copa Ciudad 2024 | APROBADO |
| Tomás Ruiz | Natación | Medalla de plata 2025 | APROBADO |
| Valentina Cruz | Vóley | Subcampeona Torneo Local 2025 | PENDIENTE |

**Valores esperados derivados:** clubes aprobados = 3; deportistas aprobados = 4; disciplinas distintas entre perfiles aprobados = 3 (Fútbol, Básquet, Natación); clubes con deporte inclusivo = 1.

**Credenciales de prueba:** `AdminRoot` / `locos1234`.

---

## Planificación y Organización

### Procedimientos para las Pruebas

1. **Preparación del entorno:** reiniciar la BD (`docker compose down -v && docker compose up -d`), iniciar el backend (`mvn spring-boot:run`) y el frontend (`npm run dev`), y cargar DS-01. Verificar que los tres servicios están corriendo antes de ejecutar cualquier caso.
2. **Ejecución de casos de prueba:** seguir el orden de la planilla, comenzando por los de prioridad Crítica y los `#Smoke`. Completar «Status», «Resultado obtenido», «Ejecutado por» y «Fecha» inmediatamente tras la ejecución.
3. **Captura de evidencias:** tomar captura o GIF de cada caso, subirlo a la wiki (página «Evidencias») y pegar el link en la columna «Evidencia (link)» de ese caso. Todo caso ejecutado (PASS o FAIL) debe tener su evidencia enlazada.
4. **Reporte de bugs:** ante un FAIL, crear un Issue con etiqueta `bug`, severidad según este plan y el ID del caso. Pegar el link del Issue en la columna «Bug (link a Issue)» y el número en «Comentarios».
5. **Corrección y re-ejecución:** una vez corregido el bug, re-ejecutar el caso y actualizar el status.
6. **Cierre:** completar el resumen de ejecución con los totales (PASS / FAIL / BLOCKED / NOT RUN), aplicar los criterios de aceptación y registrar la decisión.
7. **Verificación de enlaces antes de entregar:** abrir uno por uno los links de las columnas «Evidencia (link)» y «Bug (link a Issue)», y los de la wiki (páginas Testing, Evidencias y Reporte de bugs), desde una sesión sin iniciar sesión en GitHub; ningún link puede estar roto.

### Matriz de Responsabilidades

| Actividad | Joaquín (Líder) | Cynthia | Leonel | Damián |
| ----- | ----- | ----- | ----- | ----- |
| Diseño de casos de prueba | A | R | R | R |
| Ejecución de pruebas | R | R | R | R |
| Captura de evidencias | I | R | R | R |
| Reporte de bugs | A | R | R | R |
| Corrección de bugs | R | C | C | C |
| Documentación final | A | R | R | R |

*R: Responsable — A: Aprobador — C: Consultado — I: Informado*

### Cronograma

Fechas propuestas para la reentrega; se ajustan a la fecha límite definida por la cátedra.

| # | Actividad | Responsable | Inicio | Fin | Duración estimada | Depende de |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| 1 | Corrección de plan y planilla (v1.1) | Grupo 6 | 19/10/2026 | 19/10/2026 | 3 hs | — |
| 2 | Preparación del entorno y carga de DS-01 | Joaquín | 20/10/2026 | 20/10/2026 | 1 hs | 1 |
| 3 | Ejecución — Vista Pública | Cynthia | 20/10/2026 | 20/10/2026 | 1,5 hs | 2 |
| 4 | Ejecución — Solicitudes y Persistencia BD | Damián | 21/10/2026 | 21/10/2026 | 2 hs | 2 |
| 5 | Ejecución — Acceso/Autenticación y Admin | Leonel | 21/10/2026 | 21/10/2026 | 2 hs | 2 |
| 6 | Ejecución — API Clubes/Deportistas e Integración | Joaquín | 22/10/2026 | 22/10/2026 | 2 hs | 4, 5 |
| 7 | Captura de evidencias y reporte de bugs (en paralelo a la ejecución) | Grupo 6 | 20/10/2026 | 22/10/2026 | 1 hs por jornada | 3, 4, 5, 6 |
| 8 | Corrección de bugs Bloqueantes/Críticos | Grupo 6 (desarrollo) | 23/10/2026 | 23/10/2026 | 4 hs (máx. 2 hs por bug; si hay más de 2 se reprograma) | 7 |
| 9 | Re-ejecución de casos fallidos | Grupo 6 | 26/10/2026 | 26/10/2026 | 1 hs | 8 |
| 10 | Cierre: resumen de ejecución y decisión de aceptación | Joaquín | 27/10/2026 | 27/10/2026 | 1 hs | 9 |
| 11 | Entrega final y actualización de la wiki | Joaquín | 27/10/2026 | 27/10/2026 | 30 min | 10 |

### Premisas

* El backend estará funcionando correctamente en el puerto 8080 antes de iniciar las pruebas.
* El frontend estará corriendo en el puerto 5173 para los casos de interfaz.
* El contenedor Docker de PostgreSQL estará levantado y accesible en el puerto 5432.
* El admin predefinido (AdminRoot / locos1234) estará creado en la base de datos al iniciar el backend.
* La base de datos se cargará con el conjunto DS-01 antes de cada módulo.
* Todos los integrantes del equipo tienen acceso al repositorio, a la wiki y a los documentos de Google como Editor.
* Se utilizará únicamente el navegador Google Chrome para las pruebas del frontend.
* Las pruebas se ejecutarán en entorno local de desarrollo, no en producción.
* Los supuestos de la sección siguiente se confirman al ejecutar; un resultado distinto se resuelve según la regla allí indicada.

### Supuestos a Confirmar

Estos puntos se tomaron por convención del modelo o por criterio del equipo. Se documentan también en la hoja «Leyenda y supuestos» de la planilla.

| # | Supuesto | Cómo se confirma | Si el sistema difiere |
| ----- | ----- | ----- | ----- |
| 1 | Rutas `PUT /api/clubes/{id}`, `DELETE /api/clubes/{id}`, `PUT /api/deportistas/{id}` y `DELETE /api/deportistas/{id}` (convención REST) | Verificar en Swagger UI antes de ejecutar TC-API-01 a TC-API-12 | Ajustar la ruta en los casos |
| 2 | Nombres de tablas y columnas SQL: `solicitud_registro`, `club`, `deportista`, `administrador`, `motivo_rechazo`, `fecha_revision`, `perfil_creado_id`, `club_id`, `datos_adjuntos`, `deporte_adaptado` | Revisar el esquema en TablePlus | Ajustar las consultas en los casos |
| 3 | Códigos HTTP de los casos negativos: 400 (validación o estado inválido), 401 (sin credenciales o inválidas), 404 (id inexistente) | Ejecutar el caso | Decidir entre dos opciones: si el requisito exige el código esperado, es **bug** (Issue con severidad según este plan); si no lo exige, se **ajusta el caso** y se deja constancia en «Comentarios» |
| 4 | Rangos de validación: edad 1–120, nombre hasta 255 caracteres, teléfono solo con dígitos, email con formato válido | Confirmar con el Documento de Requerimientos y con el cliente | Misma regla que el punto 3 |
| 5 | Mensajes de error: los casos piden que el body de error mencione el campo (`tipo`, `edad`, `nombre`, etc.) | En la primera ejecución, copiar el mensaje exacto en «Resultado obtenido» | Fijar el mensaje exacto en «Resultado esperado» para las ejecuciones siguientes |
| 6 | Numeración de HU y CA (HU-01 a HU-10) | Comparar con el Documento de Requerimientos | Renumerar en este plan y en las columnas «HU» y «Criterio de aceptación» de la planilla |
| 7 | Datos DS-01 cargados según el procedimiento de este plan | Verificar con los conteos de «Valores esperados derivados» antes de cada módulo | No ejecutar hasta restaurar DS-01 |

---

## Dependencias y Riesgos

### Riesgos de proyecto

| Riesgo | Probabilidad | Impacto | Plan de mitigación |
| ----- | ----- | ----- | ----- |
| El backend no arranca por error de configuración en `application.properties` | Media | Alto | Verificar la contraseña de PostgreSQL y que el contenedor Docker esté corriendo antes de iniciar |
| El contenedor Docker no levanta correctamente | Baja | Alto | Ejecutar `docker logs locos_deporte_db` para diagnosticar y recrear el contenedor si es necesario |
| URLs de imágenes externas no cargan durante las pruebas | Alta | Bajo | Usar siempre URLs de `picsum.photos` para las pruebas |
| CORS bloquea las peticiones del frontend al backend | Media | Alto | Verificar `CorsConfig.java` y reiniciar el backend tras cualquier cambio |
| Un bug bloqueante impide la ejecución de múltiples casos | Media | Alto | Reportar de inmediato como Bloqueante y aplicar los criterios de suspensión |
| Falta de tiempo para completar todos los casos | Alta | Medio | Ejecutar primero los casos de riesgo de producto alto y los de prioridad Crítica |
| Cambios de último momento en el código durante las pruebas | Media | Alto | Congelar el código durante la ejecución; no hacer commits mientras se ejecutan los casos |

### Riesgos de producto (guían qué se prueba primero)

| ID | Riesgo (visto desde el usuario) | Probabilidad | Impacto | Cómo se mitiga con pruebas |
| ----- | ----- | ----- | ----- | ----- |
| RP-01 | La vista pública muestra perfiles que no fueron aprobados (pendientes o rechazados) | Media | Crítico | Casos de Vista Pública que verifican que solo aparecen aprobados (TC-VP-01, 02, 13) y de Integración (RF-12) |
| RP-02 | El único administrador queda bloqueado y nadie puede gestionar solicitudes | Baja | Crítico | Casos de acceso con credenciales válidas e inválidas; riesgo documentado en «No probar» (sin recuperación de contraseña) |
| RP-03 | Se pierden datos de una solicitud al aprobarla o rechazarla | Media | Alto | Casos de Persistencia BD que verifican `solicitud_registro` y `club`/`deportista` con SQL |
| RP-04 | Se crean perfiles duplicados al aprobar dos veces la misma solicitud | Media | Alto | Casos de transición de estados (aprobar/rechazar una solicitud que ya no está PENDIENTE) |
| RP-05 | El buscador falla o devuelve resultados incorrectos ante mayúsculas, tildes o caracteres especiales | Media | Medio | TC-VP-10, 12, 15 |
| RP-06 | Los contadores del home muestran valores que no coinciden con los datos reales | Media | Medio | TC-VP-08 con comparación contra conteos SQL |

El orden de ejecución dentro de cada módulo es: casos que mitigan riesgos de producto de impacto Crítico → resto de casos Críticos → Altos → Medios/Bajos.

---

## Referencias

| Documento | Descripción |
| ----- | ----- |
| Plan de Pruebas de Software — Grupo 6 (Google Docs) | Este documento |
| Planilla de Test Cases — Grupo 6 (Google Sheets) | Casos de prueba por módulo, con trazabilidad a HU/RF/CA |
| Wiki del repositorio — página Testing (https://github.com/joaquinBrassinne/locos-del-deporte/wiki/Testing) | Enlaces al plan, planilla, evidencias y reporte de bugs |
| Documento de Requerimientos (Actividad Entrega) | Especificación de RF, RNF e Historias de Usuario |
| Diagrama de clases del proyecto | Modelo de entidades: Club, Deportista, SolicitudRegistro, Administrador |
| IEEE 829 | Estándar de documentación de pruebas de software |
| ISTQB Foundation Level | Riesgo de proyecto vs. riesgo de producto, técnicas de diseño de casos |
| Spring Boot Documentation 3.4.x | Referencia técnica del framework backend |
| React 18 Documentation | Referencia técnica del framework frontend |

## Glosario

| Término | Definición |
| ----- | ----- |
| **TC** | Test Case — caso de prueba individual documentado |
| **HU** | Historia de Usuario — requerimiento expresado desde el punto de vista del usuario |
| **RF** | Requerimiento Funcional |
| **CA** | Criterio de Aceptación de una HU |
| **Trazabilidad** | Vínculo entre cada caso de prueba y la HU, RF y CA que verifica |
| **PASS** | El resultado obtenido coincide con el resultado esperado |
| **FAIL** | El resultado obtenido difiere del resultado esperado |
| **BLOCKED** | El caso no puede ejecutarse por una dependencia externa no resuelta |
| **NOT RUN** | El caso aún no fue ejecutado |
| **Severidad** | Gravedad de un defecto: Bloqueante, Crítica, Mayor o Menor |
| **Prioridad (del caso)** | Orden de ejecución de un caso: Crítica, Alta, Media o Baja |
| **Bug bloqueante** | Defecto que impide la ejecución de otros casos de prueba |
| **Riesgo de producto** | Posibilidad de que el producto falle de forma que perjudique al usuario; guía qué se prueba primero |
| **Riesgo de proyecto** | Posibilidad de que algo del entorno, el equipo o el cronograma impida probar |
| **Partición de equivalencia** | Técnica que agrupa entradas que el sistema trata igual y prueba un representante de cada grupo |
| **Valores límite** | Técnica que prueba los extremos de un rango de entrada |
| **Transición de estados** | Técnica que prueba los cambios válidos e inválidos de estado de una entidad |
| **Tabla de decisión** | Técnica que prueba combinaciones de condiciones y sus resultados |
| **Smoke test** | Conjunto mínimo de pruebas que verifican que el sistema arranca y sus funciones básicas operan |
| **Regresión** | Ejecución de pruebas previas para verificar que cambios recientes no rompieron funcionalidades existentes |
| **DS-01** | Conjunto de datos de prueba base definido en este plan |
| **Basic Auth** | Mecanismo de autenticación HTTP que envía usuario:contraseña codificados en Base64 en el header Authorization en cada petición |
| **CORS** | Cross-Origin Resource Sharing — política del navegador que restringe peticiones entre dominios distintos |
| **Polling** | Consulta periódica a la API cada N segundos para detectar nuevos datos sin recargar la página |
| **datosAdjuntos** | Campo JSON stringificado en `SolicitudRegistro` que contiene el formulario completo del club o deportista |
| **RACI** | Matriz de responsabilidades: Responsable, Aprobador, Consultado, Informado |
| **DTO** | Data Transfer Object — objeto usado para transferir datos entre capas de la aplicación |
| **@JsonIgnoreProperties** | Anotación de Jackson que permite deserializar JSON ignorando campos no definidos en el DTO |
