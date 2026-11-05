#!/usr/bin/env bash
# JUnit + Testcontainers + JaCoCo (requiere Docker activo). Reporte: Backend/target/site/jacoco/index.html
cd "$(dirname "$0")/../../Backend" && ./mvnw clean test
