package com.pp2.crazySports.service.solicitud;

import com.pp2.crazySports.dto.club.ClubRequestDTO;
import com.pp2.crazySports.dto.deportista.DeportistaRequestDTO;
import com.pp2.crazySports.dto.solicitud.SolicitudRequestDTO;
import com.pp2.crazySports.dto.solicitud.SolicitudResponseDTO;
import com.pp2.crazySports.model.enums.EstadoSolicitud;
import com.pp2.crazySports.model.enums.TipoSolicitud;
import com.pp2.crazySports.model.solicitud.SolicitudRegistro;
import com.pp2.crazySports.repository.ISolicitudRegistroRepository;
import com.pp2.crazySports.service.club.IClubService;
import com.pp2.crazySports.service.deportista.IDeportistaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SolicitudRegistroService implements ISolicitudService{

    private final ISolicitudRegistroRepository solicitudRegistroRepository;
    private final IClubService clubService;
    private final IDeportistaService deportistaService;
    private final ObjectMapper objectMapper;

    @Override
    public SolicitudResponseDTO enviarSolicitud(SolicitudRequestDTO dto) {
       SolicitudRegistro solicitud = new SolicitudRegistro();
       solicitud.setTipo(dto.getTipo());
       solicitud.setDatosAdjuntos(dto.getDatosAdjuntos());
       solicitud.setEstado(EstadoSolicitud.PENDIENTE);
       solicitud.setFechaEnvio(LocalDateTime.now());
       return toResponseDTO(solicitudRegistroRepository.save(solicitud));
    }

    @Override
    public List<SolicitudResponseDTO> listarPorEstado(String tipo) {
        EstadoSolicitud estadoEnum = EstadoSolicitud.valueOf(tipo.toUpperCase());
        return solicitudRegistroRepository.findByEstado(estadoEnum)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SolicitudResponseDTO obtenerPorId(Long id) {
        return toResponseDTO(solicitudRegistroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada con id: " + id)));
    }

    @Override
    public SolicitudResponseDTO aprobar(Long id) {
        SolicitudRegistro solicitud = solicitudRegistroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada con id: " + id));

        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
            throw new IllegalArgumentException("Solo se pueden aprobar solicitudes con estado Pendientes");
        }

        //Crear el perfil segun el tipo de solicitud
        Long perfilId = crearPerfil(solicitud);

        solicitud.setEstado(EstadoSolicitud.APROBADO);
        solicitud.setFechaRevision(LocalDateTime.now());
        solicitud.setPerfilCreadoId(perfilId);

        return toResponseDTO(solicitudRegistroRepository.save(solicitud));
    }

    @Override
    public SolicitudResponseDTO rechazar(Long id, String motivo) {
        SolicitudRegistro solicitud = solicitudRegistroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada con id: " + id));

        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
            throw new IllegalArgumentException("Solo se pueden rechazar Solicitud con estado pendientes");
        }

        solicitud.setEstado(EstadoSolicitud.RECHAZADO);
        solicitud.setFechaEnvio(LocalDateTime.now());
        solicitud.setMotivoRechazo(motivo);

        return toResponseDTO(solicitudRegistroRepository.save(solicitud));
    }

    private Long crearPerfil(SolicitudRegistro solicitud) {
        try {
            if (solicitud.getTipo() == TipoSolicitud.CLUB) {
                ClubRequestDTO dto = objectMapper.readValue(
                        solicitud.getDatosAdjuntos(),
                        ClubRequestDTO.class);
                return clubService.crearClub(dto).getId();
            }else {
                DeportistaRequestDTO dto = objectMapper.readValue(
                        solicitud.getDatosAdjuntos(),
                        DeportistaRequestDTO.class
                );
                return deportistaService.crearDeportista(dto).getId();
            }
        }
        catch (Exception e) {
            throw new RuntimeException("Error al procesar los datos de la solicitud");
        }
    }


    private SolicitudResponseDTO toResponseDTO(SolicitudRegistro s) {
        return new SolicitudResponseDTO(
                s.getId(), s.getTipo(), s.getEstado(), s.getDatosAdjuntos(),
                s.getFechaEnvio(), s.getFechaRevision(),
                s.getMotivoRechazo(), s.getPerfilCreadoId());
    }
}
