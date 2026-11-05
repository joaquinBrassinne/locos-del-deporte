package com.pp2.crazySports.controller.adminController;

import com.pp2.crazySports.dto.solicitud.SolicitudRequestDTO;
import com.pp2.crazySports.dto.solicitud.SolicitudResponseDTO;
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

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ISolicitudService solicitudService;

    private Long crearSolicitudPendiente(TipoSolicitud tipo) {
        SolicitudRequestDTO req = new SolicitudRequestDTO();
        req.setTipo(tipo);
        req.setDatosAdjuntos("{\"nombre\":\"Ejemplo\"}");
        SolicitudResponseDTO res = solicitudService.enviarSolicitud(req);
        return res.getId();
    }

    @Nested
    @DisplayName("POST /api/admin/deportista/{id} - Aprobar Deportista")
    class AprobarDeportistaEndpointTests {

        @Test
        @DisplayName("TC-CTR-ADM-01 debeRetornar401_cuandoSeApruebaDeportistaSinCredenciales")
        void debeRetornar401_cuandoSeApruebaDeportistaSinCredenciales() throws Exception {
            mockMvc.perform(post("/api/admin/deportista/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-CTR-ADM-02 debeRetornar201_cuandoDatosSonValidosYConAdmin")
        void debeRetornar201_cuandoDatosSonValidosYConAdmin() throws Exception {
            Long id = crearSolicitudPendiente(TipoSolicitud.DEPORTISTA);
            String json = """
                    {
                        "nombre": "Franco Armani",
                        "deporte": "Fútbol",
                        "edad": 37,
                        "email": "armani@river.com",
                        "telefono": "11223344"
                    }
                    """;

            mockMvc.perform(post("/api/admin/deportista/" + id)
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").exists())
                    .andExpect(jsonPath("$.nombre").value("Franco Armani"));
        }

        @Test
        @DisplayName("TC-CTR-ADM-03 debeRetornar400_cuandoDtoTieneCamposInvalidos")
        void debeRetornar400_cuandoDtoTieneCamposInvalidos() throws Exception {
            Long id = crearSolicitudPendiente(TipoSolicitud.DEPORTISTA);
            String jsonInvalido = """
                    {
                        "nombre": "",
                        "deporte": "",
                        "edad": 0
                    }
                    """;

            mockMvc.perform(post("/api/admin/deportista/" + id)
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonInvalido))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @Tag("bug-conocido") // BUG-01: Id inexistente devuelve 400 (IllegalArgumentException) en lugar de 404
        @DisplayName("TC-CTR-ADM-04 debeRetornar404_cuandoSolicitudDeportistaNoExiste")
        void debeRetornar404_cuandoSolicitudDeportistaNoExiste() throws Exception {
            String json = """
                    {
                        "nombre": "Franco Armani",
                        "deporte": "Fútbol",
                        "edad": 37
                    }
                    """;

            mockMvc.perform(post("/api/admin/deportista/999999")
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("TC-CTR-ADM-05 debeRetornar400_cuandoSolicitudYaEstaAprobada")
        void debeRetornar400_cuandoSolicitudYaEstaAprobada() throws Exception {
            Long id = crearSolicitudPendiente(TipoSolicitud.DEPORTISTA);
            String json = """
                    {
                        "nombre": "Franco Armani",
                        "deporte": "Fútbol",
                        "edad": 37
                    }
                    """;

            // Primera aprobación
            mockMvc.perform(post("/api/admin/deportista/" + id)
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isCreated());

            // Segunda aprobación debe fallar
            mockMvc.perform(post("/api/admin/deportista/" + id)
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @Tag("bug-conocido") // BUG-03B: deportista con clubId inexistente devuelve 500 en lugar de 400
        @DisplayName("TC-CTR-ADM-06 debeRetornar400_cuandoDeportistaTieneClubIdInexistente")
        void debeRetornar400_cuandoDeportistaTieneClubIdInexistente() throws Exception {
            Long id = crearSolicitudPendiente(TipoSolicitud.DEPORTISTA);
            String jsonConClubInexistente = """
                    {
                        "nombre": "Franco Armani",
                        "deporte": "Fútbol",
                        "edad": 37,
                        "clubId": 999999
                    }
                    """;

            mockMvc.perform(post("/api/admin/deportista/" + id)
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonConClubInexistente))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("POST /api/admin/club/{id} - Aprobar Club")
    class AprobarClubEndpointTests {

        @Test
        @DisplayName("TC-CTR-ADM-07 debeRetornar401_cuandoSeApruebaClubSinCredenciales")
        void debeRetornar401_cuandoSeApruebaClubSinCredenciales() throws Exception {
            mockMvc.perform(post("/api/admin/club/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-CTR-ADM-08 debeRetornar201_cuandoDatosSonValidosYConAdmin")
        void debeRetornar201_cuandoDatosSonValidosYConAdmin() throws Exception {
            Long id = crearSolicitudPendiente(TipoSolicitud.CLUB);
            String clubName = "Club Social y Deportivo " + System.currentTimeMillis();
            String json = """
                    {
                        "nombreInstitucion": "%s",
                        "direccion": "Av. Colón 500",
                        "email": "contacto@club.com",
                        "telefono": "3514445555"
                    }
                    """.formatted(clubName);

            mockMvc.perform(post("/api/admin/club/" + id)
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").exists());
        }

        @Test
        @DisplayName("TC-CTR-ADM-09 debeRetornar400_cuandoDtoClubTieneCamposVacios")
        void debeRetornar400_cuandoDtoClubTieneCamposVacios() throws Exception {
            Long id = crearSolicitudPendiente(TipoSolicitud.CLUB);
            String jsonInvalido = """
                    {
                        "nombreInstitucion": "",
                        "direccion": ""
                    }
                    """;

            mockMvc.perform(post("/api/admin/club/" + id)
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonInvalido))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @Tag("bug-conocido") // BUG-01: Id inexistente devuelve 400 (IllegalArgumentException) en lugar de 404
        @DisplayName("TC-CTR-ADM-10 debeRetornar404_cuandoSolicitudClubNoExiste")
        void debeRetornar404_cuandoSolicitudClubNoExiste() throws Exception {
            String json = """
                    {
                        "nombreInstitucion": "Club Inexistente",
                        "direccion": "Calle 1"
                    }
                    """;

            mockMvc.perform(post("/api/admin/club/999999")
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("TC-CTR-ADM-11 debeRetornar400_cuandoSolicitudClubYaEstaAprobada")
        void debeRetornar400_cuandoSolicitudClubYaEstaAprobada() throws Exception {
            Long id = crearSolicitudPendiente(TipoSolicitud.CLUB);
            String clubName = "Club Doble Aprobacion " + System.currentTimeMillis();
            String json = """
                    {
                        "nombreInstitucion": "%s",
                        "direccion": "Av. Mitre 100"
                    }
                    """.formatted(clubName);

            mockMvc.perform(post("/api/admin/club/" + id)
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isCreated());

            mockMvc.perform(post("/api/admin/club/" + id)
                            .with(httpBasic("AdminTest", "test1234"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("PUT /api/admin/rechazar/{id}/{motivo} - Rechazar Solicitud")
    class RechazarEndpointTests {

        @Test
        @DisplayName("TC-CTR-ADM-12 debeRetornar401_cuandoSeRechazaSinCredenciales")
        void debeRetornar401_cuandoSeRechazaSinCredenciales() throws Exception {
            mockMvc.perform(put("/api/admin/rechazar/1/motivo"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("TC-CTR-ADM-13 debeRetornar200_cuandoSeRechazaConAdmin")
        void debeRetornar200_cuandoSeRechazaConAdmin() throws Exception {
            Long id = crearSolicitudPendiente(TipoSolicitud.CLUB);

            mockMvc.perform(put("/api/admin/rechazar/" + id + "/documentacion_incompleta")
                            .with(httpBasic("AdminTest", "test1234")))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Solicitud Rechazada"));
        }

        @Test
        @Tag("bug-conocido") // BUG-01: Id inexistente devuelve 400 (IllegalArgumentException) en lugar de 404
        @DisplayName("TC-CTR-ADM-14 debeRetornar404_cuandoSolicitudARechazarNoExiste")
        void debeRetornar404_cuandoSolicitudARechazarNoExiste() throws Exception {
            mockMvc.perform(put("/api/admin/rechazar/999999/motivo")
                            .with(httpBasic("AdminTest", "test1234")))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("TC-CTR-ADM-15 debeRetornar400_cuandoSolicitudYaEstaRechazada")
        void debeRetornar400_cuandoSolicitudYaEstaRechazada() throws Exception {
            Long id = crearSolicitudPendiente(TipoSolicitud.DEPORTISTA);

            mockMvc.perform(put("/api/admin/rechazar/" + id + "/primer_rechazo")
                            .with(httpBasic("AdminTest", "test1234")))
                    .andExpect(status().isOk());

            mockMvc.perform(put("/api/admin/rechazar/" + id + "/segundo_rechazo")
                            .with(httpBasic("AdminTest", "test1234")))
                    .andExpect(status().isBadRequest());
        }
    }
}
