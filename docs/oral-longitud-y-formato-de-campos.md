# Guion de Exposición Oral: Longitud y Formato de Campos en Pruebas de Software
**Proyecto:** CrazySports (Locos del Deporte - Grupo 6)  
**Tema:** Longitud y formato de los campos (Técnicas de diseño de pruebas, validación en Spring Boot y hallazgos)  
**Tiempo objetivo:** Máximo 2 minutos (250 a 300 palabras habladas)  
**Tono:** Primera persona, oral, español rioplatense  

---

## 1. Guion para Hablar (Lectura en Voz Alta - 2 Minutos)

> *Total de palabras habladas en este bloque:* **274 palabras** (~1 minuto 55 segundos a ritmo pausado).

### [0:00 - 0:25] Introducción y Concepto
"Buenas tardes. Probar longitud y formato es asegurar que el backend reciba datos con el tamaño y la estructura correctos, rechazando anomalías antes de persistirlas. En criollo: que un teléfono tenga solo dígitos, un email tenga arroba y un nombre no desborde la base de datos."

### [0:25 - 0:55] Técnicas de Diseño de Pruebas
"Usamos dos técnicas complementarias. Primero, **valores límite**: testeamos los bordes de decisión. En CrazySports probamos la edad del deportista en menos uno y cero como límites inferiores inválidos, uno como válido y ciento cincuenta por encima. Segundo, **clases de equivalencia**: particionamos datos válidos e inválidos. En el teléfono del club probamos una clase válida puramente numérica frente a una inválida con letras como `35710ABCDE`."

### [0:55 - 1:25] Código Real y Hallazgos Críticos
"Al revisar nuestro backend Spring Boot encontramos un contraste claro. Existen `@NotBlank` y `@Min(1)` en los DTOs. Pero tenemos hallazgos críticos: no existe `@Max` para edad, falta `@Size(max = 255)` en los nombres, y no hay ninguna validación de formato con `@Pattern` o `@Email` en teléfono y correo."

### [1:25 - 1:50] Resultados de Planilla, Excepciones y Tests
"En la planilla de pruebas, cuatro de siete casos resultaron FAIL. Al enviar un nombre de doscientos cincuenta y seis caracteres, en vez de un 400 Bad Request obtenemos un 500 Internal Server Error porque explota la base de datos. Y con emails o teléfonos inválidos devuelve 201 Created, guardando datos corruptos. Nuestros tests automatizados de validación dejaron estos defectos en rojo."

### [1:50 - 2:00] Frase de Cierre
"La lección arquitectónica es contundente: la base de datos jamás debe ser la primera línea de defensa; validar en los DTOs preserva la integridad y consistencia del sistema."

---

## 2. Respaldo Técnico y Evidencias para la Mesa Examinadora

### A. Anotaciones de Validación Existentes vs. Hallazgos en Código Real

