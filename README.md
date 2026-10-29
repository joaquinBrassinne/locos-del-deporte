**CrazySports**

**Resumen del Proyecto:**

Plataforma de software destinada a centralizar y visibilizar la información de todas las instituciones deportivas de Río Tercero y sus jugadores destacados. Se ofrece información detallada de los clubes, sus categorías y la ubicación precisa de las instalaciones.

**Descripción Detallada:**

El software "Locos del Deporte" busca ser el punto central de la comunidad deportiva de Río Tercero, mejorando significativamente la visibilidad tanto de los clubes como de sus jugadores a través de una plataforma moderna y accesible.

La página principal funcionará como un muro de publicaciones dinámico y altamente interactivo, mostrando en tiempo real las novedades, resultados, eventos y anuncios de diversas instituciones, clubes y disciplinas. El contenido abarcará un amplio espectro de actividades, incluyendo tanto deportes físicos tradicionales como deportes mentales o de estrategia (ej. ajedrez), promoviendo la inclusión de todas las áreas competitivas.

Los visitantes y usuarios registrados tendrán acceso a una potente funcionalidad de búsqueda avanzada. Esto les permitirá encontrar información específica y detallada sobre un deporte en particular, una institución, o incluso un jugador destacado. La información será cargada, gestionada y mantenida de forma directa por los propios clubes, garantizando su precisión y actualidad.

Entre las funcionalidades clave para la interacción y localización, la plataforma integra un servicio de Google Maps que no solo mostrará la ubicación exacta de cada institución deportiva, sino que también podrá ofrecer datos relevantes como horarios de atención o disponibilidad de canchas. Adicionalmente, para aquellas instituciones que ya poseen presencia digital, se facilitará un botón de "Más Información" que actuará como enlace directo para redirigir al usuario a la URL externa del sitio web oficial de la institución.

Para una navegación eficiente y segmentada, todo el contenido estará organizado meticulosamente en secciones específicas: Instituciones, para la información general de los entes; Clubes, detallando sus sedes y actividades; Disciplinas, organizadas por tipo de deporte; Jugadores, destacando a los jugadores locales; Deportes Inclusivos, con foco en actividades adaptadas (ej. para personas con discapacidades cognitivas); y Deportes Mentales o de Estrategia.

---

## 🧪 Tests automáticos en Pull Requests

El workflow `.github/workflows/tests.yml` corre en cada pull request: levanta PostgreSQL 16 y el backend, ejecuta la colección de Newman (`tests/postman`) y los tests de JUnit con cobertura JaCoCo. El job **falla si cualquier test falla** (hoy hay tests rojos a propósito que documentan bugs conocidos, ver `docs/tests-backend.md` y `tests/postman/POSIBLES-BUGS.md`), pero los reportes se suben siempre.

### Cómo descargar los reportes

1. En el PR, pestaña **Checks** (o **Actions** → ejecución del workflow *Tests*).
2. Bajar hasta la sección **Artifacts** del resumen de la ejecución.
3. Descargar el `.zip` que interese y descomprimirlo:

| Artifact | Contenido | Cómo verlo |
| :--- | :--- | :--- |
| `newman-report` | `reporte.html` de la colección Postman (htmlextra) | Abrir `reporte.html` en el navegador |
| `jacoco-report` | Cobertura de JUnit | Abrir `index.html` en el navegador |
| `junit-surefire-y-backend-log` | XML/TXT de Surefire y `backend.log` | Para ver el detalle de cada test fallido o por qué no arrancó el backend |
| `playwright-report` | `playwright-report/`, trace y video de `test-results/` (solo si hay tests E2E) | `npx playwright show-report playwright-report` o `npx playwright show-trace <trace.zip>` |

Con la CLI de GitHub: `gh run list --workflow=tests.yml` y luego `gh run download <run-id> -n newman-report`.

Los artifacts se conservan 14 días. Para correr lo mismo en local: ver `tests/postman/README.md` y `cd Backend && ./mvnw clean test`.

### Definición de Done en el Kanban

> **Un test pasa a Done en el Kanban solo cuando su PR está mergeado a la rama principal, fue revisado por otro integrante del equipo y la ejecución está en verde.**

Cada PR usa la plantilla `.github/pull_request_template.md`: Issue que cierra (`Closes #N`), capa, tests agregados (`archivo::nombre`), resultado de la ejecución con el reporte adjunto, y el checklist (revisado por otro integrante, ejecución en verde, datos de prueba limpiados). Si un test falla porque detecta un bug real, no se cambia el esperado: se enlaza el Issue `bug` y el test no pasa a Done hasta que el bug se corrija.
