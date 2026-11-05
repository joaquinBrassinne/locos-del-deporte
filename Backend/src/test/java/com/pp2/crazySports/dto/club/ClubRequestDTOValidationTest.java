package com.pp2.crazySports.dto.club;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class ClubRequestDTOValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private ClubRequestDTO crearDtoValido() {
        ClubRequestDTO dto = new ClubRequestDTO();
        dto.setNombreInstitucion("Club Atlético Central");
        dto.setDireccion("Av. Libertad 1234");
        dto.setEmail("contacto@clubcentral.com");
        dto.setTelefono("3519876543");
        dto.setDisciplinas("Fútbol, Vóley");
        dto.setDeporteAdaptado(false);
        dto.setFotos(List.of("foto1.jpg"));
        return dto;
    }

    @Test
    @DisplayName("TC-VAL-11 debeSerValido_cuandoTodosLosCamposSonCorrectos")
    void debeSerValido_cuandoTodosLosCamposSonCorrectos() {
        ClubRequestDTO dto = crearDtoValido();
        Set<ConstraintViolation<ClubRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
    }

    @Test
    @DisplayName("TC-VAL-12 debeFallar_cuandoNombreInstitucionEsVacio")
    void debeFallar_cuandoNombreInstitucionEsVacio() {
        ClubRequestDTO dto = crearDtoValido();
        dto.setNombreInstitucion("   ");
        Set<ConstraintViolation<ClubRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("nombreInstitucion")));
    }

    @Test
    @DisplayName("TC-VAL-13 debeFallar_cuandoDireccionEsVacia")
    void debeFallar_cuandoDireccionEsVacia() {
        ClubRequestDTO dto = crearDtoValido();
        dto.setDireccion("");
        Set<ConstraintViolation<ClubRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("direccion")));
    }

    @Test
    @Tag("bug-conocido") // BUG-02D: Falta validación largo máximo de nombre (varchar 255)
    @DisplayName("TC-VAL-14 debeFallar_cuandoNombreInstitucionSupera255Caracteres")
    void debeFallar_cuandoNombreInstitucionSupera255Caracteres() {
        ClubRequestDTO dto = crearDtoValido();
        dto.setNombreInstitucion("C".repeat(256));
        Set<ConstraintViolation<ClubRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("nombreInstitucion")),
                "Esperado fallo por superar 255 caracteres en nombreInstitucion (@Size(max=255))");
    }

    @Test
    @Tag("bug-conocido") // BUG-02B: Falta validación de formato de teléfono
    @DisplayName("TC-VAL-15 debeFallar_cuandoTelefonoContieneLetras")
    void debeFallar_cuandoTelefonoContieneLetras() {
        ClubRequestDTO dto = crearDtoValido();
        dto.setTelefono("telefono-invalido");
        Set<ConstraintViolation<ClubRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("telefono")),
                "Esperado fallo por teléfono con caracteres no numéricos");
    }

    @Test
    @Tag("bug-conocido") // BUG-02C: Falta validación de email
    @DisplayName("TC-VAL-16 debeFallar_cuandoEmailEsInvalido")
    void debeFallar_cuandoEmailEsInvalido() {
        ClubRequestDTO dto = crearDtoValido();
        dto.setEmail("correo-sin-formato");
        Set<ConstraintViolation<ClubRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")),
                "Esperado fallo por email sin formato válido (@Email)");
    }
}
