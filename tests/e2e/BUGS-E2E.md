# Bugs detectados por la suite E2E

Ejecución del 29/10/2026 (Chromium, Playwright 1.64) contra backend y frontend reales con DS-01 cargado en una BD aislada: **58 tests, 55 pasan, 3 fallan** (con 1 reintento cada uno; los 3 fallan también en el reintento). Los resultados esperados **no se modificaron**. Al terminar, la BD quedó con 3 clubes y 4 deportistas (la limpieza funcionó).

Evidencia (screenshot, video y trace del reintento) en `evidencia-bugs/<id>/`. Para ver un trace: `npx playwright show-trace tests/e2e/evidencia-bugs/<id>/trace.zip`.

| ID | Test | Esperado | Obtenido | Sev. sugerida |
| :-: | :--- | :--- | :--- | :---: |
| E2E-01 | **TC-IT-01** El club aprobado aparece en /clubes ya abierto, sin recargar (hasta 30 s) | La card aparece sin recargar (planilla: «sin recargar… hasta 30 s») | A los 30 s: 0 cards con el nombre del club. Aparece recién al recargar | Mayor (si es requisito) |
| E2E-02 | **TC-IT-02** El deportista aprobado aparece en /deportistas ya abierto, sin recargar | Ídem para deportistas | Ídem: 0 cards tras 30 s | Mayor (si es requisito) |
| E2E-03 | **TC-VP-04** Mensaje de sin resultados exacto | `No se encontraron clubes.` (con punto, CA-3.3 / TC-VP-04) | `No se encontraron clubes` (sin punto) | Menor |

## Detalle

### E2E-01 y E2E-02 · La UI no se actualiza sola (ya conocido: TC-IT-01 y TC-IT-02 FAIL en la planilla)
Causa en el código (`Frontend/src/hooks/useClubes.ts`, `useDeportistas.ts`): el listado se descarga **una sola vez al montar la página** (`useEffect` sin polling ni refetch). Lo comprobé con los tests que sí pasan: con la misma aprobación, al abrir/recargar la página la card aparece (TC-IT-01 y TC-IT-02 «aparece en /clubes con sus datos», variantes con `POST /api/admin/...` y `PATCH /api/solicitudes/{id}/aprobar`). Es decir que el alta funciona y lo que falta es el refresco.

La propia planilla dice «confirmar con el equipo si la actualización sin recargar es requisito; si no lo es, corregir el resultado esperado». Esa decisión es del equipo; no toqué el esperado. Si se decide que no es requisito, estos dos tests deben pasar a recargar la página antes de verificar.

### E2E-03 · Falta el punto final en el mensaje (cosmético)
El heading del estado vacío de `/clubes` es `No se encontraron clubes` (se ve en mayúsculas por CSS). El esperado de la planilla (TC-VP-04, TC-VP-13, TC-VP-15, TC-VP-16, TC-IT-06) y de CA-3.3 lleva punto final. Ojo: la planilla registró como PASS el texto sin punto en su ejecución, así que el esperado y el resultado ya eran inconsistentes. Solo este test exige el texto exacto; el resto de los casos de «sin resultados» verifican el mensaje con `/No se encontraron clubes/` para que un detalle cosmético no ponga en rojo decenas de tests. Lo mismo vale para «No se encontraron deportistas».

## Observaciones que no son bugs de los casos

- **Resultados de la planilla vs. esta ejecución:** la planilla marca PASS varios casos con observaciones que no coinciden con DS-01 (por ejemplo TC-VP-07: «No se encontraron deportistas» para «Fútbol», o TC-VP-03 con 1 card). Con DS-01 cargado exactamente como describe el plan, esos casos **pasan** con el código actual (TC-VP-03, 05, 06, 07, 09, 10, 11, 12, 14, 15, 16). La planilla se ejecutó contra una BD distinta (figuran «Polideportivo Municipal» y «Club Sportivo 9 de Julio»); conviene reejecutarla con DS-01.
- **Accesibilidad / testabilidad:** el switch «Deporte Inclusivo / Adaptado» es un `<div onClick>` dentro de un `<label for="toggle-adaptado">` que apunta a un id inexistente. No tiene rol (`switch`), ni estado accesible (`aria-checked`), ni se activa con teclado.
- **Dependencia de `repairEncoding`:** el frontend «repara» texto con reemplazos fijos (`Atlético`, `Fútbol`…), señal de un problema de codificación aguas arriba; no afecta a DS-01.
