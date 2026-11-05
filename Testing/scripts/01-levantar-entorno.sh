#!/usr/bin/env bash
# Levanta DB (Docker), backend (Spring) y frontend (Vite). Ejecutar desde la raíz del repo, en Git Bash.
set -e
docker compose up -d postgres
echo "Esperando Postgres..."; sleep 8
(cd Backend && ./mvnw spring-boot:run > ../Testing/backend.log 2>&1 &)
(cd Frontend && npm install && npm run dev > ../Testing/frontend.log 2>&1 &)
echo "Esperando API..."
until curl -s -o /dev/null http://localhost:8080/api/clubes; do sleep 3; done
echo "API OK  -> http://l
