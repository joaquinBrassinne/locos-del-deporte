# Informe de accesibilidad — Locos del Deporte (CrazySports)

Fecha de las mediciones: 29/10/2026 · Frontend: Vite + React 19 · Navegador: Chromium (Playwright 1.64) · axe-core 4.14.0 (`@axe-core/playwright` 4.14) · Lighthouse 13.6.0

> **Alcance de este informe.** Las herramientas automáticas detectan solo una parte de los problemas de accesibilidad (axe: criterios que se pueden decidir por código). **Nada de lo que sigue reemplaza la revisión humana con teclado y lector de pantalla.** El checklist de la sección 5 está **sin marcar** a propósito: lo debe completar una persona. Cuando una casilla tiene una pista (`→ H-0x`), es solo una referencia a un hallazgo ya documentado, no una verificación hecha.

## 1. Cómo se midió

| Qué | Cómo | Dónde quedó |
| :--- | :--- | :--- |
| axe | `npm run test:a11y` (8 specs en `tests/e2e/specs/a11y/`, uno por pantalla; etiquetas `wcag2a`, `wcag2aa`, `wcag22aa`). Corre sobre el dev server (`:5173`) con DS-01 cargado | `tests/a11y/reports/axe-*.json` (resultado completo de cada estado) |
| Lighthouse | `node tests/a11y/lighthouse.mjs` (escritorio y móvil, categorías Accesibilidad y Rendimiento) sobre el **build de producción** (`vite preview`, `:4173`) | `tests/a11y/reports/lighthouse-<pantalla>-<desktop\|mobile>.report.html` |
| Diagnóstico de apoyo | `node tests/a11y/diagnostico-manual.mjs`: idioma, títulos, encabezados, landmarks, reflow a 640 px (equivale a 200 % de zoom sobre 1280 px), foco y nombres accesibles | `tests/a11y/reports/diagnostico-manual.json` |

Estados auditados con axe: Home, `/clubes` (listado, con el modal abierto y sin resultados), `/deportistas` (ídem), `/buscar`, `/mapa`, `/solicitud` (formulario de club, de deportista y con errores de validación), `/login` (normal y con error) y `/admin` (solicitudes y gestión de perfiles, con sesión).

Los specs de axe **fallan mientras haya violaciones**: el esperado es 0, no lo que el sistema devuelve hoy.

### Comandos de Lighthouse

CLI (una pantalla; cambiar la URL y el nombre del archivo):

```bash
# Escritorio
npx lighthouse http://localhost:4173/clubes --preset=desktop --only-categories=accessibility,performance \
  --output=html --output-path=tests/a11y/reports/lighthouse-clubes-desktop.html --chrome-flags="--headless=new"

# Móvil (emulación por defecto de Lighthouse)
npx lighthouse http://localhost:4173/clubes --form-factor=mobile --only-categories=accessibility,performance \
  --output=html --output-path=tests/a11y/reports/lighthouse-clubes-mobile.html --chrome-flags="--headless=new"
```

Todas las pantallas públicas, en ambos modos, con HTML y JSON: `npm run a11y:lighthouse` (necesita el build en `:4173`: `cd Frontend && npm run build && npm run preview -- --port 4173`).

Chrome DevTools: F12 → pestaña **Lighthouse** → Mode *Navigation* → Device *Desktop* o *Mobile* → marcar *Accessibility* y *Performance* → **Analyze page load** → menú ⋮ → *Save as HTML*. **`/admin` se mide así**, después de iniciar sesión en `/login`: Lighthouse CLI no conserva `localStorage` y termina auditando `/login` (lo comprobé: el reporte quedó en `/login`, por eso `/admin` no figura en la tabla 3).

## 2. Resultados de axe

18 violaciones (reglas) en 16 estados; solo dos reglas distintas:

