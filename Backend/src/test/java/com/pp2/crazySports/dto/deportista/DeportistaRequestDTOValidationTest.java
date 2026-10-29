package com.pp2.crazySports.dto.deportista;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class DeportistaRequestDTOValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private DeportistaRequestDTO crearDtoValido() {
        DeportistaRequestDTO dto = new DeportistaRequestDTO();
        dto.setNombre("Juan Pérez");
        dto.setDeporte("Fútbol");
        dto.setEdad(25);
        dto.setEmail("juan.perez@example.com");
        dto.setTelefono("3511234567");
        dto.setDeporteAdaptado(false);
        return dto;
    }

    @Test
    @DisplayName("TC-VAL-01 debeSerValido_cuandoTodosLosCamposSonCorrectos")
    void debeSerValido_cuandoTodosLosCamposSonCorrectos() {
        DeportistaRequestDTO dto = crearDtoValido();
        Set<ConstraintViolation<DeportistaRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
    }

    @Test
    @DisplayName("TC-VAL-02 debeFallar_cuandoNombreEsVacio")
    void debeFallar_cuandoNombreEsVacio() {
        DeportistaRequestDTO dto = crearDtoValido();
        dto.setNombre("   ");
        Set<ConstraintViolation<DeportistaRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("nombre")));
    }

    @Test
    @DisplayName("TC-VAL-03 debeFallar_cuandoDeporteEsVacio")
    void debeFallar_cuandoDeporteEsVacio() {
        DeportistaRequestDTO dto = crearDtoValido();
        dto.setDeporte("");
        Set<ConstraintViolation<DeportistaRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("deporte")));
    }

    @Test
    @DisplayName("TC-VAL-04 debeFallar_cuandoEdadEsNegativa")
    void debeFallar_cuandoEdadEsNegativa() {
        DeportistaRequestDTO dto = crearDtoValido();
        dto.setEdad(-1);
        Set<ConstraintViolation<DeportistaRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("edad")));
    }

    @Test
    @DisplayName("TC-VAL-05 debeFallar_cuandoEdadEsCero")
    void debeFallar_cuandoEdadEsCero() {
        DeportistaRequestDTO dto = crearDtoValido();
        dto.setEdad(0);
        Set<ConstraintViolation<DeportistaRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("edad")));
    }

    @Test
    @DisplayName("TC-VAL-06 debeSerValido_cuandoEdadEsUno")
    void debeSerValido_cuandoEdadEsUno() {
        DeportistaRequestDTO dto = crearDtoValido();
        dto.setEdad(1);
        Set<ConstraintViolation<DeportistaRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("edad")));
    }

    @Test
    @Tag("bug-conocido") // BUG-02A: Falta validación de edad máxima
    @DisplayName("TC-VAL-07 debeFallar_cuandoEdadSuperaLimiteMaximo")
    void debeFallar_cuandoEdadSuperaLimiteMaximo() {
        DeportistaRequestDTO dto = crearDtoValido();
        dto.setEdad(150);
        Set<ConstraintViolation<DeportistaRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("edad")),
                "Esperado fallo por edad máxima permitida (ej: @Max(120))");
    }

    @Test
    @Tag("bug-conocido") // BUG-02D: Falta validación largo máximo de nombre (varchar 255)
    @DisplayName("TC-VAL-08 debeFallar_cuandoNombreSupera255Caracteres")
    void debeFallar_cuandoNombreSupera255Caracteres() {
        DeportistaRequestDTO dto = crearDtoValido();
        dto.setNombre("A".repeat(256));
        Set<ConstraintViolation<DeportistaRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("nombre")),
                "Esperado fallo por superar 255 caracteres en nombre (@Size(max=255))");
    }

    @Test
    @Tag("bug-conocido") // BUG-02B: Falta validación de formato de teléfono
    @DisplayName("TC-VAL-09 debeFallar_cuandoTelefonoContieneLetras")
    void debeFallar_cuandoTelefonoContieneLetras() {
        DeportistaRequestDTO dto = crearDtoValido();
        dto.setTelefono("11-abc-44");
        Set<ConstraintViolation<DeportistaRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("telefono")),
                "Esperado fallo por formato inválido de teléfono");
    }

    @Test
    @Tag("bug-conocido") // BUG-02C: Falta validación de email
    @DisplayName("TC-VAL-10 debeFallar_cuandoEmailEsInvalido")
    void debeFallar_cuandoEmailEsInvalido() {
        DeportistaRequestDTO dto = crearDtoValido();
        dto.setEmail("correo-invalido-sin-arroba");
        Set<ConstraintViolation<DeportistaRequestDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")),
                "Esperado fallo por formato inválido de email (@Email)");
    }
}
