package com.pp2.crazySports.service.club;

import com.pp2.crazySports.dto.club.ClubMapaDTO;
import com.pp2.crazySports.dto.club.ClubRequestDTO;
import com.pp2.crazySports.dto.club.ClubResponseDTO;

import java.util.List;

public interface IClubService {
    ClubResponseDTO crearClub(ClubRequestDTO dto);
    List<ClubResponseDTO> listarClubes();
    ClubResponseDTO obtenerClubPorId(Long id);
    List<ClubResponseDTO> buscarPorNombre(String nombre);
    ClubResponseDTO actualizarClub(Long id, ClubRequestDTO dto);
    void eliminarClub(Long id);
    List<ClubResponseDTO> listarClubesConDeporteAdaptado();
    List<ClubResponseDTO> listarPorDisciplina(String disciplina);
    List<ClubResponseDTO> listarDeporteAdaptado();
    List<ClubMapaDTO> obtenerCoordenadas();
}
