package com.pp2.crazySports.service.deportista;

import com.pp2.crazySports.dto.deportista.DeportistaRequestDTO;
import com.pp2.crazySports.dto.deportista.DeportistaResponseDTO;

import java.util.List;

public interface IDeportistaService {

    DeportistaResponseDTO crearDeportista(DeportistaRequestDTO deportistaRequestDTO);
    List<DeportistaResponseDTO> listDeportistas();
    DeportistaResponseDTO obtenerDeportistaPorId(Long id);
    List<DeportistaResponseDTO> listDeportistasPorClub(Long id);
    DeportistaResponseDTO actualizarDeportista(Long id, DeportistaRequestDTO dto);
    List<DeportistaResponseDTO> listDeportistasConDeporteAdaptado();
    List<DeportistaResponseDTO> buscarPorDeporte(String deporte);
    void eliminarDeportista(Long id);
}