| Estado (archivo en `tests/a11y/reports/`) | Reglas con violación | Detalle (impacto × nodos) | Reglas OK | Por revisar |
| :--- | :-: | :--- | :-: | :-: |
| `axe-home.json` | 1 | `color-contrast` (serious) × 6 | 20 | 1 |
| `axe-clubes.json` | 1 | `color-contrast` (serious) × 6 | 20 | 1 |
| `axe-clubes-modal.json` | 2 | `button-name` (**critical**) × 1<br>`color-contrast` (serious) × 6 | 20 | 1 |
| `axe-clubes-sin-resultados.json` | 1 | `color-contrast` (serious) × 3 | 20 | 1 |
| `axe-deportistas.json` | 1 | `color-contrast` (serious) × 3 | 20 | 1 |
| `axe-deportistas-modal.json` | 2 | `button-name` (**critical**) × 1<br>`color-contrast` (serious) × 3 | 20 | 1 |
| `axe-deportistas-sin-resultados.json` | 1 | `color-contrast` (serious) × 3 | 20 | 1 |
| `axe-buscar.json` | 1 | `color-contrast` (serious) × 6 | 20 | 1 |
| `axe-mapa.json` | 1 | `color-contrast` (serious) × 3 | 20 | 1 |
| `axe-solicitud-club.json` | 1 | `color-contrast` (serious) × 10 | 26 | 0 |
| `axe-solicitud-deportista.json` | 1 | `color-contrast` (serious) × 7 | 27 | 0 |
| `axe-solicitud-errores.json` | 1 | `color-contrast` (serious) × 9 | 26 | 0 |
| `axe-login.json` | 1 | `color-contrast` (serious) × 4 | 15 | 1 |
| `axe-login-error.json` | 1 | `color-contrast` (serious) × 7 | 15 | 0 |
| `axe-admin-solicitudes.json` | 1 | `color-contrast` (serious) × 15 | 14 | 0 |
| `axe-admin-gestion.json` | 1 | `color-contrast` (serious) × 6 | 13 | 0 |

«Por revisar» (*incomplete*) son nodos donde axe no pudo decidir el contraste (texto sobre imágenes/degradados, por ejemplo el `<h1>` del hero): requieren revisión humana.

## 3. Resultados de Lighthouse (build de producción)

| Pantalla | Accesibilidad escritorio | Accesibilidad móvil | Rendimiento escritorio | Rendimiento móvil | Auditorías de accesibilidad fallidas |
| :--- | :-: | :-: | :-: | :-: | :--- |
| `/` | 96 | 96 | 99 | 87 | `color-contrast` |
| `/clubes` | 93 | 93 | 99 | 95 | `color-contrast`, `heading-order` |
| `/deportistas` | 93 | 93 | 95 | 99 | `color-contrast`, `heading-order` |
| `/buscar` | 95 | 95 | 100 | 93 | `color-contrast` |
| `/mapa` | 96 | 96 | 99 | **81** | `color-contrast` |
| `/solicitud` | 96 | 96 | 100 | 96 | `color-contrast` |
| `/login` | 93 | 95 | 100 | 99 | `color-contrast` |
| `/admin` | no medido (requiere sesión; ver sección 1) | | | | |

Rendimiento, valores a mirar (móvil): `/` TBT 500 ms (Rendimiento 87); `/mapa` LCP 3,9 s (81). CLS por encima de 0,1 en `/deportistas` escritorio (0,134), `/buscar` móvil (0,155) y `/solicitud` móvil (0,103). El rendimiento no es un hallazgo de accesibilidad; se informa porque se pidió. Una puntuación alta de Lighthouse en accesibilidad **no** implica conformidad con WCAG: solo cubre las reglas automáticas.

## 4. Hallazgos (listos para convertir en Issues con la etiqueta `accesibilidad`)

Severidad según la escala del plan de pruebas v1.1 (Bloqueante / Crítica / Mayor / Menor); es una sugerencia, la decide el equipo. Los hallazgos H-01, H-02 y H-06 los confirma axe, y la parte de `heading-order` de H-10, Lighthouse; el resto surge del diagnóstico de apoyo (`diagnostico-manual.json`) o de leer `index.html`, y cada uno indica cómo reproducirlo.

