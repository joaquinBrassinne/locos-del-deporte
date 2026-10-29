# 🏆 Locos del Deporte - Río Tercero

**Locos del Deporte** es una plataforma integral diseñada para potenciar la visibilidad de deportistas, clubes y disciplinas deportivas menos difundidas en la ciudad de Río Tercero. El objetivo es centralizar la información deportiva local, facilitando el contacto entre instituciones, atletas y la comunidad.

---

## 🚀 Propósito del Proyecto
En ciudades con gran actividad deportiva como la nuestra, muchas veces el foco está en los deportes mayoritarios. Este software busca:
* **Promover** deportes emergentes o con menos cobertura mediática.
* **Conectar** a los clubes con nuevos socios a través de un mapa interactivo.
* **Proveer** un espacio profesional para que los jugadores muestren sus logros y trayectoria.

---

## 🛠️ Tecnologías y Herramientas
Para el modelado y planificación de este sistema se utilizaron:
* **PlantUML**: Para la creación de diagramas de Casos de Uso y de Clases.
* **GitHub Issues**: Para el seguimiento y gestión de Historias de Usuario (Metodología Ágil).
* **Visual Studio Code**: Entorno de desarrollo para la documentación y modelado.

---

## 📊 Documentación de Arquitectura

El proyecto cuenta con una sólida base de documentación técnica que puedes encontrar en la carpeta `/docs`:

* **Diagramas de Casos de Uso:** Representan la interacción de Administradores, Jugadores, Clubes y Usuarios con el sistema.
* **Diagrama de Clases:** Define la estructura de datos, atributos y relaciones (Herencia de usuarios, gestión de eventos y solicitudes).

---

## 📋 Gestión del Proyecto (Backlog)
Este repositorio utiliza **GitHub Issues** para gestionar las Historias de Usuario. Cada Issue representa una funcionalidad específica siguiendo el formato:
> *"Como [rol], quiero [acción], para [beneficio]."*

### Principales Módulos:
1. **Gestión de Usuarios:** Acceso diferenciado por roles (Admin, Jugador, Club, Usuario Común).
2. **Registro y Verificación:** Proceso de validación de identidad para instituciones.
3. **Exploración:** Buscador de deportistas, integración con Google Maps y agendas de eventos.

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

---

## 👥 Autores
* **Joaquín Brassinne** - *Desarrollo y Documentación* - [MyGitUser](https://github.com/joaquinBrassinne)
* **Leo Lopez** - *Desarrollo y Documentacion* - [MyGitUser](https://github.com/leolopez373)
* **Damian Buscemi** - *Desarrollo y Documentacion* - [MyGitUser](https://github.com/EDAN13512)

---
*Proyecto académico desarrollado para la universidad provincial de Cordoba*
