package com.pp2.crazySports.service.club;

import com.pp2.crazySports.dto.club.ClubMapaDTO;
import com.pp2.crazySports.dto.club.ClubRequestDTO;
import com.pp2.crazySports.dto.club.ClubResponseDTO;
import com.pp2.crazySports.model.club.Club;
import com.pp2.crazySports.repository.IClubRepository;
import com.pp2.crazySports.repository.IDeportistaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClubService implements IClubService {

    private final IClubRepository clubRepository;
    private final IDeportistaRepository deportistaRepository;

    @Override
    @Transactional
    public ClubResponseDTO crearClub(ClubRequestDTO dto) {
        if(clubRepository.existsByNombreInstitucionIgnoreCase(dto.getNombreInstitucion()))
            throw new IllegalArgumentException("Ya existe un club con el nombre: " + dto.getNombreInstitucion());

        Club club = new Club();
        club.setNombreInstitucion(dto.getNombreInstitucion());
        club.setDireccion(dto.getDireccion());
        club.setCoordenadas(dto.getCoordenadas());
        club.setSitioWebUrl(dto.getSitioWebUrl());
        club.setEmail(dto.getEmail());
        club.setTelefono(dto.getTelefono());
        club.setDisciplinas(dto.getDisciplinas());
        club.setDescripcion(dto.getDescripcion());
        club.setHorarios(dto.getHorarios());
        club.setDeporteAdaptado(dto.getDeporteAdaptado());
        if (dto.getFotos() != null) club.setFotos(dto.getFotos());

        return toResponseDTO(clubRepository.save(club));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClubResponseDTO> listarClubes() {
        return clubRepository.findAll().stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ClubResponseDTO obtenerClubPorId(Long id) {
        return toResponseDTO(clubRepository.findById(id).orElseThrow(()-> new RuntimeException("Club no encontrado")));
    }


    //REFACTOR, NO ANDA BIEN!
    @Override
    @Transactional(readOnly = true)
    public List<ClubResponseDTO> buscarPorNombre(String nombre) {
        return clubRepository.findByNombreInstitucionContainingIgnoreCase(nombre).stream()
                .map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ClubResponseDTO actualizarClub(Long id, ClubRequestDTO dto) {
        Club club = clubRepository.findById(id).orElseThrow(()-> new RuntimeException("Club no encontrado"));

        club.setNombreInstitucion(dto.getNombreInstitucion());
        club.setDireccion(dto.getDireccion());
        club.setCoordenadas(dto.getCoordenadas());
        club.setSitioWebUrl(dto.getSitioWebUrl());
        club.setEmail(dto.getEmail());
        club.setTelefono(dto.getTelefono());
        club.setDisciplinas(dto.getDisciplinas());
        club.setDescripcion(dto.getDescripcion());
        club.setHorarios(dto.getHorarios());
        club.setDeporteAdaptado(dto.getDeporteAdaptado());
        if (dto.getFotos() != null) club.setFotos(dto.getFotos());

        return toResponseDTO(clubRepository.save(club));
    }

    @Override
    @Transactional
    public void eliminarClub(Long id) {
        if (!clubRepository.existsById(id)) throw new RuntimeException("Club no encontrado");
        clubRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClubResponseDTO> listarClubesConDeporteAdaptado() {
        return listarDeporteAdaptado();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClubResponseDTO> listarPorDisciplina(String disciplina) {
        return clubRepository.findByDisciplinasContainingIgnoreCase(disciplina)
                .stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClubResponseDTO> listarDeporteAdaptado() {
        return clubRepository.findByDeporteAdaptadoTrue()
                .stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClubMapaDTO> obtenerCoordenadas() {
        return clubRepository.findCoordenadas()
            .stream()
            .map(row -> new ClubMapaDTO(
                    ((Number) row[0]).longValue(),
                    (String) row[2],   // nombreInstitucion
                    (String) row[1]))  // coordenadas
            .collect(Collectors.toList());
    }

    private ClubResponseDTO toResponseDTO(Club c) {
        int cantDeportistas = (int) deportistaRepository.countByClubId(c.getId());
        return new ClubResponseDTO(
                c.getId(), c.getNombreInstitucion(), c.getDireccion(),
                c.getCoordenadas(), c.getSitioWebUrl(), cantDeportistas,
                c.getEmail(), c.getTelefono(), c.getDisciplinas(),
                c.getDescripcion(), c.getHorarios(), c.getDeporteAdaptado(), c.getFotos());
    }
}
