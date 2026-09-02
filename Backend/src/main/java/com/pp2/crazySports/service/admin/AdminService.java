package com.pp2.crazySports.service.admin;

import com.pp2.crazySports.dto.club.ClubRequestDTO;
import com.pp2.crazySports.dto.club.ClubResponseDTO;
import com.pp2.crazySports.dto.deportista.DeportistaRequestDTO;
import com.pp2.crazySports.dto.deportista.DeportistaResponseDTO;
import com.pp2.crazySports.model.enums.EstadoSolicitud;
import com.pp2.crazySports.model.solicitud.SolicitudRegistro;
import com.pp2.crazySports.repository.ISolicitudRegistroRepository;
import com.pp2.crazySports.service.club.IClubService;
import com.pp2.crazySports.service.deportista.IDeportistaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class AdminService implements IAdminService{
    private final IClubService clubService;
    private final IDeportistaService deportistaService;
    private final ISolicitudRegistroRepository solicitudRepository;


    @Override
    public DeportistaResponseDTO aprobarSolicitudDepo(Long solicitudId, DeportistaRequestDTO dto) {
        SolicitudRegistro solicitud = solicitudRepository.findById(solicitudId).orElseThrow(() -> new IllegalArgumentException("La solicitud con ID " + solicitudId + " no existe."));
        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
            throw new IllegalArgumentException("La solicitud no es pendiente");
        }
        solicitud.setEstado(EstadoSolicitud.APROBADO);
        solicitud.setFechaRevision(LocalDateTime.now());
        solicitudRepository.save(solicitud);

        return deportistaService.crearDeportista(dto);
    }

    @Override
    public String rechazarSolicitud(Long solicitudId, String motivo) {
        SolicitudRegistro solicitud = solicitudRepository.findById(solicitudId).orElseThrow(() -> new IllegalArgumentException("La solicitud con ID " + solicitudId + " no existe."));

        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
            throw new IllegalArgumentException("La solicitud no es pendiente");
        }

        solicitud.setEstado(EstadoSolicitud.RECHAZADO);
        solicitud.setFechaRevision(LocalDateTime.now());
        solicitud.setMotivoRechazo(motivo);
        solicitudRepository.save(solicitud);

        return "Solicitud Rechazada";
    }

    @Override
    public ClubResponseDTO aprobarSolicitudClub(Long solicitudId, ClubRequestDTO dto) {
        SolicitudRegistro solicitud = solicitudRepository.findById(solicitudId).orElseThrow(() -> new IllegalArgumentException("La solicitud con ID " + solicitudId + " no existe."));
        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
            throw new IllegalArgumentException("La solicitud no es pendiente");
        }
        solicitud.setEstado(EstadoSolicitud.APROBADO);
        solicitud.setFechaRevision(LocalDateTime.now());
        solicitudRepository.save(solicitud);
        return clubService.crearClub(dto);
    }




}
