package com.pp2.crazySports.controller.deportista;

import com.pp2.crazySports.dto.deportista.DeportistaRequestDTO;
import com.pp2.crazySports.dto.deportista.DeportistaResponseDTO;
import com.pp2.crazySports.service.deportista.IDeportistaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deportistas")
@RequiredArgsConstructor
public class DeportistaController {
    private final IDeportistaService deportistaService;


    @PostMapping
    public ResponseEntity<DeportistaResponseDTO> crearDeportista(@Valid @RequestBody DeportistaRequestDTO deportistaRequestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(deportistaService.crearDeportista(deportistaRequestDTO));
    }

    @GetMapping
    public ResponseEntity<List<DeportistaResponseDTO>> listarDeportistas() {
        return ResponseEntity.ok(deportistaService.listDeportistas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeportistaResponseDTO> findDeportistaPorId(@PathVariable Long id) {
        return ResponseEntity.ok(deportistaService.obtenerDeportistaPorId(id));
    }

    @GetMapping("/adaptado")
    public ResponseEntity<List<DeportistaResponseDTO>> listarDeportistasAdaptados() {
        return ResponseEntity.ok(deportistaService.listDeportistasConDeporteAdaptado());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<DeportistaResponseDTO>> buscarDeportistasPorDeporte(@RequestParam String deporte) {
        return ResponseEntity.ok(deportistaService.buscarPorDeporte(deporte));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeportistaResponseDTO> actualizarDeportista(@PathVariable Long id, @Valid @RequestBody DeportistaRequestDTO deportistaRequestDTO) {
        return ResponseEntity.ok(deportistaService.actualizarDeportista(id, deportistaRequestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDeportista(@PathVariable Long id) {
        deportistaService.eliminarDeportista(id);
        return ResponseEntity.noContent().build();
    }
}
