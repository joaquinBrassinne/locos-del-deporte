package com.pp2.crazySports.dto.solicitud;

import com.pp2.crazySports.model.enums.EstadoSolicitud;
import com.pp2.crazySports.model.enums.TipoSolicitud;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class SolicitudResponseDTO {
    private Long id;
    private TipoSolicitud tipo;
    private EstadoSolicitud estado;
    private String datosAdjuntos;
    private LocalDateTime fechaEnvio;
    private LocalDateTime fechaRevision;
    private String motivoRechazo;
    private Long perfilCreadoId;
}
