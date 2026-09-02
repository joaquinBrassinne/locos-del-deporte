package com.pp2.crazySports.service.deportista;

import com.pp2.crazySports.dto.deportista.DeportistaRequestDTO;
import com.pp2.crazySports.dto.deportista.DeportistaResponseDTO;
import com.pp2.crazySports.model.club.Club;
import com.pp2.crazySports.model.deportista.Deportista;
import com.pp2.crazySports.repository.IClubRepository;
import com.pp2.crazySports.repository.IDeportistaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeportistaService implements IDeportistaService {

    private final IDeportistaRepository deportistaRepository;
    private final IClubRepository clubRepository;

    @Override
    @Transactional
    public DeportistaResponseDTO crearDeportista(DeportistaRequestDTO deportistaRequestDTO) {
        Deportista d = new Deportista();
        d.setNombre(deportistaRequestDTO.getNombre());
        d.setDeporte(deportistaRequestDTO.getDeporte());
        d.setEdad(deportistaRequestDTO.getEdad());
        d.setHistoria(deportistaRequestDTO.getHistoria());
        d.setLogros(deportistaRequestDTO.getLogros());
        d.setSitioWebUrl(deportistaRequestDTO.getSitioWebUrl());
        d.setEmail(deportistaRequestDTO.getEmail());
        d.setTelefono(deportistaRequestDTO.getTelefono());
        d.setDeporteAdaptado(deportistaRequestDTO.getDeporteAdaptado());
        d.setClub(resolverClub(deportistaRequestDTO.getClubId()));
        if (deportistaRequestDTO.getFotos() != null) d.setFotos(deportistaRequestDTO.getFotos());
        return toResponseDTO(deportistaRepository.save(d));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeportistaResponseDTO> listDeportistas() {
        return listarDeportistas();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeportistaResponseDTO> listarDeportistas() {
        return deportistaRepository.findAll().stream()
                .map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DeportistaResponseDTO obtenerDeportistaPorId(Long id) {
        return toResponseDTO(deportistaRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Deportista no encontrada")));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeportistaResponseDTO> listDeportistasPorClub(Long id) {
        return deportistaRepository.findByClubId(id).stream()
                .map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DeportistaResponseDTO actualizarDeportista(Long id, DeportistaRequestDTO dto) {
        Deportista d = deportistaRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Deportista no encontrada"));
        d.setNombre(dto.getNombre());
        d.setDeporte(dto.getDeporte());
        d.setEdad(dto.getEdad());
        d.setHistoria(dto.getHistoria());
        d.setLogros(dto.getLogros());
        d.setSitioWebUrl(dto.getSitioWebUrl());
        d.setEmail(dto.getEmail());
        d.setTelefono(dto.getTelefono());
        d.setDeporteAdaptado(dto.getDeporteAdaptado());
        d.setClub(resolverClub(dto.getClubId()));
        if (dto.getFotos() != null) d.setFotos(dto.getFotos());
        return toResponseDTO(deportistaRepository.save(d));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeportistaResponseDTO> listDeportistasConDeporteAdaptado() {
        return listarDeporteAdaptado();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeportistaResponseDTO> listarDeporteAdaptado() {
        return deportistaRepository.findByDeporteAdaptadoTrue()
                .stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeportistaResponseDTO> buscarPorDeporte(String deporte) {
        return listarPorDeporte(deporte);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeportistaResponseDTO> listarPorDeporte(String deporte) {
        return deportistaRepository.findByDeporteIgnoreCase(deporte)
                .stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarDeportista(Long id) {
        if (!deportistaRepository.existsById(id))
            throw new RuntimeException("Deportista no encontrada");
        deportistaRepository.deleteById(id);
    }

    private Club resolverClub(Long clubId) {
        if (clubId == null) return null;
        return clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club no encontrado con id: " + clubId));
    }

    private DeportistaResponseDTO toResponseDTO(Deportista d) {
        return new DeportistaResponseDTO(
                d.getId(), d.getNombre(), d.getDeporte(), d.getEdad(),
                d.getHistoria(), d.getLogros(), d.getSitioWebUrl(), d.getFotos(),
                d.getEmail(), d.getTelefono(), d.getDeporteAdaptado(),
                d.getClub() != null ? d.getClub().getNombreInstitucion() : null,
                d.getClub() != null ? d.getClub().getId() : null
                );
    }
}
