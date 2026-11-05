package com.pp2.crazySports.service.solicitud;

import com.pp2.crazySports.dto.solicitud.SolicitudRequestDTO;
import com.pp2.crazySports.dto.solicitud.SolicitudResponseDTO;

import java.util.List;

public interface ISolicitudService {
    SolicitudResponseDTO enviarSolicitud(SolicitudRequestDTO dto);
    List<SolicitudResponseDTO> listarPorEstado(String tipo);
    SolicitudResponseDTO aprobar(Long id);
    SolicitudResponseDTO rechazar(Long id, String motivo);
    SolicitudResponseDTO obtenerPorId(Long id);
}
