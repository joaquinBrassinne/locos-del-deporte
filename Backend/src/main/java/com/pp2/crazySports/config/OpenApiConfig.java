package com.pp2.crazySports.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;


@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "API LOCOS DEL DEPORTE",
                version = "0.0.3",
                description = "Documentacion de la API"
)
)
public class OpenApiConfig  {
    @Bean 
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new io.swagger.v3.oas.models.info.Info()
                .title("Locos del Deporte API")
                .version("1.0")
                .description("API REST para la plataforma deportiva de Río Tercero"))
            .addSecurityItem(new io.swagger.v3.oas.models.security.SecurityRequirement().addList("basicAuth"))
            .components(new Components()
                .addSecuritySchemes("basicAuth", new io.swagger.v3.oas.models.security.SecurityScheme()
                    .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP)
                    .scheme("basic")
                    .description("Usuario y contraseña del administrador")));
    }
}
