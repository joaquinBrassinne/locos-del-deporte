package com.pp2.crazySports.config;

import org.junit.jupiter.api.DisplayName;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("TC-SEC-03 debePermitirAccesoPublico_cuandoGetClubes")
    void debePermitirAccesoPublico_cuandoGetClubes() throws Exception {
        mockMvc.perform(get("/api/clubes"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-SEC-04 debePermitirAccesoPublico_cuandoGetDeportistas")
    void debePermitirAccesoPublico_cuandoGetDeportistas() throws Exception {
        mockMvc.perform(get("/api/deportistas"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-SEC-05 debePermitirAccesoPublico_cuandoPostSolicitudes")
    void debePermitirAccesoPublico_cuandoPostSolicitudes() throws Exception {
        String jsonBody = "{\"tipo\":\"CLUB\",\"datosAdjuntos\":\"{\\\"nombreInstitucion\\\":\\\"Club Test\\\"}\"}";

        mockMvc.perform(post("/api/solicitudes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonBody))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("TC-SEC-06 debeRechazarCon401_cuandoGetSolicitudesSinCredenciales")
    void debeRechazarCon401_cuandoGetSolicitudesSinCredenciales() throws Exception {
        mockMvc.perform(get("/api/solicitudes"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC-SEC-07 debePermitirAccesoCon200_cuandoGetSolicitudesConAdmin")
    void debePermitirAccesoCon200_cuandoGetSolicitudesConAdmin() throws Exception {
        mockMvc.perform(get("/api/solicitudes")
                        .with(httpBasic("AdminTest", "test1234")))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-SEC-08 debeRechazarCon401_cuandoAccesoAAdminSinCredenciales")
    void debeRechazarCon401_cuandoAccesoAAdminSinCredenciales() throws Exception {
        mockMvc.perform(post("/api/admin/club/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC-SEC-09 debeRechazarCon401_cuandoPutClubesSinCredenciales")
    void debeRechazarCon401_cuandoPutClubesSinCredenciales() throws Exception {
        mockMvc.perform(put("/api/clubes/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC-SEC-10 debeRechazarCon401_cuandoDeleteClubesSinCredenciales")
    void debeRechazarCon401_cuandoDeleteClubesSinCredenciales() throws Exception {
        mockMvc.perform(delete("/api/clubes/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC-SEC-11 debeRechazarCon401_cuandoPutDeportistasSinCredenciales")
    void debeRechazarCon401_cuandoPutDeportistasSinCredenciales() throws Exception {
        mockMvc.perform(put("/api/deportistas/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Tag("bug-conocido") // BUG-05: DELETE /api/deportistas/{id} responde 204 sin credenciales (debería ser 401)
    @DisplayName("TC-SEC-12 debeRechazarCon401_cuandoDeleteDeportistasSinCredenciales")
    void debeRechazarCon401_cuandoDeleteDeportistasSinCredenciales() throws Exception {
        mockMvc.perform(delete("/api/deportistas/999"))
                .andExpect(status().isUnauthorized());
    }
}
