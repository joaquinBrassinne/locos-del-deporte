package com.pp2.crazySports.controller.adminController;

import com.pp2.crazySports.dto.club.ClubRequestDTO;
import com.pp2.crazySports.dto.club.ClubResponseDTO;
import com.pp2.crazySports.dto.deportista.DeportistaRequestDTO;
import com.pp2.crazySports.dto.deportista.DeportistaResponseDTO;
import com.pp2.crazySports.service.admin.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;



    @PostMapping("/deportista/{id}")
    public ResponseEntity<DeportistaResponseDTO> aprobarDeportista(@PathVariable Long id, @Valid @RequestBody DeportistaRequestDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.aprobarSolicitudDepo(id, dto));
    }

    @PostMapping("/club/{id}")
    public ResponseEntity<ClubResponseDTO> aprobarClub(@PathVariable Long id, @Valid @RequestBody ClubRequestDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.aprobarSolicitudClub(id, dto));
    }

    @PutMapping("/rechazar/{id}/{motivo}")
    public ResponseEntity<String> rechazar(@PathVariable Long id, @PathVariable String motivo){
        return ResponseEntity.ok(adminService.rechazarSolicitud(id, motivo));
    }
}
