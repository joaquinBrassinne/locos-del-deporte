package com.pp2.crazySports.dto.solicitud;

import com.pp2.crazySports.model.enums.TipoSolicitud;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class SolicitudRequestDTOValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    @DisplayName("TC-VAL-17 debeSerValido_cuandoTipoYDatosAdjuntosSonCorrectos")
    void debeSerValido_cuandoTipoYDatosAdjuntosSonCorrectos() {
        SolicitudRequestDTO dto = new SolicitudRequestDTO();
        dto.setTipo(TipoSolicitud.CLUB);
        dto.setDatosAdjuntos("{\"nombreInstitucion\":\"Club Sol\"}");

        Set<ConstraintViolation<SolicitudRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
    }

    @Test
    @DisplayName("TC-VAL-18 debeFallar_cuandoTipoEsNulo")
    void debeFallar_cuandoTipoEsNulo() {
        SolicitudRequestDTO dto = new SolicitudRequestDTO();
        dto.setTipo(null);
        dto.setDatosAdjuntos("{\"nombre\":\"Juan\"}");

        Set<ConstraintViolation<SolicitudRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("tipo")));
    }

    @Test
    @DisplayName("TC-VAL-19 debeFallar_cuandoDatosAdjuntosEsNulo")
    void debeFallar_cuandoDatosAdjuntosEsNulo() {
        SolicitudRequestDTO dto = new SolicitudRequestDTO();
        dto.setTipo(TipoSolicitud.DEPORTISTA);
        dto.setDatosAdjuntos(null);

        Set<ConstraintViolation<SolicitudRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("datosAdjuntos")));
    }

    @Test
    @DisplayName("TC-VAL-20 debeFallar_cuandoDatosAdjuntosEsVacio")
    void debeFallar_cuandoDatosAdjuntosEsVacio() {
        SolicitudRequestDTO dto = new SolicitudRequestDTO();
        dto.setTipo(TipoSolicitud.DEPORTISTA);
        dto.setDatosAdjuntos("   ");

        Set<ConstraintViolation<SolicitudRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("datosAdjuntos")));
    }
}
