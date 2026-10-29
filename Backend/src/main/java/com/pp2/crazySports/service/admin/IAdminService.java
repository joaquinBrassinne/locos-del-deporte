package com.pp2.crazySports.service.admin;

import com.pp2.crazySports.dto.club.ClubRequestDTO;
import com.pp2.crazySports.dto.club.ClubResponseDTO;
import com.pp2.crazySports.dto.deportista.DeportistaRequestDTO;
import com.pp2.crazySports.dto.deportista.DeportistaResponseDTO;

public interface IAdminService {
    DeportistaResponseDTO aprobarSolicitudDepo(Long solicitudId, DeportistaRequestDTO dto);
    String rechazarSolicitud(Long solicitudId, String motivo);
    ClubResponseDTO aprobarSolicitudClub(Long solicictudId, ClubRequestDTO dto);
}
