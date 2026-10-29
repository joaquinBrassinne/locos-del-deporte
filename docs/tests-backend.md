# Suite de Pruebas del Backend - CrazySports

Este documento contiene la matriz completa de casos de prueba automatizados con **JUnit 5**, **Mockito**, **Bean Validation**, **MockMvc** y **Testcontainers** (PostgreSQL 16) para el backend de CrazySports (`com.pp2.crazySports`), junto con su estado de ejecución y trazabilidad de defectos conocidos.

---

## 1. Instrucciones de Ejecución

### Prerrequisitos y Variables de Entorno
- **JDK 21** configurado (`JAVA_HOME`).
- **Docker** o **Docker Desktop** activo (para Testcontainers con imagen `postgres:16`).
- **Zona Horaria**: Se fuerza automáticamente en Maven a UTC mediante `<argLine>@{argLine} -Duser.timezone=UTC</argLine>` para evitar el error de zona horaria de PostgreSQL en Windows (`FATAL: invalid value for parameter "TimeZone": "America/Buenos_Aires"`).

### Comandos de Ejecución
Desde la carpeta raíz del backend (`CrazySports/Backend`):

1. **Ejecutar todos los tests unitarios y de integración**:
   ```bash
   ./mvnw clean test
   ```

2. **Ejecutar verificación completa y empaquetado**:
   ```bash
   ./mvnw clean verify
   ```

3. **Reporte HTML de Cobertura JaCoCo**:
   Generado automáticamente al ejecutar `test` o `verify`. Se encuentra en:
   ```
   target/site/jacoco/index.html
   ```

---

## 2. Resumen Métrico de Cobertura (JaCoCo)

| Métrica | Cobertura Obtenida | Estado |
| :--- | :---: | :---: |
| **Instrucciones (Line/Instruction Coverage)** | **94.6%** (1.396 / 1.475 instrucciones) | Excelente |
| **Ramas (Branch Coverage)** | **100%** (32 / 32 ramas) | Total |
| **Líneas de Código (Line Coverage)** | **95.8%** (271 / 283 líneas) | Excelente |
| **Métodos (Method Coverage)** | **95.7%** (88 / 92 métodos) | Total |
| **Servicios Core (`service.*`)** | **100%** en todas las clases | Total |
| **Controladores (`controller.*`)** | **100%** en todos los endpoints | Total |

---

## 3. Matriz de Casos de Prueba