### H-01 · Contraste insuficiente del texto secundario en todas las pantallas
- **Pantalla:** todas (Home, `/clubes`, `/deportistas`, `/buscar`, `/mapa`, `/solicitud`, `/login`, `/admin`).
- **Criterio:** WCAG 1.4.3 Contraste (mínimo), AA.
- **Severidad sugerida:** Mayor.
- **Evidencia (axe):** la clase `text-neutral-500` (`#737373`) da 3,5 a 4,15:1 sobre los fondos oscuros (mínimo 4,5:1). Combinaciones medidas: `#737373` sobre `#0b0b0b` = 4,15 (14 px, 48 nodos); sobre `#161616` = 3,81 (12 px, 26 nodos y 10 px, 7 nodos); sobre `#121212` = 3,95; sobre `#1f1f1f` = 3,47; sobre `#0c0c0c` = 4,12. Ejemplos: «Sugerir Deportista (próximamente)», «Institución deportiva registrada en Río Tercero.», «Río Tercero, Córdoba, Argentina», textos de ayuda del formulario, «pendientes de revisión» y «Gestión Institucional» en `/admin`.
- **Pasos para reproducir:** `npm run test:a11y` y abrir `tests/a11y/reports/axe-home.json` → `violations[0]`; o abrir `/clubes` en Chrome DevTools → inspeccionar «Institución deportiva registrada…» → el selector de color muestra la relación de contraste.
- **Arreglo sugerido:** reemplazar `text-neutral-500` por `text-neutral-400` (`#a3a3a3`, ≈ 6,5:1 o más sobre estos fondos según mi cálculo; confirmar con axe tras el cambio) para el texto que transmite información. Los placeholders también usan `placeholder:text-neutral-500`: revisarlos (1.4.3 aplica al texto del placeholder).

### H-02 · `/login`: texto tipado casi invisible, botón y mensaje de error con poco contraste
- **Pantalla:** `/login`.
- **Criterio:** WCAG 1.4.3, AA.
- **Severidad sugerida:** Mayor (el administrador no ve lo que escribe).
- **Evidencia (axe, `axe-login-error.json`):** el texto del campo Usuario es `#e5e5e5` sobre fondo `#ffffff` = **1,25:1** (el `<input>` no define color y hereda el gris claro del `body`); botón «Ingresar» blanco sobre `#3b82f6` = 3,67:1; mensaje de error `#ef4444` sobre blanco = 3,76:1.
- **Pasos para reproducir:** ir a `/login`, escribir en «Usuario»: el texto se ve casi blanco sobre blanco. Enviar credenciales inválidas: el mensaje rojo tiene poco contraste.
- **Arreglo sugerido:** fijar `color` oscuro en los `<input>` (por ejemplo `#111827`); botón con fondo `#2563eb` (≈ 5,2:1 con blanco); mensaje de error con `#b91c1c` o más oscuro (> 4,5:1 sobre blanco).

### H-03 · `/login`: campos sin etiqueta (solo placeholder)
- **Pantalla:** `/login`.
- **Criterio:** WCAG 3.3.2 Etiquetas o instrucciones (A) y 1.3.1 Información y relaciones (A).
- **Severidad sugerida:** Mayor.
- **Evidencia (`diagnostico-manual.json` → `login`):** los dos `<input>` tienen `label: false`, sin `aria-label`, `aria-labelledby` ni `title`; la única pista es el placeholder, que desaparece al escribir. axe no lo marca porque acepta el placeholder como nombre accesible.
- **Pasos para reproducir:** ir a `/login`, escribir algo en «Usuario»: ya no queda ninguna indicación visible de qué campo es. Con un lector de pantalla, comprobar qué anuncia al enfocar el campo.
- **Arreglo sugerido:** agregar `<label htmlFor>` visible (o `aria-label` si el diseño no admite etiqueta visible) y `autocomplete="username"` / `"current-password"`.

