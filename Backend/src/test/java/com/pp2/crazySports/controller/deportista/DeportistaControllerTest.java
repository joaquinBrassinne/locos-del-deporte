package com.pp2.crazySports.controller.deportista;

import com.pp2.crazySports.dto.deportista.DeportistaRequestDTO;
import com.pp2.crazySports.dto.deportista.DeportistaResponseDTO;
import com.pp2.crazySports.service.deportista.IDeportistaService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DeportistaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private IDeportistaService deportistaService;

    private Long crearDeportistaPrueba(String nombre) {
        DeportistaRequestDTO dto = new DeportistaRequestDTO();
        dto.setNombre(nombre);
        dto.setDeporte("Natación");
        dto.setEdad(22);
        dto.setEmail("deportista@test.com");
        dto.setTelefono("351112233");
        dto.setDeporteAdaptado(false);
        DeportistaResponseDTO res = deportistaService.crearDeportista(dto);
        return res.getId();
    }

    @Nested
    @DisplayName("GET /api/deportistas - Consultas públicas")
    class ConsultasPublicasEndpointTests {

        @Test
        @DisplayName("TC-CTR-DEP-01 debeRetornar200_cuandoListarDeportistasSinCredenciales")
        void debeRetornar200_cuandoListarDeportistasSinCredenciales() throws Exception {
            mockMvc.perform(get("/api/deportistas"))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("TC-CTR-DEP-02 debeRetornar200_cuandoObtenerDeportistaPorIdExistenteSinCredenciales")
        void debeRetornar200_cuandoObtenerDeportistaPorIdExistenteSinCredenciales() throws Exception {
            Long id = crearDeportistaPrueba("Nadador Test " + System.currentTimeMillis());

            mockMvc.perform(get("/api/deportistas/" + id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id));
        }

        @Test
        @Tag("bug-conocido") // BUG-01: Id inexistente devuelve 500 en lugar de 404
        @DisplayName("TC-CTR-DEP-03 debeRetornar404_cuandoObtenerDeportistaPorIdInexistente")
        void debeRetornar404_cuandoObtenerDeportistaPorIdInexistente() throws Exception {
            mockMvc.perform(get("/api/deportistas/999999"))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("TC-CTR-DEP-04 debeRetornar200_cuandoListarDeportistasAdaptadosSinCredenciales")
        void debeRetornar200_cuandoListarDeportistasAdaptadosSinCredenciales() throws Exception {
            mockMvc.perform(get("/api/deportistas/adaptado"))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("TC-CTR-DEP-05 debeRetornar200_cuandoBuscarPorDeporteSinCredenciales")
        void debeRetornar200_cuandoBuscarPorDeporteSinCredenciales() throws Exception {
            mockMvc.perform(get("/api/deportistas/buscar")
                            .param("deporte", "Natación"))
                    .andExpect(status().isOk());
        }
    }

    @Nested
    @DisplayName("POST /api/deportistas - Crear Deportista (Protegido)")
    class CrearDeportistaEndpointTests {

        @Test
        @DisplayName("TC-CTR-DEP-06 debeRetornar401_cuandoCrearDeportistaSinCredenciales")
        void debeRetornar401_cuandoCrearDeportistaSinCredenciales() throws Exception {
            mockMvc.perform(post("/api/deportistas")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-CTR-DEP-07 debeRetornar201_cuandoCrearDeportistaConAdminYDatosValidos")
        void debeRetornar201_cuandoCrearDeportistaConAdminYDatosValidos() throws Exception {
            String json = """
                    {
                        "nombre": "Paula Pareto",
                        "deporte": "Judo",
                        "edad": 38,
                        "email": "paula@judo.com",
                        "telefono": "1144556677",
                        "deporteAdaptado": false
                    }
                    """;

            mockMvc.perform(post("/api/deportistas")
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").exists())
                    .andExpect(jsonPath("$.nombre").value("Paula Pareto"));
        }

        @Test
        @DisplayName("TC-CTR-DEP-08 debeRetornar400_cuandoCrearDeportistaConNombreVacio")
        void debeRetornar400_cuandoCrearDeportistaConNombreVacio() throws Exception {
            String json = """
                    {
                        "nombre": "",
                        "deporte": "Judo",
                        "edad": 30
                    }
                    """;

            mockMvc.perform(post("/api/deportistas")
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("TC-CTR-DEP-09 debeRetornar400_cuandoCrearDeportistaConEdadCero")
        void debeRetornar400_cuandoCrearDeportistaConEdadCero() throws Exception {
            String json = """
                    {
                        "nombre": "Atleta",
                        "deporte": "Judo",
                        "edad": 0
                    }
                    """;

            mockMvc.perform(post("/api/deportistas")
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("PUT y DELETE /api/deportistas/{id} - Modificar y Eliminar Deportista (Protegido)")
    class ModificarYEliminarDeportistaEndpointTests {

        @Test
        @DisplayName("TC-CTR-DEP-10 debeRetornar401_cuandoActualizarDeportistaSinCredenciales")
        void debeRetornar401_cuandoActualizarDeportistaSinCredenciales() throws Exception {
            mockMvc.perform(put("/api/deportistas/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-CTR-DEP-11 debeRetornar200_cuandoActualizarDeportistaConAdminYDatosValidos")
        void debeRetornar200_cuandoActualizarDeportistaConAdminYDatosValidos() throws Exception {
            Long id = crearDeportistaPrueba("Atleta Antes Update " + System.currentTimeMillis());
            String json = """
                    {
                        "nombre": "Atleta Despues Update",
                        "deporte": "Atletismo",
                        "edad": 25,
                        "email": "update@atleta.com",
                        "telefono": "11998877"
                    }
                    """;

            mockMvc.perform(put("/api/deportistas/" + id)
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id))
                    .andExpect(jsonPath("$.nombre").value("Atleta Despues Update"));
        }

        @Test
        @Tag("bug-conocido") // BUG-01: Id inexistente devuelve 500 en lugar de 404
        @DisplayName("TC-CTR-DEP-12 debeRetornar404_cuandoActualizarDeportistaInexistente")
        void debeRetornar404_cuandoActualizarDeportistaInexistente() throws Exception {
            String json = """
                    {
                        "nombre": "Inexistente",
                        "deporte": "Atletismo",
                        "edad": 25
                    }
                    """;

            mockMvc.perform(put("/api/deportistas/999999")
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isNotFound());
        }

        @Test
        @Tag("bug-conocido") // BUG-05: DELETE /api/deportistas/{id} responde 204 sin credenciales (debería ser 401)
        @DisplayName("TC-CTR-DEP-13 debeRetornar401_cuandoEliminarDeportistaSinCredenciales")
        void debeRetornar401_cuandoEliminarDeportistaSinCredenciales() throws Exception {
            mockMvc.perform(delete("/api/deportistas/999999"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-CTR-DEP-14 debeRetornar204_cuandoEliminarDeportistaConAdminYIdExiste")
        void debeRetornar204_cuandoEliminarDeportistaConAdminYIdExiste() throws Exception {
            Long id = crearDeportistaPrueba("Atleta A Eliminar " + System.currentTimeMillis());

            mockMvc.perform(delete("/api/deportistas/" + id)
                            .with(httpBasic("AdminTest", "test1234")))
                    .andExpect(status().isNoContent());
        }

        @Test
        @Tag("bug-conocido") // BUG-01: Id inexistente devuelve 500 en lugar de 404
        @DisplayName("TC-CTR-DEP-15 debeRetornar404_cuandoEliminarDeportistaInexistente")
        void debeRetornar404_cuandoEliminarDeportistaInexistente() throws Exception {
            mockMvc.perform(delete("/api/deportistas/999999")
                            .with(httpBasic("AdminTest", "test1234")))
                    .andExpect(status().isNotFound());
        }
    }
}
