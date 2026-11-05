#!/usr/bin/env bash
# Smoke manual de la API con curl (evidencia rápida para el video).
B=${BASE:-http://localhost:8080}; A="AdminRoot:locos1234"; J='Content-Type: application/json'
c() { printf '%-50s -> ' "$1"; shift; curl -s -o /dev/null -w '%{http_code}\n' "$@"; }
c "GET  /api/clubes publico (200)"            "$B/api/clubes"
c "GET  /api/solicitudes sin auth (401)"      "$B/api/solicitudes"
c "GET  /api/solicitudes admin (200)"         -u "$A" "$B/api/solicitudes"
c "GET  clave incorrecta (401)"               -u AdminRoot:mal "$B/api/solicitudes"
c "POST solicitud valida (201)"               -H "$J" -d '{"tipo":"CLUB","datosAdjuntos":"{\"nombreInstitucion\":\"X\"}"}' "$B/api/solicitudes"
c "POST solicitud sin tipo (400)"             -H "$J" -d '{"datosAdjuntos":"{}"}' "$B/api/solicitudes"
c "POST club sin auth (401)"                  -H "$J" -d '{}' "$B/api/clubes"
c "POST club email invalido (esperado 400)"   -u "$A" -H "$J" -d '{"nombreInstitucion":"T","direccion":"D","email":"mal"}' "$B/api/clubes"
c "SQLi en buscar (<500)"                     "$B/api/clubes/buscar?nombre=%27%20OR%20%271%27=%271"