### H-04 · `/login`: el foco del teclado no se ve
- **Pantalla:** `/login`.
- **Criterio:** WCAG 2.4.7 Foco visible (AA).
- **Severidad sugerida:** Mayor.
- **Evidencia (`diagnostico-manual.json` → `loginFoco`):** al enfocar «Usuario», el `<input>` tiene `outline-style: none` y `box-shadow: none`, y el contenedor conserva el mismo borde (`1px solid rgb(209,213,219)`), sin outline ni sombra. Los estilos son inline (`outline: 'none'`).
- **Pasos para reproducir:** ir a `/login`, pulsar Tab hasta «Usuario» y «Contraseña»: no cambia nada visible.
- **Arreglo sugerido:** quitar `outline: 'none'` y usar `:focus-visible` (por ejemplo, un borde/sombra de 2 px con contraste ≥ 3:1) en el contenedor del campo.

### H-05 · Mensajes de error no se asocian ni se anuncian (login y solicitud)
- **Pantallas:** `/login` y `/solicitud`.
- **Criterio:** WCAG 3.3.1 Identificación de errores (A) y 4.1.3 Mensajes de estado (AA).
- **Severidad sugerida:** Mayor.
- **Evidencia (`diagnostico-manual.json`):** en `/login` el error («Credenciales incorrectas. Acceso denegado.») es un `<p>` sin `role` ni `aria-live`. En `/solicitud`, tras enviar vacío: 2 campos con `aria-invalid="true"`, **0** con `aria-describedby`, 0 elementos `role="alert"` y 0 regiones `aria-live`; el texto del error existe en pantalla pero no está vinculado al campo. Tras enviar, el foco queda en el botón (no se mueve al primer error).
- **Pasos para reproducir:** `/solicitud` → «ENVIAR SOLICITUD DE REGISTRO» sin completar nada; con un lector de pantalla no se anuncia qué falló ni en qué campo. Igual en `/login` con credenciales inválidas.
- **Arreglo sugerido:** `role="alert"` en el mensaje de `/login`; en `FormField`, `aria-describedby` apuntando al `id` del texto de error, y mover el foco al primer campo inválido (o un resumen con `role="alert"`) al enviar.

### H-06 · Modales de club y deportista sin semántica de diálogo; botón cerrar sin nombre
- **Pantallas:** `/clubes` («Ver más») y `/deportistas` («Ver perfil»).
- **Criterio:** WCAG 4.1.2 Nombre, función, valor (A) y 2.4.3 Orden del foco (A).
- **Severidad sugerida:** Mayor.
- **Evidencia:** axe (`axe-clubes-modal.json`, `axe-deportistas-modal.json`): `button-name` **critical**: el botón cerrar es solo un SVG, sin texto ni `aria-label`. Diagnóstico: el modal no tiene `role="dialog"`, `aria-modal` ni `aria-labelledby`; al abrirlo, el foco **no entra** al modal (el elemento activo sigue siendo el botón «Ver más»). Sí cierra con Escape, y el foco queda en el botón de origen.
- **Pasos para reproducir:** `/clubes` → Tab hasta «Ver más» → Enter: se abre el modal pero un lector de pantalla no lo anuncia, y Tab sigue recorriendo la página detrás.
- **Arreglo sugerido:** `role="dialog" aria-modal="true" aria-labelledby=<id del título>`, `aria-label="Cerrar"` en el botón, mover el foco al diálogo al abrir y atrapar el foco dentro mientras esté abierto (o usar el elemento `<dialog>`).

