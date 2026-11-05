package com.pp2.crazySports.controller.solicitud;

import com.pp2.crazySports.dto.solicitud.SolicitudResponseDTO;
import com.pp2.crazySports.model.enums.EstadoSolicitud;
import com.pp2.crazySports.model.enums.TipoSolicitud;
import com.pp2.crazySports.service.solicitud.ISolicitudService;
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

import java.time.LocalDateTime;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SolicitudRegistroControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ISolicitudService solicitudService;

    @Nested
    @DisplayName("POST /api/solicitudes - Enviar formulario")
    class EnviarSolicitudEndpointTests {

        @Test
        @DisplayName("TC-CTR-SOL-01 debePermitirCrearSolicitud_cuandoDatosSonValidosSinAutenticacion")
        void debePermitirCrearSolicitud_cuandoDatosSonValidosSinAutenticacion() throws Exception {
            String json = """
                    {
                        "tipo": "CLUB",
                        "datosAdjuntos": "{\\"nombreInstitucion\\":\\"Club Norte\\",\\"direccion\\":\\"Calle 1\\"}"
                    }
                    """;

            mockMvc.perform(post("/api/solicitudes")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").exists())
                    .andExpect(jsonPath("$.estado").value("PENDIENTE"));
        }

        @Test
        @DisplayName("TC-CTR-SOL-02 debeRetornar400_cuandoTipoEsNulo")
        void debeRetornar400_cuandoTipoEsNulo() throws Exception {
            String json = """
                    {
                        "tipo": null,
                        "datosAdjuntos": "{\\"nombre\\":\\"Juan\\"}"
                    }
                    """;

            mockMvc.perform(post("/api/solicitudes")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("TC-CTR-SOL-03 debeRetornar400_cuandoDatosAdjuntosEsNulo")
        void debeRetornar400_cuandoDatosAdjuntosEsNulo() throws Exception {
            String json = """
                    {
                        "tipo": "DEPORTISTA",
                        "datosAdjuntos": null
                    }
                    """;

            mockMvc.perform(post("/api/solicitudes")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("TC-CTR-SOL-04 debeRetornar400_cuandoDatosAdjuntosEsVacio")
        void debeRetornar400_cuandoDatosAdjuntosEsVacio() throws Exception {
            String json = """
                    {
                        "tipo": "DEPORTISTA",
                        "datosAdjuntos": "   "
                    }
                    """;

            mockMvc.perform(post("/api/solicitudes")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("TC-CTR-SOL-05 debeRetornar400_cuandoJsonEsMalformado")
        void debeRetornar400_cuandoJsonEsMalformado() throws Exception {
            String malformedJson = "{ tipo: CLUB, datosAdjuntos: ";

            mockMvc.perform(post("/api/solicitudes")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(malformedJson))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("TC-CTR-SOL-06 debeRetornar400_cuandoTipoEstaFueraDelEnum")
        void debeRetornar400_cuandoTipoEstaFueraDelEnum() throws Exception {
            String json = """
                    {
                        "tipo": "ARBITRO",
                        "datosAdjuntos": "{\\"nombre\\":\\"Arbitro\\"}"
                    }
                    """;

            mockMvc.perform(post("/api/solicitudes")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("GET /api/solicitudes - Listar y consultar")
    class ConsultasEndpointTests {

        @Test
        @DisplayName("TC-CTR-SOL-07 debeRetornar401_cuandoSeListanSolicitudesSinCredenciales")
        void debeRetornar401_cuandoSeListanSolicitudesSinCredenciales() throws Exception {
            mockMvc.perform(get("/api/solicitudes"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-CTR-SOL-08 debeRetornar200_cuandoSeListanSolicitudesConAdmin")
        void debeRetornar200_cuandoSeListanSolicitudesConAdmin() throws Exception {
            mockMvc.perform(get("/api/solicitudes")
                            .with(httpBasic("AdminTest", "test1234"))
                            .param("estado", "PENDIENTE"))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("TC-CTR-SOL-09 debeRetornar401_cuandoSeObtienePorIdSinCredenciales")
        void debeRetornar401_cuandoSeObtienePorIdSinCredenciales() throws Exception {
            mockMvc.perform(get("/api/solicitudes/1"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-CTR-SOL-10 debeRetornar200_cuandoSeObtienePorIdConAdmin")
        void debeRetornar200_cuandoSeObtienePorIdConAdmin() throws Exception {
            // Creamos una solicitud primero
            com.pp2.crazySports.dto.solicitud.SolicitudRequestDTO req = new com.pp2.crazySports.dto.solicitud.SolicitudRequestDTO();
            req.setTipo(TipoSolicitud.CLUB);
            req.setDatosAdjuntos("{\"nombreInstitucion\":\"Club Obtener\"}");
            SolicitudResponseDTO creada = solicitudService.enviarSolicitud(req);

            mockMvc.perform(get("/api/solicitudes/" + creada.getId())
                            .with(httpBasic("AdminTest", "test1234")))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(creada.getId()));
        }

        @Test
        @Tag("bug-conocido") // BUG-01: Id inexistente devuelve 500 en lugar de 404
        @DisplayName("TC-CTR-SOL-11 debeRetornar404_cuandoSeConsultaSolicitudInexistente")
        void debeRetornar404_cuandoSeConsultaSolicitudInexistente() throws Exception {
            mockMvc.perform(get("/api/solicitudes/999999")
                            .with(httpBasic("AdminTest", "test1234")))
                    .andExpect(status().isNotFound());
        }
    }

    @Nested
    @DisplayName("PATCH /api/solicitudes/{id}/aprobar y rechazar")
    class AprobarYRechazarEndpointTests {

        @Test
        @DisplayName("TC-CTR-SOL-12 debeRetornar401_cuandoSeApruebaSinCredenciales")
        void debeRetornar401_cuandoSeApruebaSinCredenciales() throws Exception {
            mockMvc.perform(patch("/api/solicitudes/1/aprobar"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-CTR-SOL-13 debeRetornar200_cuandoSeApruebaSolicitudValidaConAdmin")
        void debeRetornar200_cuandoSeApruebaSolicitudValidaConAdmin() throws Exception {
            com.pp2.crazySports.dto.solicitud.SolicitudRequestDTO req = new com.pp2.crazySports.dto.solicitud.SolicitudRequestDTO();
            req.setTipo(TipoSolicitud.CLUB);
            req.setDatosAdjuntos("{\"nombreInstitucion\":\"Club Para Aprobar\",\"direccion\":\"Calle Falsa 123\"}");
            SolicitudResponseDTO creada = solicitudService.enviarSolicitud(req);

            mockMvc.perform(patch("/api/solicitudes/" + creada.getId() + "/aprobar")
                            .with(httpBasic("AdminTest", "test1234")))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.estado").value("APROBADO"));
        }

        @Test
        @Tag("bug-conocido") // BUG-01: Id inexistente devuelve 500 en lugar de 404
        @DisplayName("TC-CTR-SOL-14 debeRetornar404_cuandoSeApruebaSolicitudInexistente")
        void debeRetornar404_cuandoSeApruebaSolicitudInexistente() throws Exception {
            mockMvc.perform(patch("/api/solicitudes/999999/aprobar")
                            .with(httpBasic("AdminTest", "test1234")))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("TC-CTR-SOL-15 debeRetornar401_cuandoSeRechazaSinCredenciales")
        void debeRetornar401_cuandoSeRechazaSinCredenciales() throws Exception {
            mockMvc.perform(patch("/api/solicitudes/1/rechazar"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-CTR-SOL-16 debeRetornar200_cuandoSeRechazaConMotivoConAdmin")
        void debeRetornar200_cuandoSeRechazaConMotivoConAdmin() throws Exception {
            com.pp2.crazySports.dto.solicitud.SolicitudRequestDTO req = new com.pp2.crazySports.dto.solicitud.SolicitudRequestDTO();
            req.setTipo(TipoSolicitud.DEPORTISTA);
            req.setDatosAdjuntos("{\"nombre\":\"Juan\"}");
            SolicitudResponseDTO creada = solicitudService.enviarSolicitud(req);

            mockMvc.perform(patch("/api/solicitudes/" + creada.getId() + "/rechazar")
                            .with(httpBasic("AdminTest", "test1234"))
                            .param("motivo", "Datos incompletos"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.estado").value("RECHAZADO"))
                    .andExpect(jsonPath("$.motivoRechazo").value("Datos incompletos"));
        }

        @Test
        @DisplayName("TC-CTR-SOL-17 debeRetornar200_cuandoSeRechazaSinMotivoConAdmin")
        void debeRetornar200_cuandoSeRechazaSinMotivoConAdmin() throws Exception {
            com.pp2.crazySports.dto.solicitud.SolicitudRequestDTO req = new com.pp2.crazySports.dto.solicitud.SolicitudRequestDTO();
            req.setTipo(TipoSolicitud.DEPORTISTA);
            req.setDatosAdjuntos("{\"nombre\":\"Pedro\"}");
            SolicitudResponseDTO creada = solicitudService.enviarSolicitud(req);

            mockMvc.perform(patch("/api/solicitudes/" + creada.getId() + "/rechazar")
                            .with(httpBasic("AdminTest", "test1234")))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.estado").value("RECHAZADO"));
        }

        @Test
        @Tag("bug-conocido") // BUG-01: Id inexistente devuelve 500 en lugar de 404
        @DisplayName("TC-CTR-SOL-18 debeRetornar404_cuandoSeRechazaSolicitudInexistente")
        void debeRetornar404_cuandoSeRechazaSolicitudInexistente() throws Exception {
            mockMvc.perform(patch("/api/solicitudes/999999/rechazar")
                            .with(httpBasic("AdminTest", "test1234")))
                    .andExpect(status().isNotFound());
        }
    }
}
