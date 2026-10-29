package com.pp2.crazySports.service.admin;

import com.pp2.crazySports.dto.club.ClubRequestDTO;
import com.pp2.crazySports.dto.club.ClubResponseDTO;
import com.pp2.crazySports.dto.deportista.DeportistaRequestDTO;
import com.pp2.crazySports.dto.deportista.DeportistaResponseDTO;
import com.pp2.crazySports.model.enums.EstadoSolicitud;
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

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private ISolicitudRegistroRepository solicitudRepository;

    @Mock
    private IClubService clubService;

    @Mock
    private IDeportistaService deportistaService;

    @InjectMocks
    private AdminService adminService;

    private SolicitudRegistro solicitudMock;

    @BeforeEach
    void setUp() {
        solicitudMock = new SolicitudRegistro();
        solicitudMock.setId(1L);
        solicitudMock.setEstado(EstadoSolicitud.PENDIENTE);
        solicitudMock.setFechaEnvio(LocalDateTime.now().minusDays(1));
    }

    @Nested
    @DisplayName("Pruebas de aprobación de deportista")
    class AprobarDeportistaTests {

        @Test
        @DisplayName("TC-ADM-01 debeAprobarSolicitudYCrearDeportista_cuandoSolicitudEsPendiente")
        void debeAprobarSolicitudYCrearDeportista_cuandoSolicitudEsPendiente() {
            DeportistaRequestDTO dto = new DeportistaRequestDTO();
            dto.setNombre("Lionel Messi");

            DeportistaResponseDTO deportistaCreado = mock(DeportistaResponseDTO.class);
            when(deportistaCreado.getId()).thenReturn(10L);

            when(solicitudRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));
            when(deportistaService.crearDeportista(dto)).thenReturn(deportistaCreado);

            DeportistaResponseDTO resultado = adminService.aprobarSolicitudDepo(1L, dto);

            assertNotNull(resultado);
            assertEquals(10L, resultado.getId());
            assertEquals(EstadoSolicitud.APROBADO, solicitudMock.getEstado());
            assertNotNull(solicitudMock.getFechaRevision());
            verify(solicitudRepository).save(solicitudMock);
        }

        @Test
        @Tag("bug-conocido") // BUG-03A: AdminService no completa perfilCreadoId
        @DisplayName("TC-ADM-02 debeAsignarPerfilCreadoIdASolicitud_cuandoSeApruebaDeportista")
        void debeAsignarPerfilCreadoIdASolicitud_cuandoSeApruebaDeportista() {
            DeportistaRequestDTO dto = new DeportistaRequestDTO();
            DeportistaResponseDTO deportistaCreado = mock(DeportistaResponseDTO.class);
            when(deportistaCreado.getId()).thenReturn(25L);

            when(solicitudRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));
            when(deportistaService.crearDeportista(dto)).thenReturn(deportistaCreado);

            adminService.aprobarSolicitudDepo(1L, dto);

            assertNotNull(solicitudMock.getPerfilCreadoId(),
                    "Esperado que la solicitud registre el perfilCreadoId generado");
            assertEquals(25L, solicitudMock.getPerfilCreadoId());
        }

        @Test
        @DisplayName("TC-ADM-03 debeLanzarExcepcion_cuandoSolicitudDeportistaYaFueAprobada")
        void debeLanzarExcepcion_cuandoSolicitudDeportistaYaFueAprobada() {
            solicitudMock.setEstado(EstadoSolicitud.APROBADO);
            when(solicitudRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));

            IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                    () -> adminService.aprobarSolicitudDepo(1L, new DeportistaRequestDTO()));
            assertEquals("La solicitud no es pendiente", ex.getMessage());
            verifyNoInteractions(deportistaService);
        }

        @Test
        @DisplayName("TC-ADM-04 debeLanzarExcepcion_cuandoSolicitudDeportistaNoExiste")
        void debeLanzarExcepcion_cuandoSolicitudDeportistaNoExiste() {
            when(solicitudRepository.findById(99L)).thenReturn(Optional.empty());

            IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                    () -> adminService.aprobarSolicitudDepo(99L, new DeportistaRequestDTO()));
            assertTrue(ex.getMessage().contains("La solicitud con ID 99 no existe."));
        }

        @Test
        @Tag("bug-conocido") // BUG-03B: Sin transacción, si falla la creación del perfil la solicitud queda APROBADO sin perfil
        @DisplayName("TC-ADM-05 noDebeAprobarSolicitud_cuandoFallaCreacionDeportistaPorClubInexistente")
        void noDebeAprobarSolicitud_cuandoFallaCreacionDeportistaPorClubInexistente() {
            DeportistaRequestDTO dto = new DeportistaRequestDTO();
            dto.setClubId(999L);

            when(solicitudRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));
            when(deportistaService.crearDeportista(dto)).thenThrow(new RuntimeException("Club no encontrado con id: 999"));

            assertThrows(RuntimeException.class, () -> adminService.aprobarSolicitudDepo(1L, dto));
            assertEquals(EstadoSolicitud.PENDIENTE, solicitudMock.getEstado(),
                    "La solicitud no debería quedar APROBADA si falló la creación del deportista");
        }
    }

    @Nested
    @DisplayName("Pruebas de aprobación de club")
    class AprobarClubTests {

        @Test
        @DisplayName("TC-ADM-06 debeAprobarSolicitudYCrearClub_cuandoSolicitudEsPendiente")
        void debeAprobarSolicitudYCrearClub_cuandoSolicitudEsPendiente() {
            ClubRequestDTO dto = new ClubRequestDTO();
            dto.setNombreInstitucion("Club San Martín");

            ClubResponseDTO clubCreado = mock(ClubResponseDTO.class);
            when(clubCreado.getId()).thenReturn(15L);

            when(solicitudRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));
            when(clubService.crearClub(dto)).thenReturn(clubCreado);

            ClubResponseDTO resultado = adminService.aprobarSolicitudClub(1L, dto);

            assertNotNull(resultado);
            assertEquals(15L, resultado.getId());
            assertEquals(EstadoSolicitud.APROBADO, solicitudMock.getEstado());
            assertNotNull(solicitudMock.getFechaRevision());
            verify(solicitudRepository).save(solicitudMock);
        }

        @Test
        @Tag("bug-conocido") // BUG-03A: AdminService no completa perfilCreadoId
        @DisplayName("TC-ADM-07 debeAsignarPerfilCreadoIdASolicitud_cuandoSeApruebaClub")
        void debeAsignarPerfilCreadoIdASolicitud_cuandoSeApruebaClub() {
            ClubRequestDTO dto = new ClubRequestDTO();
            ClubResponseDTO clubCreado = mock(ClubResponseDTO.class);
            when(clubCreado.getId()).thenReturn(15L);

            when(solicitudRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));
            when(clubService.crearClub(dto)).thenReturn(clubCreado);

            adminService.aprobarSolicitudClub(1L, dto);

            assertNotNull(solicitudMock.getPerfilCreadoId(),
                    "Esperado que la solicitud registre el perfilCreadoId generado");
            assertEquals(15L, solicitudMock.getPerfilCreadoId());
        }

        @Test
        @DisplayName("TC-ADM-08 debeLanzarExcepcion_cuandoSolicitudClubYaFueAprobada")
        void debeLanzarExcepcion_cuandoSolicitudClubYaFueAprobada() {
            solicitudMock.setEstado(EstadoSolicitud.APROBADO);
            when(solicitudRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));

            IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                    () -> adminService.aprobarSolicitudClub(1L, new ClubRequestDTO()));
            assertEquals("La solicitud no es pendiente", ex.getMessage());
            verifyNoInteractions(clubService);
        }

        @Test
        @DisplayName("TC-ADM-09 debeLanzarExcepcion_cuandoSolicitudClubNoExiste")
        void debeLanzarExcepcion_cuandoSolicitudClubNoExiste() {
            when(solicitudRepository.findById(99L)).thenReturn(Optional.empty());

            IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                    () -> adminService.aprobarSolicitudClub(99L, new ClubRequestDTO()));
            assertTrue(ex.getMessage().contains("La solicitud con ID 99 no existe."));
        }
    }

    @Nested
    @DisplayName("Pruebas de rechazo de solicitud")
    class RechazarSolicitudTests {

        @Test
        @DisplayName("TC-ADM-10 debeRechazarSolicitudConMotivo_cuandoSolicitudEsPendiente")
        void debeRechazarSolicitudConMotivo_cuandoSolicitudEsPendiente() {
            when(solicitudRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));

            String resultado = adminService.rechazarSolicitud(1L, "Datos inválidos");

            assertEquals("Solicitud Rechazada", resultado);
            assertEquals(EstadoSolicitud.RECHAZADO, solicitudMock.getEstado());
            assertEquals("Datos inválidos", solicitudMock.getMotivoRechazo());
            assertNotNull(solicitudMock.getFechaRevision());
            verify(solicitudRepository).save(solicitudMock);
        }

        @Test
        @DisplayName("TC-ADM-11 debeLanzarExcepcion_cuandoSolicitudARechazarYaEstaRechazada")
        void debeLanzarExcepcion_cuandoSolicitudARechazarYaEstaRechazada() {
            solicitudMock.setEstado(EstadoSolicitud.RECHAZADO);
            when(solicitudRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));

            IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                    () -> adminService.rechazarSolicitud(1L, "Motivo"));
            assertEquals("La solicitud no es pendiente", ex.getMessage());
        }

        @Test
        @DisplayName("TC-ADM-12 debeLanzarExcepcion_cuandoSolicitudARechazarNoExiste")
        void debeLanzarExcepcion_cuandoSolicitudARechazarNoExiste() {
            when(solicitudRepository.findById(99L)).thenReturn(Optional.empty());

            IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                    () -> adminService.rechazarSolicitud(99L, "Motivo"));
            assertTrue(ex.getMessage().contains("La solicitud con ID 99 no existe."));
        }
    }
}
