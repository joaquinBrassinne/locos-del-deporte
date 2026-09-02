package com.pp2.crazySports.dto.club;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter @AllArgsConstructor
public class ClubResponseDTO {
    private Long id;
    private String nombreInstitucion;
    private String direccion;
    private String coordenadas;
    private String sitioWebUrl;
    private int cantidadDeportistas;
    private String email;
    private String telefono;
    private String disciplinas;        // "Fútbol, Básquet, Natación"
    private String descripcion;        // Texto libre sobre el club
    private String horarios;           // "Lunes a Viernes 8:00 - 22:00"
    private Boolean deporteAdaptado;
    private List<String> fotos;
}
