package com.pp2.crazySports.controller.club;

import com.pp2.crazySports.dto.club.ClubRequestDTO;
import com.pp2.crazySports.dto.club.ClubResponseDTO;
import com.pp2.crazySports.service.club.IClubService;
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
class ClubControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private IClubService clubService;

    private Long crearClubPrueba(String nombre) {
        ClubRequestDTO dto = new ClubRequestDTO();
        dto.setNombreInstitucion(nombre);
        dto.setDireccion("Av. Costanera 1000");
        dto.setEmail("info@" + nombre.replaceAll("\\s+", "").toLowerCase() + ".com");
        dto.setTelefono("3511122334");
        dto.setDeporteAdaptado(false);
        ClubResponseDTO res = clubService.crearClub(dto);
        return res.getId();
    }

    @Nested
    @DisplayName("GET /api/clubes - Consultas públicas")
    class ConsultasPublicasEndpointTests {

        @Test
        @DisplayName("TC-CTR-CLU-01 debeRetornar200_cuandoListarClubesSinCredenciales")
        void debeRetornar200_cuandoListarClubesSinCredenciales() throws Exception {
            mockMvc.perform(get("/api/clubes"))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("TC-CTR-CLU-02 debeRetornar200_cuandoObtenerClubPorIdExistenteSinCredenciales")
        void debeRetornar200_cuandoObtenerClubPorIdExistenteSinCredenciales() throws Exception {
            Long id = crearClubPrueba("Club Get Test " + System.currentTimeMillis());

            mockMvc.perform(get("/api/clubes/" + id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id));
        }

        @Test
        @Tag("bug-conocido") // BUG-01: Id inexistente devuelve 500 en lugar de 404
        @DisplayName("TC-CTR-CLU-03 debeRetornar404_cuandoObtenerClubPorIdInexistente")
        void debeRetornar404_cuandoObtenerClubPorIdInexistente() throws Exception {
            mockMvc.perform(get("/api/clubes/999999"))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("TC-CTR-CLU-04 debeRetornar200_cuandoBuscarPorNombreSinCredenciales")
        void debeRetornar200_cuandoBuscarPorNombreSinCredenciales() throws Exception {
            mockMvc.perform(get("/api/clubes/buscar")
                            .param("nombre", "Atlético"))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("TC-CTR-CLU-05 debeRetornar200_cuandoGetClubesConDeporteAdaptado")
        void debeRetornar200_cuandoGetClubesConDeporteAdaptado() throws Exception {
            mockMvc.perform(get("/api/clubes/adaptado"))
                    .andExpect(status().isOk());
        }
    }

    @Nested
    @DisplayName("POST /api/clubes - Crear Club (Protegido)")
    class CrearClubEndpointTests {

        @Test
        @DisplayName("TC-CTR-CLU-06 debeRetornar401_cuandoCrearClubSinCredenciales")
        void debeRetornar401_cuandoCrearClubSinCredenciales() throws Exception {
            mockMvc.perform(post("/api/clubes")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-CTR-CLU-07 debeRetornar201_cuandoCrearClubConAdminYDatosValidos")
        void debeRetornar201_cuandoCrearClubConAdminYDatosValidos() throws Exception {
            String clubName = "Club Post Test " + System.currentTimeMillis();
            String json = """
                    {
                        "nombreInstitucion": "%s",
                        "direccion": "Av. Colón 1234",
                        "email": "contacto@posttest.com",
                        "telefono": "3519998877"
                    }
                    """.formatted(clubName);

            mockMvc.perform(post("/api/clubes")
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").exists());
        }

        @Test
        @DisplayName("TC-CTR-CLU-08 debeRetornar400_cuandoCrearClubConNombreVacio")
        void debeRetornar400_cuandoCrearClubConNombreVacio() throws Exception {
            String json = """
                    {
                        "nombreInstitucion": "",
                        "direccion": "Av. Colón 1234"
                    }
                    """;

            mockMvc.perform(post("/api/clubes")
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("TC-CTR-CLU-09 debeRetornar400_cuandoCrearClubConDireccionVacia")
        void debeRetornar400_cuandoCrearClubConDireccionVacia() throws Exception {
            String json = """
                    {
                        "nombreInstitucion": "Club Con Direccion Vacia",
                        "direccion": ""
                    }
                    """;

            mockMvc.perform(post("/api/clubes")
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("PUT y DELETE /api/clubes/{id} - Modificar y Eliminar Club (Protegido)")
    class ModificarYEliminarClubEndpointTests {

        @Test
        @DisplayName("TC-CTR-CLU-10 debeRetornar401_cuandoActualizarClubSinCredenciales")
        void debeRetornar401_cuandoActualizarClubSinCredenciales() throws Exception {
            mockMvc.perform(put("/api/clubes/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-CTR-CLU-11 debeRetornar200_cuandoActualizarClubConAdminYDatosValidos")
        void debeRetornar200_cuandoActualizarClubConAdminYDatosValidos() throws Exception {
            Long id = crearClubPrueba("Club Antes Update " + System.currentTimeMillis());
            String updatedName = "Club Despues Update " + System.currentTimeMillis();
            String json = """
                    {
                        "nombreInstitucion": "%s",
                        "direccion": "Nueva Direccion 456",
                        "email": "update@club.com",
                        "telefono": "3515556677"
                    }
                    """.formatted(updatedName);

            mockMvc.perform(put("/api/clubes/" + id)
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(id));
        }

        @Test
        @Tag("bug-conocido") // BUG-01: Id inexistente devuelve 500 en lugar de 404
        @DisplayName("TC-CTR-CLU-12 debeRetornar404_cuandoActualizarClubInexistente")
        void debeRetornar404_cuandoActualizarClubInexistente() throws Exception {
            String json = """
                    {
                        "nombreInstitucion": "Club Inexistente",
                        "direccion": "Direccion 123"
                    }
                    """;

            mockMvc.perform(put("/api/clubes/999999")
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("TC-CTR-CLU-13 debeRetornar204_cuandoEliminarClubConAdminYIdExiste")
        void debeRetornar204_cuandoEliminarClubConAdminYIdExiste() throws Exception {
            Long id = crearClubPrueba("Club A Eliminar " + System.currentTimeMillis());

            mockMvc.perform(delete("/api/clubes/" + id)
                            .with(httpBasic("AdminTest", "test1234")))
                    .andExpect(status().isNoContent());
        }

        @Test
        @Tag("bug-conocido") // BUG-01: Id inexistente devuelve 500 en lugar de 404
        @DisplayName("TC-CTR-CLU-14 debeRetornar404_cuandoEliminarClubInexistente")
        void debeRetornar404_cuandoEliminarClubInexistente() throws Exception {
            mockMvc.perform(delete("/api/clubes/999999")
                            .with(httpBasic("AdminTest", "test1234")))
                    .andExpect(status().isNotFound());
        }
    }
}
