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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
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
        solicitudMock.setDatosAdjuntos("{\"nombre\":\"Club Atletico\"}");
        solicitudMock.setFechaEnvio(LocalDateTime.now());
    }

    // --- ENVIAR SOLICITUD ---

    @Test
    @DisplayName("Debe guardar y retornar una solicitud en estado PENDIENTE")
    void testEnviarSolicitudExitoso() {
        SolicitudRequestDTO requestDTO = new SolicitudRequestDTO();
        requestDTO.setTipo(TipoSolicitud.CLUB);
        requestDTO.setDatosAdjuntos("{\"nombre\":\"Club Atletico\"}");

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
        verify(solicitudRegistroRepository, times(1)).save(any(SolicitudRegistro.class));
    }

    // --- LISTAR POR ESTADO ---

    @Test
    @DisplayName("Debe listar solicitudes filtradas por estado")
    void testListarPorEstadoExitoso() {
        when(solicitudRegistroRepository.findByEstado(EstadoSolicitud.PENDIENTE))
                .thenReturn(List.of(solicitudMock));

        List<SolicitudResponseDTO> result = solicitudService.listarPorEstado("PENDIENTE");

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals(EstadoSolicitud.PENDIENTE, result.get(0).getEstado());
        verify(solicitudRegistroRepository).findByEstado(EstadoSolicitud.PENDIENTE);
    }

    @Test
    @DisplayName("Debe lanzar excepción si el estado ingresado no es válido")
    void testListarPorEstadoInvalido() {
        assertThrows(IllegalArgumentException.class, () -> solicitudService.listarPorEstado("ESTADO_INEXISTENTE"));
        verifyNoInteractions(solicitudRegistroRepository);
    }

    // --- OBTENER POR ID ---

    @Test
    @DisplayName("Debe retornar la solicitud cuando el ID existe")
    void testObtenerPorIdExitoso() {
        when(solicitudRegistroRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));

        SolicitudResponseDTO response = solicitudService.obtenerPorId(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
    }

    @Test
    @DisplayName("Debe lanzar RuntimeException cuando el ID no existe")
    void testObtenerPorIdNoEncontrado() {
        when(solicitudRegistroRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> solicitudService.obtenerPorId(99L));
        assertEquals("Solicitud no encontrada con id: 99", exception.getMessage());
    }

    // --- APROBAR ---

    @Test
    @DisplayName("Debe aprobar solicitud de tipo DEPORTISTA y asociar perfil creado")
    void testAprobarSolicitudDeportistaExitoso() throws Exception {
        solicitudMock.setTipo(TipoSolicitud.DEPORTISTA);
    
        // 1. Declarar el request mockeado o instanciado
        DeportistaRequestDTO deportistaDTO = mock(DeportistaRequestDTO.class);
    
        // 2. Declarar el response mockeado
        DeportistaResponseDTO deportistaCreado = mock(DeportistaResponseDTO.class);
        when(deportistaCreado.getId()).thenReturn(20L);

        // 3. Configurar los mocks
        when(solicitudRegistroRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));
        when(objectMapper.readValue(solicitudMock.getDatosAdjuntos(), DeportistaRequestDTO.class)).thenReturn(deportistaDTO);
        when(deportistaService.crearDeportista(deportistaDTO)).thenReturn(deportistaCreado);
        when(solicitudRegistroRepository.save(any(SolicitudRegistro.class))).thenAnswer(i -> i.getArgument(0));

        // 4. Ejecutar
        SolicitudResponseDTO response = solicitudService.aprobar(1L);

        // 5. Aserciones
        assertNotNull(response);
        assertEquals(EstadoSolicitud.APROBADO, response.getEstado());
        assertEquals(20L, response.getPerfilCreadoId());
        verify(deportistaService, times(1)).crearDeportista(deportistaDTO);
        verifyNoInteractions(clubService);
    }

    @Test
    @DisplayName("Debe aprobar solicitud de tipo CLUB y asociar perfil creado")
    void testAprobarSolicitudClubExitoso() throws Exception {
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
    @DisplayName("Debe lanzar excepción al intentar aprobar una solicitud que no esté PENDIENTE")
    void testAprobarSolicitudNoPendiente() {
        solicitudMock.setEstado(EstadoSolicitud.APROBADO);
        when(solicitudRegistroRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> solicitudService.aprobar(1L));
        assertEquals("Solo se pueden aprobar solicitudes con estado Pendientes", ex.getMessage());
        verify(solicitudRegistroRepository, never()).save(any());
    }

    @Test
    @DisplayName("Debe lanzar RuntimeException si falla la deserialización JSON en la aprobación")
    void testAprobarFalloDeserializacion() throws Exception {
        when(solicitudRegistroRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));
        when(objectMapper.readValue(anyString(), eq(ClubRequestDTO.class))).thenThrow(new RuntimeException("JSON corrupto"));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> solicitudService.aprobar(1L));
        assertEquals("Error al procesar los datos de la solicitud", ex.getMessage());
        verify(solicitudRegistroRepository, never()).save(any());
    }

    // --- RECHAZAR ---

    @Test
    @DisplayName("Debe rechazar la solicitud pendiente y asignar el motivo")
    void testRechazarExitoso() {
        when(solicitudRegistroRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));
        when(solicitudRegistroRepository.save(any(SolicitudRegistro.class))).thenAnswer(i -> i.getArgument(0));

        SolicitudResponseDTO response = solicitudService.rechazar(1L, "Documentación incompleta");

        assertNotNull(response);
        assertEquals(EstadoSolicitud.RECHAZADO, response.getEstado());
        assertEquals("Documentación incompleta", response.getMotivoRechazo());
        verify(solicitudRegistroRepository).save(solicitudMock);
    }

    @Test
    @DisplayName("Debe lanzar excepción al intentar rechazar una solicitud que no esté PENDIENTE")
    void testRechazarSolicitudNoPendiente() {
        solicitudMock.setEstado(EstadoSolicitud.RECHAZADO);
        when(solicitudRegistroRepository.findById(1L)).thenReturn(Optional.of(solicitudMock));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> solicitudService.rechazar(1L, "Motivo"));
        assertEquals("Solo se pueden rechazar Solicitud con estado pendientes", ex.getMessage());
        verify(solicitudRegistroRepository, never()).save(any());
    }
}