package com.pp2.crazySports.service.solicitud;

import com.pp2.crazySports.dto.club.ClubRequestDTO;
import com.pp2.crazySports.dto.club.ClubResponseDTO;
import com.pp2.crazySports.dto.deportista.DeportistaRequestDTO;
import com.pp2.crazySports.dto.deportista.DeportistaResponseDTO;
import com.pp2.crazySports.dto.solicitud.SolicitudRequestDTO;
import com.pp2.crazySports.dto.solicitud.SolicitudResponseDTO;
import com.pp2.crazySports.model.enums.EstadoSolicitud;
import com.pp2.crazySports.model.enums.TipoSolicitud;
import com.pp2.crazySports.model.solicitud.SolicitudRegistro;
import com.pp2.crazySports.repository.ISolicitudRegistroRepository;
import com.pp2.crazySports.service.club.IClubService;
import com.pp2.crazySports.service.deportista.IDeportistaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SolicitudRegistroServiceTest {

    @Mock
    private ISolicitudRegistroRepository solicitudRegistroRepository;

    @Mock
    private IClubService clubService;

    @Mock
    private IDeportistaService deportistaService;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private SolicitudRegistroService solicitudService;

    private SolicitudRegistro solicitudMock;

    @BeforeEach
    void setUp() {
        solicitudMock = new SolicitudRegistro();
        solicitudMock.setId(1L);
        solicitudMock.setTipo(TipoSolicitud.CLUB);
        solicitudMock.setEstado(EstadoSolicitud.PENDIENTE);
        solicitudMock.setDatosAdjuntos("{\"nombreInstitucion\":\"Club Atlético\"}");
        solicitudMock.setFechaEnvio(LocalDateTime.now().minusDays(1));
    }

    @Nested
    @DisplayName("Pruebas de envío de solicitudes")
    class EnviarSolicitudTests {

        @Test
        @DisplayName("TC-SOL-01 debeCrearSolicitudPendiente_cuandoDatosSonValidos")
        void debeCrearSolicitudPendiente_cuandoDatosSonValidos() {
            SolicitudRequestDTO requestDTO = new SolicitudRequestDTO();
            requestDTO.setTipo(TipoSolicitud.CLUB);
            requestDTO.setDatosAdjuntos("{\"nombreInstitucion\":\"Club Atlético\"}");

            when(solicitudRegistroRepository.save(any(SolicitudRegistro.class))).thenAnswer(i -> {
                SolicitudRegistro s = i.getArgument(0);
                s.setId(1L);
                return s;
            });

            SolicitudResponseDTO response = solicitudService.enviarSolicitud(requestDTO);

            assertNotNull(response);
            assertEquals(1L, response.getId());
            assertEquals(EstadoSolicitud.PENDIENTE, response.getEstado());
            assertEquals(TipoSolicitud.CLUB, response.getTipo());
            assertNotNull(response.getFechaEnvio());
            assertNull(response.getFechaRevision());
            assertNull(response.getPerfilCreadoId());
            verify(solicitudRegistroRepository, times(1)).save(any(SolicitudRegistro.class));
        }
    }

    @Nested
    @DisplayName("Pruebas de consulta de solicitudes")
    class ConsultasTests {

        @Test
        @DisplayName("TC-SOL-02 debeListarSolicitudesPorEstado_cuandoEstadoEsValido")
        void debeListarSolicitudesPorEstado_cuandoEstadoEsValido() {
            when(solicitudRegistroRepository.findByEstado(EstadoSolicitud.PENDIENTE))
                    .thenReturn(List.of(solicitudMock));

            List<SolicitudResponseDTO> result = solicitudService.listarPorEstado("PENDIENTE");

            assertEquals(1, result.size());
            assertEquals(EstadoSolicitud.PENDIENTE, result.get(0).getEstado());
            verify(solicitudRegistroRepository).findByEstado(EstadoSolicitud.PENDIENTE);
        }

        @Test
        @DisplayName("TC-SOL-03 debeLanzarExcepcion_cuandoEstadoEsInvalido")
        void debeLanzarExcepcion_cuandoEstadoEsInvalido() {
            assertThrows(IllegalArgumentException.class, () -> solicitudService.listarPorEstado("INVALIDO"));
            verifyNoInteractions(solicitudRegistroRepository);
        }

        @Test
        @DisplayName("TC-SOL-04 debeObtenerSolicitudPorId_cuandoIdExiste")
        void debeObtenerSolicitudPorId_cuandoIdExiste() {
            when(solicitudRegistroRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));

            SolicitudResponseDTO response = solicitudService.obtenerPorId(1L);

            assertNotNull(response);
            assertEquals(1L, response.getId());
        }

        @Test
        @DisplayName("TC-SOL-05 debeLanzarExcepcion_cuandoIdNoExiste")
        void debeLanzarExcepcion_cuandoIdNoExiste() {
            when(solicitudRegistroRepository.findById(99L)).thenReturn(Optional.empty());

            RuntimeException exception = assertThrows(RuntimeException.class, () -> solicitudService.obtenerPorId(99L));
            assertEquals("Solicitud no encontrada con id: 99", exception.getMessage());
        }
    }

    @Nested
    @DisplayName("Pruebas de aprobación de solicitudes")
    class AprobarTests {

        @Test
        @DisplayName("TC-SOL-06 debeAprobarSolicitudDeportista_cuandoEsValida")
        void debeAprobarSolicitudDeportista_cuandoEsValida() throws Exception {
            solicitudMock.setTipo(TipoSolicitud.DEPORTISTA);
            DeportistaRequestDTO deportistaDTO = mock(DeportistaRequestDTO.class);
            DeportistaResponseDTO deportistaCreado = mock(DeportistaResponseDTO.class);
            when(deportistaCreado.getId()).thenReturn(20L);

            when(solicitudRegistroRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));
            when(objectMapper.readValue(solicitudMock.getDatosAdjuntos(), DeportistaRequestDTO.class)).thenReturn(deportistaDTO);
            when(deportistaService.crearDeportista(deportistaDTO)).thenReturn(deportistaCreado);
            when(solicitudRegistroRepository.save(any(SolicitudRegistro.class))).thenAnswer(i -> i.getArgument(0));

            SolicitudResponseDTO response = solicitudService.aprobar(1L);

            assertNotNull(response);
            assertEquals(EstadoSolicitud.APROBADO, response.getEstado());
            assertEquals(20L, response.getPerfilCreadoId());
            assertNotNull(response.getFechaRevision());
            verify(deportistaService, times(1)).crearDeportista(deportistaDTO);
            verifyNoInteractions(clubService);
        }

        @Test
        @DisplayName("TC-SOL-07 debeAprobarSolicitudClub_cuandoEsValida")
        void debeAprobarSolicitudClub_cuandoEsValida() throws Exception {
            ClubRequestDTO clubDTO = mock(ClubRequestDTO.class);
            ClubResponseDTO clubCreado = mock(ClubResponseDTO.class);
            when(clubCreado.getId()).thenReturn(10L);

            when(solicitudRegistroRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));
            when(objectMapper.readValue(solicitudMock.getDatosAdjuntos(), ClubRequestDTO.class)).thenReturn(clubDTO);
            when(clubService.crearClub(clubDTO)).thenReturn(clubCreado);
            when(solicitudRegistroRepository.save(any(SolicitudRegistro.class))).thenAnswer(i -> i.getArgument(0));

            SolicitudResponseDTO response = solicitudService.aprobar(1L);

            assertNotNull(response);
            assertEquals(EstadoSolicitud.APROBADO, response.getEstado());
            assertEquals(10L, response.getPerfilCreadoId());
            assertNotNull(response.getFechaRevision());
            verify(clubService, times(1)).crearClub(clubDTO);
            verifyNoInteractions(deportistaService);
        }

        @Test
        @DisplayName("TC-SOL-08 debeLanzarExcepcion_cuandoSolicitudNoEstaPendienteAlAprobar")
        void debeLanzarExcepcion_cuandoSolicitudNoEstaPendienteAlAprobar() {
            solicitudMock.setEstado(EstadoSolicitud.APROBADO);
            when(solicitudRegistroRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));

            IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> solicitudService.aprobar(1L));
            assertEquals("Solo se pueden aprobar solicitudes con estado Pendientes", ex.getMessage());
            verify(solicitudRegistroRepository, never()).save(any());
        }

        @Test
        @DisplayName("TC-SOL-09 debeLanzarExcepcion_cuandoFallaDeserializacionJsonAlAprobar")
        void debeLanzarExcepcion_cuandoFallaDeserializacionJsonAlAprobar() throws Exception {
            when(solicitudRegistroRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));
            when(objectMapper.readValue(anyString(), eq(ClubRequestDTO.class))).thenThrow(new RuntimeException("JSON corrupto"));

            RuntimeException ex = assertThrows(RuntimeException.class, () -> solicitudService.aprobar(1L));
            assertTrue(ex.getMessage().contains("Error al procesar los datos de la solicitud"));
            verify(solicitudRegistroRepository, never()).save(any());
        }

        @Test
        @DisplayName("TC-SOL-10 debeLanzarExcepcion_cuandoIdNoExisteAlAprobar")
        void debeLanzarExcepcion_cuandoIdNoExisteAlAprobar() {
            when(solicitudRegistroRepository.findById(99L)).thenReturn(Optional.empty());

            assertThrows(RuntimeException.class, () -> solicitudService.aprobar(99L));
            verify(solicitudRegistroRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Pruebas de rechazo de solicitudes")
    class RechazarTests {

        @Test
        @Tag("bug-conocido") // BUG-04: SolicitudRegistroService.rechazar actualiza fechaEnvio en vez de fechaRevision
        @DisplayName("TC-SOL-11 debeRechazarSolicitudYAsignarFechaRevision_cuandoSeRechazaConMotivo")
        void debeRechazarSolicitudYAsignarFechaRevision_cuandoSeRechazaConMotivo() {
            LocalDateTime fechaEnvioOriginal = solicitudMock.getFechaEnvio();
            when(solicitudRegistroRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));
            when(solicitudRegistroRepository.save(any(SolicitudRegistro.class))).thenAnswer(i -> i.getArgument(0));

            SolicitudResponseDTO response = solicitudService.rechazar(1L, "Documentación incompleta");

            assertNotNull(response);
            assertEquals(EstadoSolicitud.RECHAZADO, response.getEstado());
            assertEquals("Documentación incompleta", response.getMotivoRechazo());
            assertNotNull(response.getFechaRevision(), "Debería actualizar fechaRevision al rechazar");
            assertEquals(fechaEnvioOriginal, response.getFechaEnvio(), "fechaEnvio original no debería modificarse");
        }

        @Test
        @DisplayName("TC-SOL-12 debeRechazarSolicitudSinMotivo_cuandoMotivoEsNulo")
        void debeRechazarSolicitudSinMotivo_cuandoMotivoEsNulo() {
            when(solicitudRegistroRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));
            when(solicitudRegistroRepository.save(any(SolicitudRegistro.class))).thenAnswer(i -> i.getArgument(0));

            SolicitudResponseDTO response = solicitudService.rechazar(1L, null);

            assertNotNull(response);
            assertEquals(EstadoSolicitud.RECHAZADO, response.getEstado());
            assertNull(response.getMotivoRechazo());
        }

        @Test
        @DisplayName("TC-SOL-13 debeLanzarExcepcion_cuandoSolicitudNoEstaPendienteAlRechazar")
        void debeLanzarExcepcion_cuandoSolicitudNoEstaPendienteAlRechazar() {
            solicitudMock.setEstado(EstadoSolicitud.RECHAZADO);
            when(solicitudRegistroRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));

            IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> solicitudService.rechazar(1L, "Motivo"));
            assertEquals("Solo se pueden rechazar Solicitud con estado pendientes", ex.getMessage());
            verify(solicitudRegistroRepository, never()).save(any());
        }

        @Test
        @DisplayName("TC-SOL-14 debeLanzarExcepcion_cuandoIdNoExisteAlRechazar")
        void debeLanzarExcepcion_cuandoIdNoExisteAlRechazar() {
            when(solicitudRegistroRepository.findById(99L)).thenReturn(Optional.empty());

            assertThrows(RuntimeException.class, () -> solicitudService.rechazar(99L, "Motivo"));
            verify(solicitudRegistroRepository, never()).save(any());
        }
    }
}