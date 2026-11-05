package com.pp2.crazySports.dto.solicitud;

import com.pp2.crazySports.model.enums.TipoSolicitud;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SolicitudRequestDTO {

    @NotNull(message = "El tipo de solicitud es obligatorio (CLUB o DEPORTISTA)")
    private TipoSolicitud tipo;

    // JSON con los datos del formulario según el tipo
    // Si tipo=CLUB      → { "nombreInstitucion": "...", "direccion": "...", ... }
    // Si tipo=DEPORTISTA → { "nombre": "...", "deporte": "...", "historia": "...", ... }
    @NotBlank(message = "Los datos del formulario son obligatorios")
    private String datosAdjuntos;
}