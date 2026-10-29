## Issue que cierra

<!-- Un PR cierra un Issue. Reemplazar N por el número. -->
Closes #N

## Capa

<!-- Marcar una. -->
- [ ] Backend (JUnit)
- [ ] API (Newman / Postman)
- [ ] E2E (Playwright)
- [ ] Accesibilidad (axe / Lighthouse)

## Tests agregados o modificados

<!-- Un test por línea, en formato archivo::nombre. Ejemplos:
- Backend/src/test/java/com/pp2/crazySports/service/club/ClubServiceTest.java::ConsultasTests.debeBuscarClubesPorNombre_cuandoCoincide
- tests/postman/CrazySports.postman_collection.json::TC-API-02 Actualizar un club sin credenciales
- tests/e2e/specs/clubes.spec.ts::TC-VP-01 Lista exactamente los 3 clubes aprobados, sin login y sin pendientes
-->
-
-

## Resultado de la ejecución

<!-- Pegar el comando que corriste, el resumen (pasan / fallan) y adjuntar el reporte:
captura del resumen, link al artifact del pipeline (Actions → ejecución → Artifacts) o link a Drive. -->
- Comando: `...`
- Resultado: `N pasan / N fallan`
- Reporte adjunto: <!-- link o imagen -->

## Checklist

- [ ] Revisado por otro integrante
- [ ] Ejecución en verde
- [ ] Datos de prueba limpiados

<!--
Aclaraciones:
- "Ejecución en verde": todos los tests de este PR pasan. Si un test falla porque detecta un bug real,
  no se cambia el esperado: se enlaza el Issue con la etiqueta `bug` en este PR y ese test no pasa a Done
  hasta que el bug esté corregido.
- "Datos de prueba limpiados": cada test elimina lo que crea (clubes, deportistas). La API no tiene DELETE de
  solicitudes; las que queden se cierran o se borran con el SQL de la guía de pruebas (tests/e2e/README.md).
- Definición de Done en el Kanban: un test pasa a Done solo con el PR mergeado a la rama principal,
  revisado por otro integrante y con la ejecución en verde (ver README).
-->