### H-07 · Toggle «Deporte Inclusivo / Adaptado» inoperable con teclado y sin rol/estado
- **Pantallas:** `/clubes` y `/deportistas`. Medido en `/clubes`; `/deportistas` tiene el mismo markup (`label[for="toggle-adaptado"]` con un `<div onClick>`), pero no lo medí allí.
- **Criterio:** WCAG 2.1.1 Teclado (A) y 4.1.2 Nombre, función, valor (A).
- **Severidad sugerida:** Mayor (una función de filtrado inaccesible para quien no usa mouse).
- **Evidencia (`diagnostico-manual.json` → `toggle`):** el switch es un `<div onClick>` dentro de un `<label for="toggle-adaptado">` que apunta a un id inexistente: `role: null`, `tabindex: null`, `aria-checked: null`; **no recibió foco tras 40 pulsaciones de Tab**.
- **Pasos para reproducir:** abrir `/clubes`, recorrer la página con Tab: el toggle nunca se enfoca; con el teclado no hay forma de activar el filtro.
- **Arreglo sugerido:** usar `<input type="checkbox" role="switch" id="toggle-adaptado">` (o `<button role="switch" aria-checked>`) con el `<label>` asociado y estilos para `:focus-visible`.

### H-08 · `<html lang="en">` con contenido en español
- **Pantalla:** todas (`Frontend/index.html`).
- **Criterio:** WCAG 3.1.1 Idioma de la página (A).
- **Severidad sugerida:** Mayor (los lectores de pantalla leerían el texto en español con pronunciación inglesa).
- **Evidencia:** `diagnostico-manual.json` → `paginas[*].htmlLang = "en"` en las 8 pantallas; `Frontend/index.html` línea 2: `<html lang="en">`. axe no lo marca porque `en` es un código válido; no detecta que el idioma real no coincide.
- **Pasos para reproducir:** abrir cualquier pantalla → inspeccionar `<html>` → `lang="en"`.
- **Arreglo sugerido:** `<html lang="es">` (o `es-AR`).

### H-09 · Mismo título de página en todas las rutas
- **Pantalla:** todas.
- **Criterio:** WCAG 2.4.2 Página titulada (A).
- **Severidad sugerida:** Menor.
- **Evidencia:** `diagnostico-manual.json` → `paginas[*].titulo = "Deporte Río Tercero"` en las 8 rutas. El título no distingue Clubes, Deportistas, Solicitud, etc.
- **Pasos para reproducir:** navegar entre pantallas y mirar la pestaña del navegador / el historial.
- **Arreglo sugerido:** actualizar `document.title` por ruta («Clubes · Deporte Río Tercero», «Solicitud de registro · …») o usar un componente de cabecera por página.

### H-10 · Estructura de encabezados incompleta o con saltos
- **Pantallas:** `/mapa` y `/login` sin `<h1>` (solo `<h2>`); `/clubes` y `/deportistas` saltan de `<h1>` a `<h3>` (las tarjetas usan `<h3>` sin `<h2>` previo).
- **Criterio:** WCAG 1.3.1 Información y relaciones (A) y 2.4.6 Encabezados y etiquetas (AA).
- **Severidad sugerida:** Menor.
- **Evidencia:** Lighthouse `heading-order` falla en `/clubes` y `/deportistas` (escritorio y móvil); `diagnostico-manual.json` → `paginas["/mapa"].h1 = 0`, `paginas["/login"].h1 = 0`.
- **Pasos para reproducir:** extensión HeadingsMap o `document.querySelectorAll('h1,h2,h3')` en cada pantalla.
- **Arreglo sugerido:** un `<h1>` por pantalla; `<h2>` en los títulos de sección y `<h3>` solo bajo un `<h2>` (en las listas, un `<h2 class="sr-only">Listado de clubes</h2>` resuelve el salto sin cambiar el diseño).

