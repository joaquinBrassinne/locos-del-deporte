package com.pp2.crazySports.model.solicitud;

import com.pp2.crazySports.model.enums.EstadoSolicitud;
import com.pp2.crazySports.model.enums.TipoSolicitud;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "solicitudes_registro")
@Getter
@Setter
@NoArgsConstructor
public class SolicitudRegistro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // CLUB o DEPORTISTA
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoSolicitud tipo;

    // PENDIENTE, APROBADO, RECHAZADO
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoSolicitud estado = EstadoSolicitud.PENDIENTE;

    // Todos los datos del formulario guardados como JSON
    @Column(columnDefinition = "TEXT", nullable = false)
    private String datosAdjuntos;

    // Fecha en que se envió la solicitud
    @Column(nullable = false)
    private LocalDateTime fechaEnvio = LocalDateTime.now();

    // Fecha en que el admin la revisó
    private LocalDateTime fechaRevision;

    // Mensaje opcional del admin al rechazar
    @Column(columnDefinition = "TEXT")
    private String motivoRechazo;

    // ID del perfil creado una vez aprobado (Club o Deportista)
    private Long perfilCreadoId;
}