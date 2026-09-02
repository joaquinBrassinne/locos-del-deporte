package com.pp2.crazySports.dto.club;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class ClubRequestDTO {
    @NotBlank(message = "El nombre de la institución es obligatorio")
    private String nombreInstitucion;

    @NotBlank(message = "La dirección es obligatoria")
    private String direccion;

    private String coordenadas;   // "-32.1712,-64.3450"
    private String sitioWebUrl;
    private List<String> fotos;
    private String email;
    private String telefono;
    private String disciplinas;        // "Fútbol, Básquet, Natación"
    private String descripcion;        // Texto libre sobre el club
    private String horarios;           // "Lunes a Viernes 8:00 - 22:00"
    private Boolean deporteAdaptado = false;
}