### H-11 · Landmarks duplicados en `/admin` y `/buscar`
- **Pantallas:** `/admin` (2 `header`, 2 `nav`, 2 `main`) y `/buscar` (2 `main`).
- **Criterio:** WCAG 1.3.1 (técnica ARIA11/ARIA13); axe lo clasifica como buena práctica (no entra en las etiquetas WCAG usadas).
- **Severidad sugerida:** Menor.
- **Evidencia:** `diagnostico-manual.json` → `paginas["/admin"].landmarks`, `paginas["/buscar"].landmarks`. En `/admin` el layout global (Navbar y Footer) convive con el layout propio del panel.
- **Pasos para reproducir:** lector de pantalla → lista de regiones, o `document.querySelectorAll('main').length` en `/admin`.
- **Arreglo sugerido:** un solo `<main>` por página (anidado → `<div>`/`<section>`) y `aria-label` para distinguir los dos `nav` del panel.

### H-12 · Campo «Otras disciplinas» sin etiqueta
- **Pantalla:** `/solicitud` (formulario de club).
- **Criterio:** WCAG 3.3.2 (A) y 1.3.1 (A).
- **Severidad sugerida:** Menor.
- **Evidencia:** `diagnostico-manual.json` → `solicitudErrores`: 1 de 11 campos sin `label` ni `aria-label`: el `<input>` con placeholder «Otras disciplinas (separadas por coma, ej: Padel, Ciclismo)».
- **Pasos para reproducir:** `/solicitud` → pestaña «Soy un club» → inspeccionar ese input.
- **Arreglo sugerido:** `aria-label="Otras disciplinas"` (o un `<label>` visible).

### Observaciones sin criterio WCAG claro (para revisión humana)
- **Sin enlace «Saltar al contenido»:** el primer Tab de `/solicitud` cae en el logo y no hay enlace de salto. Hay un `<main>`, por lo que el criterio 2.4.1 podría cumplirse mediante landmarks; decide la revisión humana (casilla 2.4.1).
- **`/admin` usa `alert()`** para informar errores (visto en el código de `AdminPage.tsx`): no probé cómo lo anuncian los lectores de pantalla.

## 5. Checklist manual WCAG 2.2 AA (sin marcar)

Cada casilla debe marcarla la persona que la verifique. Probar al menos: Home, `/clubes`, `/deportistas`, `/buscar`, `/mapa`, `/solicitud`, `/login` y `/admin`, en Chrome con teclado y un lector de pantalla (NVDA en Windows o VoiceOver), y en un móvil real o emulado. `→ H-0x` indica un hallazgo ya documentado relacionado (no es una verificación).

### 5.1 Teclado y foco
- [ ] **2.1.1 Teclado (A):** todas las funciones (filtros, toggles, tarjetas, modales, formularios, panel admin) se pueden usar solo con el teclado. → H-07
- [ ] **2.1.2 Sin trampas de teclado (A):** el foco nunca queda atrapado (mapa de Leaflet, modales).
- [ ] **2.1.4 Atajos de teclado (A):** no hay atajos de una sola tecla sin forma de desactivarlos (la tecla Escape de los modales cuenta como atajo estándar).
- [ ] **2.4.1 Evitar bloques (A):** existe forma de saltar la navegación (enlace de salto o landmarks utilizables).
- [ ] **2.4.3 Orden del foco (A):** el orden de Tab sigue el orden visual; al abrir un modal el foco entra y al cerrarlo vuelve. → H-06
- [ ] **2.4.7 Foco visible (AA):** el elemento enfocado tiene un indicador visible en todos los controles (enlaces, botones, inputs, pills, tarjetas). → H-04
- [ ] **2.4.11 Foco no oculto (AA, nuevo en 2.2):** el elemento enfocado no queda tapado por el header fijo (`sticky`), el menú móvil o los modales.

Los criterios de nivel AAA (por ejemplo 2.4.12 y 2.4.13) no se incluyen.

