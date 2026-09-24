package com.pp2.crazySports.controller.club;

import com.pp2.crazySports.dto.club.ClubRequestDTO;
import com.pp2.crazySports.dto.club.ClubResponseDTO;
import com.pp2.crazySports.service.club.IClubService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubes")
@RequiredArgsConstructor
public class ClubController {

    private final IClubService clubService;


    @PostMapping
    public ResponseEntity<ClubResponseDTO> crearClub(@Valid @RequestBody ClubRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clubService.crearClub(dto));
    }

    @GetMapping
    public ResponseEntity<List<ClubResponseDTO>> listarClubes() {
        return ResponseEntity.status(HttpStatus.OK).body(clubService.listarClubes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClubResponseDTO> obtenerClub(@PathVariable Long id) {
        return ResponseEntity.ok(clubService.obtenerClubPorId(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ClubResponseDTO>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(clubService.buscarPorNombre(nombre));
    }

    @GetMapping("/adaptado")
    public ResponseEntity<List<ClubResponseDTO>> getClubesConDeporteAdaptado() {
        return ResponseEntity.ok(clubService.listarClubesConDeporteAdaptado());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClubResponseDTO> actualizarClub(@PathVariable Long id,@Valid @RequestBody ClubRequestDTO dto) {
        return ResponseEntity.ok(clubService.actualizarClub(id,dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarClub(@PathVariable Long id) {
        clubService.eliminarClub(id);
        return ResponseEntity.noContent().build();
    }
}
