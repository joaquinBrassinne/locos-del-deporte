# Pruebas de API con Postman / Newman

Colección Postman v2.1 que automatiza los casos de la planilla `docs/Planilla_Test_Case_CrazySports_v1_10.xlsx`:
hojas **API Clubes y Deportistas** (TC-API-01 a TC-API-12) y **Autenticación** (TC-AU-01 a TC-AU-10), más los
casos de validación 400 de las hojas Solicitud de Registro y Panel de Administración (TC-SR-07, TC-PA-10, TC-PA-11,
TC-PA-13, TC-PA-16).

Los resultados esperados salen de la planilla y de los criterios de aceptación (CA), **no** de lo que el sistema
devuelve hoy: si el backend no cumple, el request falla y se informa como bug (ver `POSIBLES-BUGS.md`).

## Archivos

| Archivo | Contenido |
| :--- | :--- |
| `CrazySports.postman_collection.json` | Colección con carpetas **Autenticación**, **Clubes**, **Deportistas** y **Validaciones 400** |
| `entorno-local.postman_environment.json` | Variables `baseUrl`, `adminUser`, `adminPassword`, `idSolicitud`, `idClub`, `idDeportista` |
| `POSIBLES-BUGS.md` | Fallos observados contra el backend real, sin modificar los esperados |
| `reports/` | Reporte HTML generado (ignorado por git) |

## Requisitos

- Backend en `http://localhost:8080` y PostgreSQL arriba (`docker compose up -d`, luego `./mvnw spring-boot:run` en `Backend/`).
- Node.js 20+ y **Newman 6 o superior** (los requests CLEANUP usan `pm.execution.skipRequest()`).
- Para TC-AU-05 y TC-AU-10 la BD debe tener cargado **DS-01** (3 clubes y 4 deportistas aprobados, ver el plan de pruebas). Sobre una BD limpia se carga con `node tests/postman/seed-ds01.js` (usa la API; variables opcionales `BASE_URL`, `ADMIN_USER`, `ADMIN_PASSWORD`). El workflow de CI hace exactamente eso antes de Newman. El resto de los casos no depende de DS-01: crean y borran sus propios datos.
- Si cambian las credenciales del admin (`app.admin.*`), actualizar `adminUser` / `adminPassword` en el entorno.

## Cómo ejecutar

Instalación global (una vez):

```bash
npm install -g newman newman-reporter-htmlextra
```

Ejecución con reporte HTML (desde la raíz del repo):

```bash
newman run tests/postman/CrazySports.postman_collection.json \
  -e tests/postman/entorno-local.postman_environment.json \
  -r cli,htmlextra --reporter-htmlextra-export tests/postman/reports/reporte.html
```

Atajo equivalente: `npm install` y luego `npm run test:api` (usa el Newman de `devDependencies`).

En Postman: importar los dos JSON, elegir el entorno «CrazySports - Local» y usar el Collection Runner.

## Cómo está armada

- Autenticación Basic a nivel colección con `{{adminUser}}` / `{{adminPassword}}`; los casos sin credenciales usan «No Auth» y los de contraseña incorrecta sobreescriben el auth del request.
- Cada request se llama con el ID de la planilla (`TC-API-02 Actualizar un club sin credenciales`). Los pasos auxiliares llevan el prefijo del caso y `SETUP`, `CLEANUP` o `Verificar`.
- El alta de clubes y deportistas pasa por `POST /api/solicitudes` + `POST /api/admin/club|deportista/{idSolicitud}`; los ids se guardan en `idSolicitud`, `idClub` e `idDeportista` para encadenar.
- Cada flujo usa su propio club o deportista, así que un fallo en un caso destructivo no arrastra a los demás. Cada flujo termina con un `CLEANUP` que elimina lo creado.
- Todos los requests verifican: código HTTP, campos del body, tiempo de respuesta < 1000 ms y cabecera `Content-Type` (`application/json` si hay body; en 401 se verifica además `WWW-Authenticate: Basic`, y en 204 que el body esté vacío).

## Limitaciones conocidas

- La API no tiene `DELETE` de solicitudes: las solicitudes creadas quedan en la tabla `solicitudes_registro` (APROBADO, o RECHAZADO si el flujo las cerró). Para limpiarlas hay que usar SQL:

  ```sql
  DELETE FROM solicitudes_registro WHERE datos_adjuntos LIKE '%Club Test %' OR datos_adjuntos LIKE '%Deportista Test %';
  ```

- No automatizables por API: TC-AU-11 (reiniciar backend con `DELETE FROM admin`) y las verificaciones SQL de la planilla (se reemplazan por `GET` equivalentes).
- Si un caso destructivo falla a mitad de camino (por ejemplo un `DELETE` sin credenciales que sí borra), el `CLEANUP` correspondiente se saltea o tolera el estado resultante.
