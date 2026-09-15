package com.pp2.crazySports.dto.club;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ClubMapaDTO {
    private Long id;
    private String nombreInstitucion;
    private String coordenadas;
}