| Archivo | Línea | Código Real / Anotación | Estado / Hallazgo |
| :--- | :---: | :--- | :--- |
| [`ClubRequestDTO.java`](file:///c:/Users/joaqu/OneDrive/Escritorio/CrazySports/Backend/src/main/java/com/pp2/crazySports/dto/club/ClubRequestDTO.java#L11-L12) | 11-12 | `@NotBlank(message = "El nombre de la institución es obligatorio")`<br>`private String nombreInstitucion;` | **Existe** obligatoriedad, pero **FALTA** `@Size(max = 255)` (Hallazgo BUG-02D). |
| [`ClubRequestDTO.java`](file:///c:/Users/joaqu/OneDrive/Escritorio/CrazySports/Backend/src/main/java/com/pp2/crazySports/dto/club/ClubRequestDTO.java#L14-L15) | 14-15 | `@NotBlank(message = "La dirección es obligatoria")`<br>`private String direccion;` | **Existe** validación de no vacío. |
| [`ClubRequestDTO.java`](file:///c:/Users/joaqu/OneDrive/Escritorio/CrazySports/Backend/src/main/java/com/pp2/crazySports/dto/club/ClubRequestDTO.java#L21) | 21 | `private String telefono;` | **SIN VALIDACIÓN**. Falta `@Pattern(regexp = "^[0-9]+$")` (Hallazgo BUG-02B). |
| [`ClubRequestDTO.java`](file:///c:/Users/joaqu/OneDrive/Escritorio/CrazySports/Backend/src/main/java/com/pp2/crazySports/dto/club/ClubRequestDTO.java#L22) | 22 | `private String email;` | **SIN VALIDACIÓN**. Falta `@Email` (Hallazgo BUG-02C). |
| [`DeportistaRequestDTO.java`](file:///c:/Users/joaqu/OneDrive/Escritorio/CrazySports/Backend/src/main/java/com/pp2/crazySports/dto/deportista/DeportistaRequestDTO.java#L13-L14) | 13-14 | `@NotBlank(message = "El nombre es obligatorio")`<br>`private String nombre;` | **Existe** obligatoriedad, pero **FALTA** `@Size(max = 255)` (Hallazgo BUG-02D). |
| [`DeportistaRequestDTO.java`](file:///c:/Users/joaqu/OneDrive/Escritorio/CrazySports/Backend/src/main/java/com/pp2/crazySports/dto/deportista/DeportistaRequestDTO.java#L16-L17) | 16-17 | `@NotBlank(message = "El deporte es obligatorio")`<br>`private String deporte;` | **Existe** validación de no vacío. |
| [`DeportistaRequestDTO.java`](file:///c:/Users/joaqu/OneDrive/Escritorio/CrazySports/Backend/src/main/java/com/pp2/crazySports/dto/deportista/DeportistaRequestDTO.java#L19-L20) | 19-20 | `@Min(value = 1, message = "La edad debe ser mayor a 0")`<br>`private Integer edad;` | **Existe** límite inferior (`@Min(1)`), pero **FALTA** límite superior `@Max(120)` (Hallazgo BUG-02A). |
| [`DeportistaRequestDTO.java`](file:///c:/Users/joaqu/OneDrive/Escritorio/CrazySports/Backend/src/main/java/com/pp2/crazySports/dto/deportista/DeportistaRequestDTO.java#L26) | 26 | `private String telefono;` | **SIN VALIDACIÓN**. Admite letras arbitrarias (Hallazgo BUG-02B). |
| [`DeportistaRequestDTO.java`](file:///c:/Users/joaqu/OneDrive/Escritorio/CrazySports/Backend/src/main/java/com/pp2/crazySports/dto/deportista/DeportistaRequestDTO.java#L27) | 27 | `private String email;` | **SIN VALIDACIÓN**. Falta `@Email` (Hallazgo BUG-02C). |
| [`SolicitudRequestDTO.java`](file:///c:/Users/joaqu/OneDrive/Escritorio/CrazySports/Backend/src/main/java/com/pp2/crazySports/dto/solicitud/SolicitudRequestDTO.java#L13-L14) | 13-14 | `@NotNull(message = "El tipo de solicitud es obligatorio (CLUB o DEPORTISTA)")`<br>`private TipoSolicitud tipo;` | **Existe** control de no nulo. |
| [`SolicitudRequestDTO.java`](file:///c:/Users/joaqu/OneDrive/Escritorio/CrazySports/Backend/src/main/java/com/pp2/crazySports/dto/solicitud/SolicitudRequestDTO.java#L19-L20) | 19-20 | `@NotBlank(message = "Los datos del formulario son obligatorios")`<br>`private String datosAdjuntos;` | **Existe** control de no vacío en el payload JSON. |
| Entidad [`Club.java`](file:///c:/Users/joaqu/OneDrive/Escritorio/CrazySports/Backend/src/main/java/com/pp2/crazySports/model/club/Club.java#L23-L25) | 23-25 | `@NotBlank`<br>`@Column(nullable = false)`<br>`private String nombreInstitucion;` | JPA mapea por defecto a `character varying(255)`. Al no validarse en DTO, causa `DataIntegrityViolationException` (500). |
| Entidad [`Deportista.java`](file:///c:/Users/joaqu/OneDrive/Escritorio/CrazySports/Backend/src/main/java/com/pp2/crazySports/model/deportista/Deportista.java#L22-L24) | 22-24 | `@NotBlank`<br>`@Column(nullable = false)`<br>`private String nombre;` | Mapeo JPA `varchar(255)`. Mismo comportamiento que Club. |

---

### B. Matriz de Campos Probados (Planilla de Casos de Prueba)

Detalle de ejecución según la planilla `docs/Planilla_Test_Case_CrazySports_v1_10.xlsx` (Hojas: *Panel de Administración*, *Solicitud de Registro* y *API Clubes y Deportistas*):

| ID Caso | Campo | Técnica | Valor Probado | Resultado Esperado | Resultado Real (Planilla) | Estado | Test Automatizado que lo Cubre |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **TC-PA-10** | `edad` (Deportista) | Valores límite (por debajo del mín.) | `-1` | HTTP 400; body menciona `edad`; estado PENDIENTE, no crea perfil | HTTP 400: validación `@Min` en campo `edad` ("La edad debe ser mayor a 0") | **PASS** | `DeportistaRequestDTOValidationTest::debeFallar_cuandoEdadEsNegativa`<br>`AdminControllerTest::debeRetornar400_cuandoDtoTieneCamposInvalidos` |
| **TC-PA-11** | `edad` (Deportista) | Valores límite (límite inferior inválido) | `0` | HTTP 400; body menciona `edad`; estado PENDIENTE, no crea perfil | HTTP 400: validación `@Min` en campo `edad` (rejectedValue 0) | **PASS** | `DeportistaRequestDTOValidationTest::debeFallar_cuandoEdadEsCero`<br>`DeportistaControllerTest::debeRetornar400_cuandoCrearDeportistaConEdadCero` |
| **TC-PA-12** | `edad` (Deportista) | Valores límite (por encima del máx.) | `150` | HTTP 400; body menciona `edad`; estado PENDIENTE, no crea perfil | HTTP 201: se creó deportista con edad 150 (se esperaba 400) | **FAIL** | `DeportistaRequestDTOValidationTest::debeFallar_cuandoEdadSuperaLimiteMaximo` *(ROJO, `@Tag("bug-conocido")`)* |
| **TC-PA-13** | `nombreInstitucion` (Club) | Clases de equivalencia (obligatorio vacío) | `""` *(vacío / espacios)* | HTTP 400; body menciona `nombreInstitucion`; no crea perfil | HTTP 400: validación en `nombreInstitucion` ("El nombre de la institución es obligatorio") | **PASS** | `ClubRequestDTOValidationTest::debeFallar_cuandoNombreInstitucionEsVacio`<br>`AdminControllerTest::debeRetornar400_cuandoDtoClubTieneCamposVacios` |
| **TC-PA-14** | `nombreInstitucion` (Club) | Valores límite (por encima del máx.) | 256 caracteres (`"Club Test PA14 A..."`) | HTTP 400; body menciona `nombreInstitucion`; no crea perfil | HTTP 500: `DataIntegrityViolationException` "value too long for type character varying(255)" | **FAIL** | `ClubRequestDTOValidationTest::debeFallar_cuandoNombreInstitucionSupera255Caracteres` *(ROJO)*<br>`PersistenceIntegrationTest::debeFallarAlSuperarVarchar255EnBaseDeDatos...` *(VERDE)* |
| **TC-PA-15** | `telefono` (Club) | Clases de equivalencia (formato inválido) | `"35710ABCDE"` | HTTP 400; body menciona `telefono`; no crea perfil | HTTP 201: se creó el club con teléfono "35710ABCDE" (se esperaba 400) | **FAIL** | `ClubRequestDTOValidationTest::debeFallar_cuandoTelefonoContieneLetras` *(ROJO, `@Tag("bug-conocido")`)*<br>`DeportistaRequestDTOValidationTest::debeFallar_cuandoTelefonoContieneLetras` *(ROJO)* |
| **TC-PA-16** | `email` (Club) | Clases de equivalencia (formato inválido) | `"test@"` *(sin dominio)* | HTTP 400; body menciona `email`; no crea perfil | HTTP 201: se creó el club con email "test@" (se esperaba 400) | **FAIL** | `ClubRequestDTOValidationTest::debeFallar_cuandoEmailEsInvalido` *(ROJO, `@Tag("bug-conocido")`)*<br>`DeportistaRequestDTOValidationTest::debeFallar_cuandoEmailEsInvalido` *(ROJO)* |
| **TC-SR-03** | `tipo` (Solicitud) | Clases de equivalencia (campo nulo) | `null` | HTTP 400 mencionando `tipo`; no crea solicitud | HTTP 400 mencionando el campo `tipo`. No se creó ninguna fila. | **PASS** | `SolicitudRequestDTOValidationTest::debeFallar_cuandoTipoEsNulo`<br>`SolicitudRegistroControllerTest::debeRetornar400_cuandoTipoEsNulo` |
| **TC-SR-04** | `datosAdjuntos` (Solicitud) | Clases de equivalencia (campo vacío) | `""` | HTTP 400 mencionando `datosAdjuntos` | HTTP 400 mencionando `datosAdjuntos`. No se creó fila. | **PASS** | `SolicitudRequestDTOValidationTest::debeFallar_cuandoDatosAdjuntosEsVacio`<br>`SolicitudRegistroControllerTest::debeRetornar400_cuandoDatosAdjuntosEsVacio` |
| **TC-API-04** | `nombreInstitucion` (Club) | Clases de equivalencia (campo vacío) | `""` | HTTP 400; conserva valor previo | HTTP 400 mencionando `nombre`. El nombre original se conservó. | **PASS** | `ClubControllerTest::debeRetornar400_cuandoCrearClubConNombreVacio` |
| **TC-API-11** | `edad` (Deportista) | Valores límite (límite inferior inválido) | `0` | HTTP 400; conserva valor previo | HTTP 400 mencionando `edad`. La edad original se conservó. | **PASS** | `DeportistaControllerTest::debeRetornar400_cuandoCrearDeportistaConEdadCero` |

---

### C. Análisis del Manejo de Excepciones: ¿Qué Debe Devolver vs. Qué Devuelve?

#### 1. Comportamiento Esperado según Estándar REST
Ante cualquier dato inválido en longitud o formato:
- **Código HTTP:** `400 Bad Request`.
- **Cuerpo de Respuesta:** Estructura JSON clara indicando el campo infractor y el motivo del rechazo (ej. `{"campo": "edad", "mensaje": "La edad máxima permitida es 120"}`).
- **Persistencia:** Cero efectos colaterales; no debe crearse ni modificarse ninguna fila en PostgreSQL.

#### 2. Comportamiento Real en CrazySports (`GlobalExceptionHandler.java`)
Al inspeccionar [`GlobalExceptionHandler.java`](file:///c:/Users/joaqu/OneDrive/Escritorio/CrazySports/Backend/src/main/java/com/pp2/crazySports/exception/GlobalExceptionHandler.java#L12-L23):
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Solicitud incorrecta");
        error.put("mensaje", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}
```

#### 3. Diagnóstico de Fallos Críticos
1. **Casos que terminan en HTTP 500 (Error del Servidor):**
   - En el caso **TC-PA-14** (`nombreInstitucion` con 256 caracteres), como el DTO carece de `@Size(max = 255)`, la petición atraviesa la capa Web sin ser rechazada.
   - Al intentar persistir en PostgreSQL, la base de datos aborta la transacción porque la columna es `character varying(255)`.
   - Spring lanza `DataIntegrityViolationException`.
   - **Causa raíz:** `GlobalExceptionHandler` **no tiene** `@ExceptionHandler(DataIntegrityViolationException.class)`. La excepción no capturada escala al contenedor y devuelve **HTTP 500 Internal Server Error**, exponiendo detalles internos de la base de datos al cliente.
2. **Casos que terminan en HTTP 201 (Falso Positivo / Datos Corruptos):**
   - En los casos **TC-PA-12** (edad 150), **TC-PA-15** (teléfono "35710ABCDE") y **TC-PA-16** (email "test@"), al no existir anotaciones de validación en el DTO, Spring considera el objeto completamente válido.
   - La base de datos almacena el registro sin objeciones (150 entra en un `integer`, y las cadenas entran en columnas `varchar`).
   - El endpoint responde **HTTP 201 Created**, persistiendo información inconsistente y violando las reglas de negocio.

---

### D. Trazabilidad a Bugs e Issues

| Identificador Interno | Descripción del Defecto | Casos Afectados | Issue de GitHub |
| :--- | :--- | :--- | :---: |
| **BUG-02A** | Falta validación de edad máxima (`@Max(120)` en `DeportistaRequestDTO`). Admite edades biológicamente absurdas (150 años). | TC-PA-12, TC-VAL-07 | `[COMPLETAR]` |
| **BUG-02B** | Falta validación de formato numérico de teléfono (`@Pattern` en `ClubRequestDTO` y `DeportistaRequestDTO`). Admite letras. | TC-PA-15, TC-VAL-09, TC-VAL-15 | `[COMPLETAR]` |
| **BUG-02C** | Falta validación de formato de email (`@Email` en `ClubRequestDTO` y `DeportistaRequestDTO`). Admite cadenas sin `@` o sin dominio. | TC-PA-16, TC-VAL-10, TC-VAL-16 | `[COMPLETAR]` |
| **BUG-02D** | Falta validación de longitud máxima en DTO (`@Size(max = 255)`). Causa excepción no controlada `DataIntegrityViolationException` (HTTP 500) a nivel base de datos. | TC-PA-14, TC-VAL-08, TC-VAL-14, TC-INT-08 | `[COMPLETAR]` |

> *Nota de trazabilidad:* En la planilla Excel (`Planilla_Test_Case_CrazySports_v1_10.xlsx`), la columna `Q` ("Bug (link a Issue)") se encuentra actualmente vacía, documentada con recordatorios de "Completar Evidencia y link al Issue". Los defectos fueron relevados técnicamente en [`docs/tests-backend.md`](file:///c:/Users/joaqu/OneDrive/Escritorio/CrazySports/docs/tests-backend.md#L216-L227) bajo los IDs internos `BUG-02A` a `BUG-02D`. Los números de Issue de GitHub definitivos quedan marcados como `[COMPLETAR]`.

---

### E. Diferencias entre los Supuestos de la Planilla y el Código Real

Según la hoja *Leyenda y supuestos* (Fila 5, ítem 4 de la planilla Excel) y la especificación del plan de pruebas:

| Concepto | Supuesto Asumido por el Equipo en Planilla | Implementación Real en el Código Fuente | Discrepancia Observada |
| :--- | :--- | :--- | :--- |
| **Rango de Edad** | `1 a 120` años válidos. | `@Min(value = 1)` en línea 19 de `DeportistaRequestDTO.java`. **No hay `@Max`**. | El código valida el piso (>= 1), pero carece de techo. Acepta cualquier entero positivo (ej. 150, 999). |
| **Longitud de Nombre** | Hasta `255` caracteres válidos; 256 o más inválidos con 400 Bad Request. | Sin `@Size` en los DTOs. En base de datos PostgreSQL, la columna es `varchar(255)`. | El código web no valida el largo; el rechazo ocurre recién en la base de datos con HTTP 500 en lugar de un HTTP 400 limpio. |
| **Formato de Teléfono** | Solo dígitos numéricos permitidos. | Campo `private String telefono;` sin `@Pattern`. | No hay ninguna restricción de formato en el backend; acepta texto arbitrario. |
| **Formato de Email** | Dirección de correo electrónico válida (con `@` y dominio). | Campo `private String email;` sin `@Email`. | No hay control sintáctico en el backend; acepta cualquier cadena. |

---

## 3. Preguntas Posibles de la Mesa Examinadora (Q&A)

### 1. ¿Por qué probar los valores límite o de borde si ya sabemos que con valores intermedios (como 25 años) el sistema funciona?
> **Respuesta:** "Porque estadísticamente la inmensa mayoría de los errores de programación ocurren en las fronteras de decisión, debido a confusiones clásicas entre operadores como 'menor' versus 'menor o igual', o desbordes de longitud en buffers y columnas de bases de datos. Si probamos únicamente el centro de la clase (25 años), jamás detectaríamos que el sistema acepta 150 años o que colapsa con 256 caracteres."

### 2. ¿Cuál es la diferencia práctica entre valores límite y clases de equivalencia?
> **Respuesta:** "La partición en clases de equivalencia divide el universo de entrada en conjuntos donde asumimos que cualquier elemento produce el mismo resultado (por ejemplo: la clase de emails válidos versus la clase de strings sin arroba). Los valores límite se concentran específicamente en las fronteras extremas de esas clases (por ejemplo: exactamente 0, 1, 120 y 121 años), que es donde el comportamiento conmuta de válido a inválido."

### 3. ¿Por qué ante un dato inválido el backend debe responder 400 Bad Request y jamás 500 Internal Server Error?
> **Respuesta:** "Un error 400 Bad Request indica un error del cliente: el dato enviado no cumple el contrato de la API y el backend lo rechaza ordenadamente sin alterar su estado. Un 500 Internal Server Error representa una falla no controlada del servidor; en nuestro caso ocurrió porque la base de datos abortó la inserción por desborde de columna. Un 500 expone vulnerabilidades internas, satura los logs de alertas críticas y rompe la arquitectura REST."

### 4. ¿Por qué validar en el backend si el formulario del frontend ya bloquea campos vacíos, correos sin formato y nombres largos?
> **Respuesta:** "Porque el frontend es un entorno inseguro fuera de nuestro control: cualquier usuario o atacante puede saltearse las validaciones de React usando Swagger, Postman o un simple script `curl`. La validación en el frontend mejora la experiencia de usuario (feedback inmediato), pero la validación en los DTOs del backend es la única garantía real de seguridad e integridad del negocio."

---

## 4. Frase de Cierre
> **"La base de datos nunca debe ser la primera línea de defensa; validar en el DTO protege la integridad de todo el sistema."**

