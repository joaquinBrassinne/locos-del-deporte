package com.pp2.crazySports.controller.solicitud;

import com.pp2.crazySports.dto.solicitud.SolicitudRequestDTO;
import com.pp2.crazySports.dto.solicitud.SolicitudResponseDTO;
import com.pp2.crazySports.service.solicitud.ISolicitudService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
@RequiredArgsConstructor
public class SolicitudRegistroController {

    private final ISolicitudService service;

    // Club o Deportista envía su formulario
    @PostMapping
    public ResponseEntity<SolicitudResponseDTO> enviarSolicitud(
            @Valid @RequestBody SolicitudRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.enviarSolicitud(dto));
    }

    // Admin lista solicitudes por estado: PENDIENTE, APROBADO, RECHAZADO
    @GetMapping
    public ResponseEntity<List<SolicitudResponseDTO>> listar(
            @RequestParam(defaultValue = "PENDIENTE") String estado) {
        return ResponseEntity.ok(service.listarPorEstado(estado));
    }

    // Admin ve el detalle de una solicitud
    @GetMapping("/{id}")
    public ResponseEntity<SolicitudResponseDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    // Admin aprueba → se crea el perfil automáticamente
    @PatchMapping("/{id}/aprobar")
    public ResponseEntity<SolicitudResponseDTO> aprobar(@PathVariable Long id) {
        return ResponseEntity.ok(service.aprobar(id));
    }

    // Admin rechaza con motivo opcional
    @PatchMapping("/{id}/rechazar")
    public ResponseEntity<SolicitudResponseDTO> rechazar(
            @PathVariable Long id,
            @RequestParam(required = false) String motivo) {
        return ResponseEntity.ok(service.rechazar(id, motivo));
    }
}
