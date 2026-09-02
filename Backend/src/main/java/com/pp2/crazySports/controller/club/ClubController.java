package com.pp2.crazySports.controller.club;

import com.pp2.crazySports.dto.club.ClubMapaDTO;
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

    @GetMapping("/mapa")
    public ResponseEntity<List<ClubMapaDTO>> obtenerMapa() {
        return ResponseEntity.ok(clubService.obtenerCoordenadas());
    }

    @GetMapping("/adaptado")
    public ResponseEntity<List<ClubResponseDTO>> clubesAdaptados() {
        return ResponseEntity.ok(clubService.listarDeporteAdaptado());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ClubResponseDTO>> buscar(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String disciplina) {
        if (disciplina != null) return ResponseEntity.ok(clubService.listarPorDisciplina(disciplina));
        if (nombre != null) return ResponseEntity.ok(clubService.buscarPorNombre(nombre));
        return ResponseEntity.ok(clubService.listarClubes());
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
