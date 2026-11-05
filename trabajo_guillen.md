### Para preparar el cierre de proyecto de Verificación y Validación.
--- 
Fecha de entrega Viernes 6 de noviembre.
--- 

Condiciones para aprobar el parcial 2:
 controlar en el repositorio los requisitos indispensables. 

---
Ejemplo de cómo gestionar la Wiki para documentar el Testing:
https://github.com/ISPC-PROYECTOS/GranjaNV/wiki/Testing.md 

---
Registro de Bugs, reporte y evidencias 
https://github.com/ISPC-PROYECTOS/GranjaNV/issues?q=is%3Aissue+state%3Aclosed 


## Demostración/ Review en video: 
Puntos a tener en cuenta, de acuerdo a la consigna solicitada en el parcial 2:
La importancia de Testing. Fases. Ciclo del testing. Buenas prácticas.
Sobre la decisión de automatización: eligieron automatizar expliquen con sus propias palabras el criterio de costo-beneficio que usaron para decidir qué sí y qué no automatizar, y den un ejemplo de un caso que decidieron dejar manual a propósito, y por qué.
Sobre un hallazgo de accesibilidad: elijan uno de los Issues
Suite de Playwright y la colección de Postman
no “demostrar que todo funciona”, sino generar las condiciones para que lo que no funciona salga a la luz rápido y barato.
Tests de seguridad/ciberseguridad

---
1.    Demostración 15 minutos como máximo: cada integrante muestra un caso de testing diferente, en no más de 2 a 3 minutos. Para que los casos no se repitan, se sugiere distribuirlos así:
–    un caso manual con su evidencia y su trazabilidad hasta la historia de usuario;
–    una prueba de la suite de Playwright;
–    una prueba de la colección de Postman;
–    un hallazgo de accesibilidad registrado en Issues;
–    una prueba de seguridad o ciberseguridad. 

---

### Wiki
☐    Plan de pruebas: alcance (qué se prueba y qué no), estrategia, tipos de prueba, entorno (versión de SO, dispositivo o emulador, URL de la API) y criterios de entrada y salida.
---
☐    Matriz de trazabilidad (o página equivalente) que vincule cada historia de usuario con sus casos de prueba y sus defectos.
---
☐    Informe de cierre por sprint: casos ejecutados, aprobados, fallidos y bloqueados; defectos abiertos y cerrados; lecciones aprendidas.
## Issues
☐    Plantillas diferenciadas para historia de usuario (US), caso de prueba (TC) y reporte de defecto (BUG).
---
☐    Cada caso de prueba con ID, precondiciones, datos de prueba, pasos, resultado esperado, resultado obtenido, estado y evidencia.
---
☐    Cada defecto con pasos de reproducción, resultado esperado vs. obtenido, entorno, severidad, prioridad, evidencia y referencia al caso de prueba que lo detectó.
---
☐    Labels que distingan tipo: test-case, bug, accesibilidad, otros
---
## Evidencia
☐    Una evidencia por cada test ejecutado (captura o grabación del resultado obtenido), adjunta en el issue del caso de prueba. No se acepta una evidencia por sprint.
---
☐    Un caso marcado como Aprobado sin evidencia se considera no ejecutado.
Interfaz
---
☐    Campos obligatorios identificados con el estándar: asterisco * con su referencia (" Campo obligatorio") o el término Requerido. Un campo rotulado Recomendado* sugiere al usuario, pero no puede bloquear el envío.