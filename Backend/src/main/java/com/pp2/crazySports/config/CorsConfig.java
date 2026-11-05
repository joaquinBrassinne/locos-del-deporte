package com.pp2.crazySports.config;

/**
 * La configuración de CORS para Spring Security y la API REST está centralizada
 * en {@link SecurityConfig#corsConfigurationSource()} para evitar filtros duplicados
 * y headers Access-Control-Allow-Origin repetidos.
 */
public class CorsConfig {
    // Centralizado en SecurityConfig
}