### 5.2 Navegación y orientación
- [ ] **2.4.2 Página titulada (A):** cada pantalla tiene un título distinto y descriptivo. → H-09
- [ ] **2.4.4 Propósito de los enlaces (A):** el texto de cada enlace («Ver más», «Ver perfil») se entiende por su contexto.
- [ ] **2.4.5 Múltiples vías (AA):** hay más de una forma de llegar a cada página (menú, buscador, mapa).
- [ ] **2.4.6 Encabezados y etiquetas (AA):** los encabezados y las etiquetas describen su contenido. → H-10
- [ ] **3.2.3 Navegación coherente (AA):** el menú y el pie aparecen en el mismo orden en todas las pantallas.
- [ ] **3.2.4 Identificación coherente (AA):** los mismos componentes se nombran igual en todas las pantallas.
- [ ] **3.2.6 Ayuda coherente (A, nuevo en 2.2):** si hay ayuda/contacto, está siempre en el mismo lugar relativo.

### 5.3 Contraste y color
- [ ] **1.4.1 Uso del color (A):** el color no es el único medio para indicar estado (toggle activo, tarjeta adaptada, errores, pills seleccionadas).
- [ ] **1.4.3 Contraste mínimo (AA):** texto ≥ 4,5:1 (≥ 3:1 si es grande), incluidos placeholders y texto sobre imágenes. → H-01, H-02
- [ ] **1.4.11 Contraste de elementos no textuales (AA):** bordes de campos, switch, íconos y el indicador de foco ≥ 3:1.
- [ ] **1.4.13 Contenido al pasar el cursor o enfocar (AA):** tooltips, popups del mapa y menús se pueden descartar, no desaparecen al mover el cursor sobre ellos y persisten hasta cerrarlos.

### 5.4 Imágenes y multimedia
- [ ] **1.1.1 Contenido no textual (A):** las imágenes informativas tienen `alt` descriptivo (fotos de clubes/deportistas), las decorativas `alt=""`, y los íconos-botón tienen nombre accesible. → H-06
- [ ] **1.2.x Multimedia (A/AA):** si se agregan audio o video, hay subtítulos, transcripción y audiodescripción (hoy no se detectó multimedia; confirmar).
- [ ] **1.4.5 Imágenes de texto (AA):** no hay texto dentro de imágenes (logo aparte).
- [ ] **Mapa (`/mapa`):** la información del mapa (ubicación de clubes) tiene una alternativa en texto (la lista de tarjetas) y los marcadores se pueden operar con teclado.

### 5.5 Formularios, etiquetas y mensajes de error
- [ ] **1.3.5 Identificar el propósito de la entrada (AA):** los campos de datos personales tienen `autocomplete` (nombre, email, teléfono, usuario, contraseña).
- [ ] **3.3.2 Etiquetas o instrucciones (A):** cada campo tiene una etiqueta visible y persistente (no solo placeholder). → H-03, H-12
- [ ] **3.3.1 Identificación de errores (A):** los errores se indican en texto y se asocian al campo. → H-05
- [ ] **3.3.3 Sugerencias ante errores (AA):** el mensaje explica cómo corregir el dato.
- [ ] **3.3.4 Prevención de errores (AA):** en acciones legales/financieras/de datos, se puede revisar o revertir (aprobar/rechazar/eliminar en `/admin`: confirmar si hay confirmación).
- [ ] **3.3.7 Entrada redundante (A, nuevo en 2.2):** no se pide re-ingresar datos ya dados en el mismo proceso.
- [ ] **3.3.8 Autenticación accesible, mínimo (AA, nuevo en 2.2):** el login permite pegar y usar un gestor de contraseñas y no exige pruebas cognitivas.
- [ ] **4.1.3 Mensajes de estado (AA):** éxito, error y «sin resultados» se anuncian sin mover el foco (banner de `/solicitud`, mensaje de `/login`, resultados de búsqueda). → H-05
- [ ] **3.2.2 Al recibir entradas (A):** cambiar un campo o filtro no dispara cambios de contexto inesperados.