| ID del Caso | Archivo :: Nombre del Test | Resultado | Observaciones / Defecto Conocido |
| :--- | :--- | :---: | :--- |
| **TC-CTX-01** | `BackendApplicationTests::contextLoads` | **VERDE** | Carga del contexto Spring Boot con perfil de prueba |
| **TC-CFG-01** | `AdminCreadoTest::debeCrearAdminPorDefectoConPasswordHasheada_cuandoBaseDeDatosEstaVacia` | **VERDE** | Cifra contraseña con BCrypt |
| **TC-CFG-02** | `AdminCreadoTest::noDebeCrearAdmin_cuandoYaExisteRegistroEnBaseDeDatos` | **VERDE** | Idempotencia en inicialización |
| **TC-SEC-01** | `CustomUserDetailsServiceTest::debeRetornarUserDetailsConRolAdmin_cuandoUsuarioExiste` | **VERDE** | Mapeo de credenciales y rol ROLE_ADMIN |
| **TC-SEC-02** | `CustomUserDetailsServiceTest::debeLanzarUsernameNotFoundException_cuandoUsuarioNoExiste` | **VERDE** | Usuario desconocido |
| **TC-SEC-03** | `SecurityConfigTest::debePermitirAccesoPublico_cuandoGetClubes` | **VERDE** | GET público sin credenciales |
| **TC-SEC-04** | `SecurityConfigTest::debePermitirAccesoPublico_cuandoGetDeportistas` | **VERDE** | GET público sin credenciales |
| **TC-SEC-05** | `SecurityConfigTest::debePermitirAccesoPublico_cuandoPostSolicitudes` | **VERDE** | Envío de formulario público |
| **TC-SEC-06** | `SecurityConfigTest::debeRechazarCon401_cuandoGetSolicitudesSinCredenciales` | **VERDE** | Protegido con rol ADMIN |
| **TC-SEC-07** | `SecurityConfigTest::debePermitirAccesoCon200_cuandoGetSolicitudesConAdmin` | **VERDE** | Acceso concedido con HTTP Basic |
| **TC-SEC-08** | `SecurityConfigTest::debeRechazarCon401_cuandoAccesoAAdminSinCredenciales` | **VERDE** | /api/admin/** requiere autenticación |
| **TC-SEC-09** | `SecurityConfigTest::debeRechazarCon401_cuandoPutClubesSinCredenciales` | **VERDE** | PUT /api/clubes/** requiere autenticación |
| **TC-SEC-10** | `SecurityConfigTest::debeRechazarCon401_cuandoDeleteClubesSinCredenciales` | **VERDE** | DELETE /api/clubes/** requiere autenticación |
| **TC-SEC-11** | `SecurityConfigTest::debeRechazarCon401_cuandoPutDeportistasSinCredenciales` | **VERDE** | PUT /api/deportistas/** requiere autenticación |
| **TC-SEC-12** | `SecurityConfigTest::debeRechazarCon401_cuandoDeleteDeportistasSinCredenciales` | **VERDE** | Interceptado por anyRequest().authenticated() |
| **TC-VAL-01** | `DeportistaRequestDTOValidationTest::debeSerValido_cuandoTodosLosCamposSonCorrectos` | **VERDE** | DTO con datos completos |
| **TC-VAL-02** | `DeportistaRequestDTOValidationTest::debeFallar_cuandoNombreEsVacio` | **VERDE** | Violación @NotBlank |
| **TC-VAL-03** | `DeportistaRequestDTOValidationTest::debeFallar_cuandoDeporteEsVacio` | **VERDE** | Violación @NotBlank |
| **TC-VAL-04** | `DeportistaRequestDTOValidationTest::debeFallar_cuandoEdadEsNegativa` | **VERDE** | Violación @Min(1) |
| **TC-VAL-05** | `DeportistaRequestDTOValidationTest::debeFallar_cuandoEdadEsCero` | **VERDE** | Violación @Min(1) |
| **TC-VAL-06** | `DeportistaRequestDTOValidationTest::debeSerValido_cuandoEdadEsUno` | **VERDE** | Límite inferior válido |
| **TC-VAL-07** | `DeportistaRequestDTOValidationTest::debeFallar_cuandoEdadSuperaLimiteMaximo` | **ROJO** | BUG-02A: Falta validación de edad máxima (@Max) |
| **TC-VAL-08** | `DeportistaRequestDTOValidationTest::debeFallar_cuandoNombreSupera255Caracteres` | **ROJO** | BUG-02D: Falta validación @Size(max=255) en DTO |
| **TC-VAL-09** | `DeportistaRequestDTOValidationTest::debeFallar_cuandoTelefonoContieneLetras` | **ROJO** | BUG-02B: Falta validación de formato (@Pattern) |
| **TC-VAL-10** | `DeportistaRequestDTOValidationTest::debeFallar_cuandoEmailEsInvalido` | **ROJO** | BUG-02C: Falta validación de formato (@Email) |
| **TC-VAL-11** | `ClubRequestDTOValidationTest::debeSerValido_cuandoTodosLosCamposSonCorrectos` | **VERDE** | DTO con datos completos |
| **TC-VAL-12** | `ClubRequestDTOValidationTest::debeFallar_cuandoNombreInstitucionEsVacio` | **VERDE** | Violación @NotBlank |
| **TC-VAL-13** | `ClubRequestDTOValidationTest::debeFallar_cuandoDireccionEsVacia` | **VERDE** | Violación @NotBlank |
| **TC-VAL-14** | `ClubRequestDTOValidationTest::debeFallar_cuandoNombreInstitucionSupera255Caracteres` | **ROJO** | BUG-02D: Falta validación @Size(max=255) en DTO |
| **TC-VAL-15** | `ClubRequestDTOValidationTest::debeFallar_cuandoTelefonoContieneLetras` | **ROJO** | BUG-02B: Falta validación de formato de teléfono |
| **TC-VAL-16** | `ClubRequestDTOValidationTest::debeFallar_cuandoEmailEsInvalido` | **ROJO** | BUG-02C: Falta validación de email (@Email) |
| **TC-VAL-17** | `SolicitudRequestDTOValidationTest::debeSerValido_cuandoTipoYDatosAdjuntosSonCorrectos` | **VERDE** | DTO válido |
| **TC-VAL-18** | `SolicitudRequestDTOValidationTest::debeFallar_cuandoTipoEsNulo` | **VERDE** | Violación @NotNull |
| **TC-VAL-19** | `SolicitudRequestDTOValidationTest::debeFallar_cuandoDatosAdjuntosEsNulo` | **VERDE** | Violación @NotBlank |
| **TC-VAL-20** | `SolicitudRequestDTOValidationTest::debeFallar_cuandoDatosAdjuntosEsVacio` | **VERDE** | Violación @NotBlank |
| **TC-CLU-01** | `ClubServiceTest::debeCrearClub_cuandoDatosSonValidos` | **VERDE** | Mockito unitario |
| **TC-CLU-02** | `ClubServiceTest::debeLanzarExcepcion_cuandoNombreDeClubYaExiste` | **VERDE** | Valida duplicados con IllegalArgumentException |
| **TC-CLU-03** | `ClubServiceTest::debeListarClubes_cuandoExistenRegistros` | **VERDE** | Mapea con cantidadDeportistas |
| **TC-CLU-04** | `ClubServiceTest::debeRetornarListaVacia_cuandoNoHayClubes` | **VERDE** | Manejo de listas vacías |
| **TC-CLU-05** | `ClubServiceTest::debeObtenerClubPorId_cuandoIdExiste` | **VERDE** | Búsqueda por ID existente |
| **TC-CLU-06** | `ClubServiceTest::debeLanzarExcepcion_cuandoIdNoExiste` | **VERDE** | RuntimeException lanzada por servicio |
| **TC-CLU-07** | `ClubServiceTest::debeBuscarClubesPorNombre_cuandoCoincide` | **VERDE** | Búsqueda insensible a mayúsculas |
| **TC-CLU-08** | `ClubServiceTest::debeRetornarListaVacia_cuandoBusquedaPorNombreNoCoincide` | **VERDE** | Sin coincidencias |
| **TC-CLU-09** | `ClubServiceTest::debeFiltrarClubesPorDisciplina_cuandoExiste` | **VERDE** | Filtro por disciplina |
| **TC-CLU-10** | `ClubServiceTest::debeListarClubesConDeporteAdaptado_cuandoExisten` | **VERDE** | Filtro booleano adaptado |
| **TC-CLU-11** | `ClubServiceTest::debeListarClubesConDeporteAdaptadoDesdeMetodoAlternativo` | **VERDE** | Método alternativo |
| **TC-CLU-12** | `ClubServiceTest::debeMapearCoordenadas_cuandoSeConsultanClubes` | **VERDE** | Mapeo de ClubMapaDTO |
| **TC-CLU-13** | `ClubServiceTest::debeActualizarClub_cuandoDatosSonValidos` | **VERDE** | Actualización de campos |
| **TC-CLU-14** | `ClubServiceTest::debeLanzarExcepcion_cuandoClubAActualizarNoExiste` | **VERDE** | RuntimeException |
| **TC-CLU-15** | `ClubServiceTest::debeEliminarClub_cuandoIdExiste` | **VERDE** | Invocación de deleteById |
| **TC-CLU-16** | `ClubServiceTest::debeLanzarExcepcion_cuandoClubAEliminarNoExiste` | **VERDE** | RuntimeException |
| **TC-SOL-01** | `SolicitudRegistroServiceTest::debeCrearSolicitudPendiente_cuandoDatosSonValidos` | **VERDE** | Estado inicial PENDIENTE |
| **TC-SOL-02** | `SolicitudRegistroServiceTest::debeListarSolicitudesPorEstado_cuandoEstadoEsValido` | **VERDE** | Filtro por enum |
| **TC-SOL-03** | `SolicitudRegistroServiceTest::debeLanzarExcepcion_cuandoEstadoEsInvalido` | **VERDE** | IllegalArgumentException |
| **TC-SOL-04** | `SolicitudRegistroServiceTest::debeObtenerSolicitudPorId_cuandoIdExiste` | **VERDE** | Consulta por ID |
| **TC-SOL-05** | `SolicitudRegistroServiceTest::debeLanzarExcepcion_cuandoIdNoExiste` | **VERDE** | RuntimeException |
| **TC-SOL-06** | `SolicitudRegistroServiceTest::debeAprobarSolicitudDeportista_cuandoEsValida` | **VERDE** | Crea perfil deportista y vincula ID |
| **TC-SOL-07** | `SolicitudRegistroServiceTest::debeAprobarSolicitudClub_cuandoEsValida` | **VERDE** | Crea perfil club y vincula ID |
| **TC-SOL-08** | `SolicitudRegistroServiceTest::debeLanzarExcepcion_cuandoSolicitudNoEstaPendienteAlAprobar` | **VERDE** | Control de transición de estados |
| **TC-SOL-09** | `SolicitudRegistroServiceTest::debeLanzarExcepcion_cuandoFallaDeserializacionJsonAlAprobar` | **VERDE** | JSON inválido en datosAdjuntos |
| **TC-SOL-10** | `SolicitudRegistroServiceTest::debeLanzarExcepcion_cuandoIdNoExisteAlAprobar` | **VERDE** | RuntimeException |
| **TC-SOL-11** | `SolicitudRegistroServiceTest::debeRechazarSolicitudYAsignarFechaRevision_cuandoSeRechazaConMotivo` | **ROJO** | BUG-04: rechazar actualiza fechaEnvio en vez de fechaRevision |
| **TC-SOL-12** | `SolicitudRegistroServiceTest::debeRechazarSolicitudSinMotivo_cuandoMotivoEsNulo` | **VERDE** | Rechazo sin motivo |
| **TC-SOL-13** | `SolicitudRegistroServiceTest::debeLanzarExcepcion_cuandoSolicitudNoEstaPendienteAlRechazar` | **VERDE** | Control de transición |
| **TC-SOL-14** | `SolicitudRegistroServiceTest::debeLanzarExcepcion_cuandoIdNoExisteAlRechazar` | **VERDE** | RuntimeException |
| **TC-DEP-01** | `DeportistaServiceTest::debeCrearDeportistaConClub_cuandoDatosSonValidos` | **VERDE** | Asociación de club existente |
| **TC-DEP-02** | `DeportistaServiceTest::debeCrearDeportistaSinClub_cuandoClubIdEsNulo` | **VERDE** | Deportista libre |
| **TC-DEP-03** | `DeportistaServiceTest::debeLanzarExcepcion_cuandoClubIdNoExiste` | **VERDE** | Club inexistente lanza RuntimeException |
| **TC-DEP-04** | `DeportistaServiceTest::debeListarTodosLosDeportistas` | **VERDE** | Consulta global |
| **TC-DEP-05** | `DeportistaServiceTest::debeObtenerDeportistaPorId_cuandoIdExiste` | **VERDE** | Consulta por ID |
| **TC-DEP-06** | `DeportistaServiceTest::debeLanzarExcepcion_cuandoIdNoExiste` | **VERDE** | RuntimeException |
| **TC-DEP-07** | `DeportistaServiceTest::debeListarDeportistasPorClub_cuandoClubExiste` | **VERDE** | Filtro por club |
| **TC-DEP-08** | `DeportistaServiceTest::debeListarDeportistasConDeporteAdaptado` | **VERDE** | Filtro deporteAdaptado |
| **TC-DEP-09** | `DeportistaServiceTest::debeBuscarDeportistasPorDeporte` | **VERDE** | Búsqueda por disciplina |
| **TC-DEP-10** | `DeportistaServiceTest::debeActualizarDeportista_cuandoDatosSonValidos` | **VERDE** | Modificación de datos |
| **TC-DEP-11** | `DeportistaServiceTest::debeLanzarExcepcion_cuandoDeportistaAActualizarNoExiste` | **VERDE** | RuntimeException |
| **TC-DEP-12** | `DeportistaServiceTest::debeLanzarExcepcion_cuandoClubAAsociarEnActualizacionNoExiste` | **VERDE** | RuntimeException |
| **TC-DEP-13** | `DeportistaServiceTest::debeEliminarDeportista_cuandoIdExiste` | **VERDE** | Invocación de deleteById |
| **TC-DEP-14** | `DeportistaServiceTest::debeLanzarExcepcion_cuandoDeportistaAEliminarNoExiste` | **VERDE** | RuntimeException |
| **TC-ADM-01** | `AdminServiceTest::debeAprobarSolicitudYCrearDeportista_cuandoSolicitudEsPendiente` | **VERDE** | Crea deportista |
| **TC-ADM-02** | `AdminServiceTest::debeAsignarPerfilCreadoIdASolicitud_cuandoSeApruebaDeportista` | **ROJO** | BUG-03A: AdminService no completa perfilCreadoId |
| **TC-ADM-03** | `AdminServiceTest::debeLanzarExcepcion_cuandoSolicitudDeportistaYaFueAprobada` | **VERDE** | IllegalArgumentException |
| **TC-ADM-04** | `AdminServiceTest::debeLanzarExcepcion_cuandoSolicitudDeportistaNoExiste` | **VERDE** | IllegalArgumentException |
| **TC-ADM-05** | `AdminServiceTest::noDebeAprobarSolicitud_cuandoFallaCreacionDeportistaPorClubInexistente` | **ROJO** | BUG-03B: solicitud queda APROBADO sin perfil |
| **TC-ADM-06** | `AdminServiceTest::debeAprobarSolicitudYCrearClub_cuandoSolicitudEsPendiente` | **VERDE** | Crea club |
| **TC-ADM-07** | `AdminServiceTest::debeAsignarPerfilCreadoIdASolicitud_cuandoSeApruebaClub` | **ROJO** | BUG-03A: AdminService no completa perfilCreadoId |
| **TC-ADM-08** | `AdminServiceTest::debeLanzarExcepcion_cuandoSolicitudClubYaFueAprobada` | **VERDE** | IllegalArgumentException |
| **TC-ADM-09** | `AdminServiceTest::debeLanzarExcepcion_cuandoSolicitudClubNoExiste` | **VERDE** | IllegalArgumentException |
| **TC-ADM-10** | `AdminServiceTest::debeRechazarSolicitudConMotivo_cuandoSolicitudEsPendiente` | **VERDE** | Marca RECHAZADO |
| **TC-ADM-11** | `AdminServiceTest::debeLanzarExcepcion_cuandoSolicitudARechazarYaEstaRechazada` | **VERDE** | IllegalArgumentException |
| **TC-ADM-12** | `AdminServiceTest::debeLanzarExcepcion_cuandoSolicitudARechazarNoExiste` | **VERDE** | IllegalArgumentException |
| **TC-CTR-SOL-01** | `SolicitudRegistroControllerTest::debePermitirCrearSolicitud_cuandoDatosSonValidosSinAutenticacion` | **VERDE** | Endpoint público POST /api/solicitudes (201) |
| **TC-CTR-SOL-02** | `SolicitudRegistroControllerTest::debeRetornar400_cuandoTipoEsNulo` | **VERDE** | Bad Request por @NotNull |
| **TC-CTR-SOL-03** | `SolicitudRegistroControllerTest::debeRetornar400_cuandoDatosAdjuntosEsNulo` | **VERDE** | Bad Request por @NotBlank |
| **TC-CTR-SOL-04** | `SolicitudRegistroControllerTest::debeRetornar400_cuandoDatosAdjuntosEsVacio` | **VERDE** | Bad Request por @NotBlank |
| **TC-CTR-SOL-05** | `SolicitudRegistroControllerTest::debeRetornar400_cuandoJsonEsMalformado` | **VERDE** | Bad Request por error sintáctico |
| **TC-CTR-SOL-06** | `SolicitudRegistroControllerTest::debeRetornar400_cuandoTipoEstaFueraDelEnum` | **VERDE** | Bad Request por enum inválido |
| **TC-CTR-SOL-07** | `SolicitudRegistroControllerTest::debeRetornar401_cuandoSeListanSolicitudesSinCredenciales` | **VERDE** | Exige HTTP Basic ADMIN |
| **TC-CTR-SOL-08** | `SolicitudRegistroControllerTest::debeRetornar200_cuandoSeListanSolicitudesConAdmin` | **VERDE** | 200 OK con credenciales ADMIN |
| **TC-CTR-SOL-09** | `SolicitudRegistroControllerTest::debeRetornar401_cuandoSeObtienePorIdSinCredenciales` | **VERDE** | Exige HTTP Basic ADMIN |
| **TC-CTR-SOL-10** | `SolicitudRegistroControllerTest::debeRetornar200_cuandoSeObtienePorIdConAdmin` | **VERDE** | 200 OK con credenciales ADMIN |
| **TC-CTR-SOL-11** | `SolicitudRegistroControllerTest::debeRetornar404_cuandoSeConsultaSolicitudInexistente` | **ROJO** | BUG-01: Lanza RuntimeException no capturada (500 en vez de 404) |
| **TC-CTR-SOL-12** | `SolicitudRegistroControllerTest::debeRetornar401_cuandoSeApruebaSinCredenciales` | **VERDE** | Exige HTTP Basic ADMIN |
| **TC-CTR-SOL-13** | `SolicitudRegistroControllerTest::debeRetornar200_cuandoSeApruebaSolicitudValidaConAdmin` | **VERDE** | PATCH aprobar con ADMIN (200) |
| **TC-CTR-SOL-14** | `SolicitudRegistroControllerTest::debeRetornar404_cuandoSeApruebaSolicitudInexistente` | **ROJO** | BUG-01: Lanza RuntimeException no capturada (500 en vez de 404) |
| **TC-CTR-SOL-15** | `SolicitudRegistroControllerTest::debeRetornar401_cuandoSeRechazaSinCredenciales` | **VERDE** | Exige HTTP Basic ADMIN |
| **TC-CTR-SOL-16** | `SolicitudRegistroControllerTest::debeRetornar200_cuandoSeRechazaConMotivoConAdmin` | **VERDE** | PATCH rechazar con motivo (200) |
| **TC-CTR-SOL-17** | `SolicitudRegistroControllerTest::debeRetornar200_cuandoSeRechazaSinMotivoConAdmin` | **VERDE** | PATCH rechazar sin motivo (200) |
| **TC-CTR-SOL-18** | `SolicitudRegistroControllerTest::debeRetornar404_cuandoSeRechazaSolicitudInexistente` | **ROJO** | BUG-01: Lanza RuntimeException no capturada (500 en vez de 404) |
| **TC-CTR-ADM-01** | `AdminControllerTest::debeRetornar401_cuandoSeApruebaDeportistaSinCredenciales` | **VERDE** | Exige HTTP Basic ADMIN |
| **TC-CTR-ADM-02** | `AdminControllerTest::debeRetornar201_cuandoDatosSonValidosYConAdmin` | **VERDE** | POST /api/admin/deportista/{id} (201) |
| **TC-CTR-ADM-03** | `AdminControllerTest::debeRetornar400_cuandoDtoTieneCamposInvalidos` | **VERDE** | Validación DTO (400) |
| **TC-CTR-ADM-04** | `AdminControllerTest::debeRetornar404_cuandoSolicitudDeportistaNoExiste` | **ROJO** | BUG-01: Devuelve 400 por IllegalArgumentException en vez de 404 |
| **TC-CTR-ADM-05** | `AdminControllerTest::debeRetornar400_cuandoSolicitudYaEstaAprobada` | **VERDE** | 400 Bad Request |
| **TC-CTR-ADM-06** | `AdminControllerTest::debeRetornar400_cuandoDeportistaTieneClubIdInexistente` | **ROJO** | BUG-03B: Devuelve 500 por RuntimeException en lugar de 400 |
| **TC-CTR-ADM-07** | `AdminControllerTest::debeRetornar401_cuandoSeApruebaClubSinCredenciales` | **VERDE** | Exige HTTP Basic ADMIN |
| **TC-CTR-ADM-08** | `AdminControllerTest::debeRetornar201_cuandoDatosSonValidosYConAdmin` | **VERDE** | POST /api/admin/club/{id} (201) |
| **TC-CTR-ADM-09** | `AdminControllerTest::debeRetornar400_cuandoDtoClubTieneCamposVacios` | **VERDE** | Validación DTO (400) |
| **TC-CTR-ADM-10** | `AdminControllerTest::debeRetornar404_cuandoSolicitudClubNoExiste` | **ROJO** | BUG-01: Devuelve 400 por IllegalArgumentException en vez de 404 |
| **TC-CTR-ADM-11** | `AdminControllerTest::debeRetornar400_cuandoSolicitudClubYaEstaAprobada` | **VERDE** | 400 Bad Request |
| **TC-CTR-ADM-12** | `AdminControllerTest::debeRetornar401_cuandoSeRechazaSinCredenciales` | **VERDE** | Exige HTTP Basic ADMIN |
| **TC-CTR-ADM-13** | `AdminControllerTest::debeRetornar200_cuandoSeRechazaConAdmin` | **VERDE** | PUT /api/admin/rechazar (200) |
| **TC-CTR-ADM-14** | `AdminControllerTest::debeRetornar404_cuandoSolicitudARechazarNoExiste` | **ROJO** | BUG-01: Devuelve 400 por IllegalArgumentException en vez de 404 |
| **TC-CTR-ADM-15** | `AdminControllerTest::debeRetornar400_cuandoSolicitudYaEstaRechazada` | **VERDE** | 400 Bad Request |
| **TC-CTR-CLU-01** | `ClubControllerTest::debeRetornar200_cuandoListarClubesSinCredenciales` | **VERDE** | GET público /api/clubes (200) |
| **TC-CTR-CLU-02** | `ClubControllerTest::debeRetornar200_cuandoObtenerClubPorIdExistenteSinCredenciales` | **VERDE** | GET público /api/clubes/{id} (200) |
| **TC-CTR-CLU-03** | `ClubControllerTest::debeRetornar404_cuandoObtenerClubPorIdInexistente` | **ROJO** | BUG-01: Lanza RuntimeException no capturada (500 en vez de 404) |
| **TC-CTR-CLU-04** | `ClubControllerTest::debeRetornar200_cuandoBuscarPorNombreSinCredenciales` | **VERDE** | Búsqueda pública por nombre |
| **TC-CTR-CLU-05** | `ClubControllerTest::debeRetornar200_cuandoGetClubesConDeporteAdaptado` | **VERDE** | Filtro público adaptado |
| **TC-CTR-CLU-06** | `ClubControllerTest::debeRetornar401_cuandoCrearClubSinCredenciales` | **VERDE** | POST protegido |
| **TC-CTR-CLU-07** | `ClubControllerTest::debeRetornar201_cuandoCrearClubConAdminYDatosValidos` | **VERDE** | POST con credenciales ADMIN (201) |
| **TC-CTR-CLU-08** | `ClubControllerTest::debeRetornar400_cuandoCrearClubConNombreVacio` | **VERDE** | Validación DTO (400) |
| **TC-CTR-CLU-09** | `ClubControllerTest::debeRetornar400_cuandoCrearClubConDireccionVacia` | **VERDE** | Validación DTO (400) |
| **TC-CTR-CLU-10** | `ClubControllerTest::debeRetornar401_cuandoActualizarClubSinCredenciales` | **VERDE** | PUT protegido |
| **TC-CTR-CLU-11** | `ClubControllerTest::debeRetornar200_cuandoActualizarClubConAdminYDatosValidos` | **VERDE** | PUT con credenciales ADMIN (200) |
| **TC-CTR-CLU-12** | `ClubControllerTest::debeRetornar404_cuandoActualizarClubInexistente` | **ROJO** | BUG-01: Lanza RuntimeException no capturada (500 en vez de 404) |
| **TC-CTR-CLU-13** | `ClubControllerTest::debeRetornar204_cuandoEliminarClubConAdminYIdExiste` | **VERDE** | DELETE con credenciales ADMIN (204) |
| **TC-CTR-CLU-14** | `ClubControllerTest::debeRetornar404_cuandoEliminarClubInexistente` | **ROJO** | BUG-01: Lanza RuntimeException no capturada (500 en vez de 404) |
| **TC-CTR-DEP-01** | `DeportistaControllerTest::debeRetornar200_cuandoListarDeportistasSinCredenciales` | **VERDE** | GET público /api/deportistas (200) |
| **TC-CTR-DEP-02** | `DeportistaControllerTest::debeRetornar200_cuandoObtenerDeportistaPorIdExistenteSinCredenciales` | **VERDE** | GET público /api/deportistas/{id} (200) |
| **TC-CTR-DEP-03** | `DeportistaControllerTest::debeRetornar404_cuandoObtenerDeportistaPorIdInexistente` | **ROJO** | BUG-01: Lanza RuntimeException no capturada (500 en vez de 404) |
| **TC-CTR-DEP-04** | `DeportistaControllerTest::debeRetornar200_cuandoListarDeportistasAdaptadosSinCredenciales` | **VERDE** | Filtro público adaptado |
| **TC-CTR-DEP-05** | `DeportistaControllerTest::debeRetornar200_cuandoBuscarPorDeporteSinCredenciales` | **VERDE** | Búsqueda pública por deporte |
| **TC-CTR-DEP-06** | `DeportistaControllerTest::debeRetornar401_cuandoCrearDeportistaSinCredenciales` | **VERDE** | POST protegido |
| **TC-CTR-DEP-07** | `DeportistaControllerTest::debeRetornar201_cuandoCrearDeportistaConAdminYDatosValidos` | **VERDE** | POST con credenciales ADMIN (201) |
| **TC-CTR-DEP-08** | `DeportistaControllerTest::debeRetornar400_cuandoCrearDeportistaConNombreVacio` | **VERDE** | Validación DTO (400) |
| **TC-CTR-DEP-09** | `DeportistaControllerTest::debeRetornar400_cuandoCrearDeportistaConEdadCero` | **VERDE** | Validación DTO @Min(1) |
| **TC-CTR-DEP-10** | `DeportistaControllerTest::debeRetornar401_cuandoActualizarDeportistaSinCredenciales` | **VERDE** | PUT protegido |
| **TC-CTR-DEP-11** | `DeportistaControllerTest::debeRetornar200_cuandoActualizarDeportistaConAdminYDatosValidos` | **VERDE** | PUT con credenciales ADMIN (200) |
| **TC-CTR-DEP-12** | `DeportistaControllerTest::debeRetornar404_cuandoActualizarDeportistaInexistente` | **ROJO** | BUG-01: Lanza RuntimeException no capturada (500 en vez de 404) |
| **TC-CTR-DEP-13** | `DeportistaControllerTest::debeRetornar401_cuandoEliminarDeportistaSinCredenciales` | **VERDE** | Interceptado por SecurityFilterChain (401) |
| **TC-CTR-DEP-14** | `DeportistaControllerTest::debeRetornar204_cuandoEliminarDeportistaConAdminYIdExiste` | **VERDE** | DELETE con credenciales ADMIN (204) |
| **TC-CTR-DEP-15** | `DeportistaControllerTest::debeRetornar404_cuandoEliminarDeportistaInexistente` | **ROJO** | BUG-01: Lanza RuntimeException no capturada (500 en vez de 404) |
| **TC-INT-01** | `PersistenceIntegrationTest::debeGuardarYRecuperarClub_enBaseDeDatosDePrueba` | **VERDE** | Testcontainers PostgreSQL 16 |
| **TC-INT-02** | `PersistenceIntegrationTest::debeBuscarClubesPorNombreIgnoreCase_enBaseDeDatosDePrueba` | **VERDE** | Testcontainers PostgreSQL 16 |
| **TC-INT-03** | `PersistenceIntegrationTest::debeFiltrarClubesConDeporteAdaptado_enBaseDeDatosDePrueba` | **VERDE** | Testcontainers PostgreSQL 16 |
| **TC-INT-04** | `PersistenceIntegrationTest::debeGuardarDeportistaAsociadoAClub_yRecuperarPorClubId` | **VERDE** | Relación ManyToOne en PostgreSQL |
| **TC-INT-05** | `PersistenceIntegrationTest::debeContarCantidadDeportistasPorClub_enBaseDeDatosDePrueba` | **VERDE** | Consulta countByClubId en PostgreSQL |
| **TC-INT-06** | `PersistenceIntegrationTest::debeGuardarYFiltrarSolicitudesPorEstado_enBaseDeDatosDePrueba` | **VERDE** | Persistencia de JSON en columna TEXT |
| **TC-INT-07** | `PersistenceIntegrationTest::debeGuardarYConsultarAdministrador_enBaseDeDatosDePrueba` | **VERDE** | Persistencia de entidad Administrador |
| **TC-INT-08** | `PersistenceIntegrationTest::debeFallarAlSuperarVarchar255EnBaseDeDatos_cuandoNombreSupera255Caracteres` | **VERDE** | Rechazado a nivel PostgreSQL |

---

## 4. Detalle de Defectos Conocidos Detectados

| Bug ID | Descripción | Causa Raíz en Código | Impacto Observado |
| :--- | :--- | :--- | :--- |
| **BUG-01** | ID inexistente devuelve 400 o 500 en vez de 404 | `GlobalExceptionHandler` solo maneja `IllegalArgumentException` devolviendo 400. Las `RuntimeException` de los servicios no son capturadas y resultan en 500. | Inconsistencia REST: el cliente recibe error interno de servidor o Bad Request en lugar de recurso no encontrado (404). |
| **BUG-02A** | Falta validación: Edad máxima (150 años permitida) | `DeportistaRequestDTO` solo tiene `@Min(1)`, carece de `@Max`. | Permite registros con edades biológicamente imposibles. |
| **BUG-02B** | Falta validación: Formato de teléfono con letras | `ClubRequestDTO` y `DeportistaRequestDTO` no poseen `@Pattern` numérico o E.164. | Admite strings alfanuméricos arbitrarios en teléfono. |
| **BUG-02C** | Falta validación: Formato de email | `ClubRequestDTO` y `DeportistaRequestDTO` no poseen `@Email`. | Admite cadenas sin `@` ni dominio como correos válidos. |
| **BUG-02D** | Falta validación: Largo máximo de nombre en DTO | Falta `@Size(max = 255)` en los DTOs. | Cadenas de 256 caracteres pasan la capa web y fallan a nivel base de datos por restricción varchar(255). |
| **BUG-03A** | `AdminService` no completa `perfilCreadoId` | En `aprobarSolicitudDepo` y `aprobarSolicitudClub`, nunca se invoca `solicitud.setPerfilCreadoId(...)`. | La solicitud aprobada queda huérfana de la referencia al perfil creado. |
| **BUG-03B** | `AdminService` no es transaccional y marca `APROBADO` prematuramente | No tiene `@Transactional`. Guarda la solicitud como `APROBADO` antes de crear el perfil. Si falla por `clubId` inexistente, devuelve 500 y la solicitud ya quedó aprobada sin perfil. | Inconsistencia de datos en base de datos y error 500 no controlado. |
| **BUG-04** | `SolicitudRegistroService.rechazar` actualiza `fechaEnvio` | Línea 84 de `SolicitudRegistroService`: hace `solicitud.setFechaEnvio(...)` en lugar de `setFechaRevision(...)`. | Se pierde la fecha original de envío y la fecha de revisión queda nula. |
