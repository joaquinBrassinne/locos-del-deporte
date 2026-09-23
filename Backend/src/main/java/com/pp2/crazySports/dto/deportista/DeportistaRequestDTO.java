package com.pp2.crazySports.dto.deportista;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class DeportistaRequestDTO {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El deporte es obligatorio")
    private String deporte;

    @Min(value = 1, message = "La edad debe ser mayor a 0")
    private Integer edad;

    private String historia;
    private String logros;
    private String sitioWebUrl;
    private List<String> fotos;
    private String telefono;
    private String email;
    private Boolean deporteAdaptado;
    private Long clubId;  // opcional

}
