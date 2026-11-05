package com.pp2.crazySports.dto.deportista;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class DeportistaResponseDTO {
    private Long id;
    private String nombre;
    private String deporte;
    private Integer edad;
    private String historia;
    private String logros;
    private String sitioWebUrl;
    private List<String> fotos;
    private String telefono;
    private String email;
    private Boolean deporteAdaptado;
    private String clubNombre;  // null si no pertenece a ningún club
    private Long clubId;
}
