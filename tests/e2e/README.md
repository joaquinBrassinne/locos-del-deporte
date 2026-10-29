# Tests E2E con Playwright (TypeScript)

Tres flujos críticos de la UI (HU-01, 02, 03, 04, 07, 08, 09) con Page Object Model. Los resultados esperados salen de la planilla `docs/Planilla_Test_Case_CrazySports_v1_10.xlsx` y de los criterios de aceptación del plan v1.1, **no** de lo que el sistema devuelve hoy.

| Spec | Flujo | Casos de la planilla |
| :--- | :--- | :--- |
| `specs/clubes.spec.ts` | 1 · Listar y buscar clubes | TC-VP-01, 03, 04, 11, 12, 13, 14, 15 |
| `specs/inclusivo-y-deportistas.spec.ts` | 2 · Filtro «Deporte Inclusivo» y búsqueda de deportistas sin tilde | TC-VP-02, 04, 05, 06, 07, 10, 14, 15, 16 |
| `specs/alta-por-api.spec.ts` | 3 · Alta por API (solicitud + aprobación) y verificación en la UI | TC-IT-01, 02, 03, 06 |
| `specs/home.spec.ts` | Estadísticas y pills del home | TC-VP-08, 09 |

Page Objects en `pages/` (`HomePage`, `ClubesPage`, `DeportistasPage`; las dos últimas comparten `ListadoPage`). El fixture `fixtures/api.ts` crea datos por API (solicitud + aprobación con el admin) y los **elimina al terminar cada test, aunque falle**.

## Requisitos

- Backend en `http://localhost:8080` y frontend en `http://localhost:5173` (`npm run dev` en `Frontend/`; si no está levantado, Playwright lo arranca con `webServer`).
- BD **limpia con DS-01** (`node tests/postman/seed-ds01.js`): varios casos esperan exactamente 3 clubes y 4 deportistas aprobados.
- `npm install` en la raíz y `npx playwright install chromium`.
- Variables opcionales: `BASE_URL`, `API_URL`, `ADMIN_USER`, `ADMIN_PASSWORD`.

## Ejecutar

```bash
npm run test:e2e                 # toda la suite (1 worker, en orden)
npx playwright test -c tests/e2e specs/clubes.spec.ts
npx playwright test -c tests/e2e -g "TC-VP-12"
npm run test:e2e:report          # abre tests/e2e/playwright-report
```

Configuración (`playwright.config.ts`): `baseURL` http://localhost:5173, `trace: 'on-first-retry'` (con `retries: 1`, todo fallo real genera trace), `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'` (el equivalente de «only-on-failure» para video) y reporter `html`. Los artefactos de los fallos quedan en `tests/e2e/test-results/` y el reporte en `tests/e2e/playwright-report/` (ambos ignorados por git).

## Diseño de los datos de búsqueda

Clases de equivalencia (coincide con nombre / disciplina / nada; con y sin tilde; mayúsculas y minúsculas; entradas especiales) y valores límite del largo del término (vacío, solo espacios, 1 carácter, 300 caracteres). Ver las tablas `casos` de cada spec.

## Limitaciones

- La API no tiene `DELETE` de solicitudes: las solicitudes de los tests quedan en `solicitudes_registro` (APROBADO, o RECHAZADO con motivo `limpieza-e2e` si seguían pendientes). Los clubes y deportistas sí se eliminan. SQL de limpieza: `DELETE FROM solicitudes_registro WHERE datos_adjuntos LIKE '%E2E %';`
- El toggle «Deporte Inclusivo» es un `<div>` sin rol ni `data-testid`, por eso `ListadoPage` lo ubica con `label[for="toggle-adaptado"] > div`. Si cambia el markup, se rompe ese locator.
- `/solicitud` y `/admin` **sí existen y están conectadas al backend** (el plan v1.1 las dejaba fuera de alcance), pero no se cubren acá. El flujo 3 usa la API, como se pidió.

## Bugs detectados

Ver `BUGS-E2E.md` y `evidencia-bugs/` (screenshot, video y trace de cada fallo).