### 5.6 Estructura, semántica y nombres
- [ ] **1.3.1 Información y relaciones (A):** encabezados, listas, landmarks y tablas expresan la estructura visual. → H-10, H-11
- [ ] **1.3.2 Secuencia con sentido (A):** el orden del DOM coincide con el orden visual.
- [ ] **1.3.3 Características sensoriales (A):** las instrucciones no dependen solo de forma, color, posición o sonido.
- [ ] **1.3.4 Orientación (AA):** el contenido funciona en vertical y horizontal.
- [ ] **4.1.2 Nombre, función, valor (A):** todos los controles personalizados exponen rol, nombre y estado (toggle, pills, tabs de `/solicitud`, modales, sidebar del admin). → H-06, H-07
- [ ] **3.1.1 Idioma de la página (A):** `lang` correcto. → H-08
- [ ] **3.1.2 Idioma de las partes (AA):** los fragmentos en otro idioma están marcados con `lang`.

### 5.7 Zoom, reflow y adaptación del texto
- [ ] **1.4.4 Cambio de tamaño del texto (AA):** con zoom al 200 % no se pierde contenido ni funcionalidad.
- [ ] **1.4.10 Reflow (AA):** a 320 px de ancho (≈ 400 % de zoom sobre 1280 px) no hay scroll horizontal, salvo en mapas o tablas.
- [ ] **1.4.12 Espaciado del texto (AA):** aplicando interlineado 1,5, párrafos 2×, letras 0,12× y palabras 0,16×, no se corta ni se superpone texto.
- [ ] **Zoom 200 % en cada pantalla** (Home, `/clubes`, `/deportistas`, `/buscar`, `/mapa`, `/solicitud`, `/login`, `/admin`).
  - Pista automática (no verificada por una persona): a 640 px de ancho no se midió desplazamiento horizontal en ninguna de las 8 pantallas (`diagnostico-manual.json` → `reflow200`).

### 5.8 Interacción táctil y puntero
- [ ] **2.5.1 Gestos del puntero (A):** ninguna función depende de gestos complejos (el mapa se puede operar sin arrastrar ni pellizcar).
- [ ] **2.5.2 Cancelación del puntero (A):** las acciones se disparan al soltar (`click`), no al presionar.
- [ ] **2.5.3 Etiqueta en el nombre (A):** el nombre accesible contiene el texto visible del control.
- [ ] **2.5.4 Activación por movimiento (A):** ninguna función depende de mover o agitar el dispositivo.
- [ ] **2.5.7 Movimientos de arrastre (AA, nuevo en 2.2):** lo que se hace arrastrando (mapa) tiene alternativa de un solo toque.
- [ ] **2.5.8 Tamaño del objetivo, mínimo (AA, nuevo en 2.2):** los controles miden al menos 24×24 px (o tienen separación suficiente), p. ej. botón cerrar de los modales, pills, íconos de redes.

### 5.9 Tiempo, movimiento y destellos
- [ ] **2.2.1 Tiempo ajustable (A):** no hay límites de tiempo (sesión del admin) sin aviso o extensión.
- [ ] **2.2.2 Pausar, detener, ocultar (A):** animaciones que duran más de 5 s o se mueven solas (puntos pulsantes, carruseles, `animate-pulse`) se pueden pausar. Revisar también `prefers-reduced-motion`.
- [ ] **2.3.1 Tres destellos (A):** nada parpadea más de 3 veces por segundo.

## 6. Cómo repetir y mantener

- `npm run test:a11y`: axe sobre todas las pantallas (falla mientras haya violaciones; deja los JSON en `tests/a11y/reports/`).
- `npm run a11y:lighthouse`: Lighthouse escritorio y móvil de las pantallas públicas (requiere `vite preview` en `:4173`).
- `npm run a11y:diagnostico`: vuelve a medir idioma, títulos, encabezados, foco, modales, toggle y reflow.
- Al corregir un hallazgo, volver a correr los tres y revisar que su evidencia desaparezca.
- **Límite de esta revisión:** solo se auditó el estado inicial y los estados listados en la sección 1; no se probó con lector de pantalla ni en dispositivos reales.
