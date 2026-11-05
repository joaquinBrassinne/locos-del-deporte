#!/usr/bin/env bash
# Corre la coleccion con Newman y genera reporte HTML (evidencia).
cd "$(dirname "$0")/../postman" || exit 1
npx --yes -p newman -p newman-reporter-htmlextra newman run CrazySports.postman_collection.json \
  -r cli,htmlextra --reporter-htmlextra-export ../reporte-postman.html
