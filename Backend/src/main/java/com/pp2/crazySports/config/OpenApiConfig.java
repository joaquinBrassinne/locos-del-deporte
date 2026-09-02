package com.pp2.crazySports.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "API LOCOS DEL DEPORTE",
                version = "0.0.3",
                description = "Documentacion de la API"
)
)
public class OpenApiConfig {
}
