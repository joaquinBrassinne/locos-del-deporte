# Posibles bugs detectados por la colección

Ejecución del 29/10/2026 con Newman 6.2.3 contra el backend real (rama principal del repo, Spring Boot 4.0.6, PostgreSQL 16) sobre una BD aislada con DS-01 cargado. Resultado: **63 requests, 4 requests con fallos** (todas las demás aserciones pasan). Los resultados esperados **no se modificaron**: salen de la planilla v1.10 y de los CA del plan v1.1.

| # | Caso | Esperado (planilla / CA) | Obtenido | Sev. sugerida |
| :-: | :--- | :--- | :--- | :---: |
| 1 | **TC-API-03** Actualizar un club inexistente (`PUT /api/clubes/999999`) | HTTP 404 (CA-10.3) | HTTP 500; `RuntimeException: Club no encontrado` | Mayor |
| 2 | **TC-API-07** Eliminar un club inexistente (`DELETE /api/clubes/999999`) | HTTP 404 (CA-10.3) | HTTP 500; `RuntimeException: Club no encontrado` | Mayor |
| 3 | **TC-PA-16** Aprobar club con email inválido (`POST /api/admin/club/{id}`, `"email": "test@"`) | HTTP 400 mencionando `email` | HTTP **201**: el club se crea con el email inválido | Mayor |
| 4 | **TC-SR-07** Solicitud con `tipo: "EQUIPO"` **sin credenciales** (`POST /api/solicitudes`) | HTTP 400 (CA-5.2) | HTTP **401** sin credenciales. Con credenciales de admin sí responde 400 | Crítica |

## Detalle

### 1 y 2 · Ids inexistentes devuelven 500 (BUG-01 de `docs/tests-backend.md`)
`ClubService` lanza `RuntimeException` y `GlobalExceptionHandler` solo mapea `IllegalArgumentException` (→ 400). Misma causa para `DeportistaService` (ver TC-CTR-DEP-03/12/15 en `tests-backend.md`); esta colección solo cubre clubes en la hoja de la planilla.

### 3 · Falta validación de formato de email (BUG-02C)
`ClubRequestDTO` y `DeportistaRequestDTO` no tienen `@Email`. El plan asume «email con formato válido» (hoja «Leyenda y supuestos», punto 4).

### 4 · Los errores 400 del formulario público se ven como 401 para un visitante
Reproducible con `curl` sin credenciales:

```bash
curl -i -X POST http://localhost:8080/api/solicitudes -H "Content-Type: application/json" -d '{"tipo":"EQUIPO","datosAdjuntos":"{}"}'   # 401
curl -i -u AdminRoot:locos1234 -X POST ... (mismo body)                                                                                  # 400
```

Mismo efecto con `tipo: null` y con JSON malformado. Causa probable (hipótesis, no verificada en código): Spring Boot redirige el error a `/error`, y `SecurityConfig` no permite ese path (`anyRequest().authenticated()`), así que Spring Security responde 401 antes de mostrar el 400. Afecta a los casos TC-SR-03, 04, 08, 09 y 10 cuando se ejecutan sin autenticación. La planilla los marca PASS probablemente porque se ejecutaron con Swagger autorizado. Esto significa que el visitante que completa mal el formulario nunca ve el error de validación.

## Diferencias con el estado registrado en la planilla

- **TC-API-12** (DELETE de deportista sin credenciales): la planilla lo marca FAIL («HTTP 204 sin credenciales»). En esta ejecución respondió **401** y el deportista siguió existiendo, es decir que **ya no reproduce**. Conviene reejecutarlo a mano y actualizar la planilla (la ejecución original pudo hacerse con una versión anterior de `SecurityConfig`).
- **TC-API-03 y TC-API-07** coinciden con la planilla (FAIL, 500).
- **TC-PA-13** (nombre vacío) y los TC-API-04 / TC-API-11 pasan, y el body del 400 menciona el campo.

## Observación adicional (no es un caso de la planilla)

Las respuestas 500 incluyen el campo `trace` con el stack trace completo en el body. Probablemente lo activa `spring-boot-devtools` (declarado como dependencia en `pom.xml`); verificar que no llegue a un entorno productivo.

## Casos que no se pudieron verificar con esta colección

- **TC-AU-05 y TC-AU-10** dependen de DS-01; pasan con DS-01 cargado.
- **TC-AU-11** requiere reiniciar el backend y SQL.
- Los pasos con TablePlus se reemplazaron por `GET` equivalentes (el detalle de columnas `perfil_creado_id`, `fecha_revision` no se verifica salvo que el `GET` de la solicitud lo exponga).
