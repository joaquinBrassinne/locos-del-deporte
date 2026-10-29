package com.pp2.crazySports.service.deportista;

import com.pp2.crazySports.dto.deportista.DeportistaRequestDTO;
import com.pp2.crazySports.dto.deportista.DeportistaResponseDTO;
import com.pp2.crazySports.model.club.Club;
import com.pp2.crazySports.model.deportista.Deportista;
import com.pp2.crazySports.repository.IClubRepository;
import com.pp2.crazySports.repository.IDeportistaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DeportistaServiceTest {

    @Mock
    private IDeportistaRepository deportistaRepository;

    @Mock
    private IClubRepository clubRepository;

    @InjectMocks
    private DeportistaService deportistaService;

    private Deportista deportistaSample;
    private Club clubSample;
    private DeportistaRequestDTO requestDTOSample;

    @BeforeEach
    void setUp() {
        clubSample = new Club();
        clubSample.setId(10L);
        clubSample.setNombreInstitucion("Club Atlético");

        deportistaSample = new Deportista();
        deportistaSample.setId(1L);
        deportistaSample.setNombre("Carlos Tevez");
        deportistaSample.setDeporte("Fútbol");
        deportistaSample.setEdad(38);
        deportistaSample.setEmail("carlos@example.com");
        deportistaSample.setTelefono("3511234567");
        deportistaSample.setDeporteAdaptado(false);
        deportistaSample.setFotos(new ArrayList<>());
        deportistaSample.setClub(clubSample);

        requestDTOSample = new DeportistaRequestDTO();
        requestDTOSample.setNombre("Carlos Tevez");
        requestDTOSample.setDeporte("Fútbol");
        requestDTOSample.setEdad(38);
        requestDTOSample.setEmail("carlos@example.com");
        requestDTOSample.setTelefono("3511234567");
        requestDTOSample.setDeporteAdaptado(false);
        requestDTOSample.setClubId(10L);
        requestDTOSample.setFotos(new ArrayList<>());
    }

    @Nested
    @DisplayName("Pruebas de creación de Deportista")
    class CrearDeportistaTests {

        @Test
        @DisplayName("TC-DEP-01 debeCrearDeportistaConClub_cuandoDatosSonValidos")
        void debeCrearDeportistaConClub_cuandoDatosSonValidos() {
            when(clubRepository.findById(10L)).thenReturn(Optional.of(clubSample));
            when(deportistaRepository.save(any(Deportista.class))).thenReturn(deportistaSample);

            DeportistaResponseDTO response = deportistaService.crearDeportista(requestDTOSample);

            assertNotNull(response);
            assertEquals("Carlos Tevez", response.getNombre());
            assertEquals("Club Atlético", response.getClubNombre());
            verify(deportistaRepository, times(1)).save(any(Deportista.class));
        }

        @Test
        @DisplayName("TC-DEP-02 debeCrearDeportistaSinClub_cuandoClubIdEsNulo")
        void debeCrearDeportistaSinClub_cuandoClubIdEsNulo() {
            requestDTOSample.setClubId(null);
            deportistaSample.setClub(null);
            when(deportistaRepository.save(any(Deportista.class))).thenReturn(deportistaSample);

            DeportistaResponseDTO response = deportistaService.crearDeportista(requestDTOSample);

            assertNotNull(response);
            assertNull(response.getClubNombre());
            verifyNoInteractions(clubRepository);
            verify(deportistaRepository).save(any(Deportista.class));
        }

        @Test
        @DisplayName("TC-DEP-03 debeLanzarExcepcion_cuandoClubIdNoExiste")
        void debeLanzarExcepcion_cuandoClubIdNoExiste() {
            when(clubRepository.findById(99L)).thenReturn(Optional.empty());
            requestDTOSample.setClubId(99L);

            RuntimeException ex = assertThrows(RuntimeException.class, () -> deportistaService.crearDeportista(requestDTOSample));
            assertTrue(ex.getMessage().contains("Club no encontrado con id: 99"));
            verify(deportistaRepository, never()).save(any(Deportista.class));
        }
    }

    @Nested
    @DisplayName("Pruebas de consulta de Deportista")
    class ConsultasTests {

        @Test
        @DisplayName("TC-DEP-04 debeListarTodosLosDeportistas")
        void debeListarTodosLosDeportistas() {
            when(deportistaRepository.findAll()).thenReturn(List.of(deportistaSample));

            List<DeportistaResponseDTO> result = deportistaService.listDeportistas();

            assertEquals(1, result.size());
            assertEquals("Carlos Tevez", result.get(0).getNombre());
        }

        @Test
        @DisplayName("TC-DEP-05 debeObtenerDeportistaPorId_cuandoIdExiste")
        void debeObtenerDeportistaPorId_cuandoIdExiste() {
            when(deportistaRepository.findById(1L)).thenReturn(Optional.of(deportistaSample));

            DeportistaResponseDTO response = deportistaService.obtenerDeportistaPorId(1L);

            assertNotNull(response);
            assertEquals(1L, response.getId());
        }

        @Test
        @DisplayName("TC-DEP-06 debeLanzarExcepcion_cuandoIdNoExiste")
        void debeLanzarExcepcion_cuandoIdNoExiste() {
            when(deportistaRepository.findById(99L)).thenReturn(Optional.empty());

            RuntimeException ex = assertThrows(RuntimeException.class, () -> deportistaService.obtenerDeportistaPorId(99L));
            assertEquals("Deportista no encontrada", ex.getMessage());
        }

        @Test
        @DisplayName("TC-DEP-07 debeListarDeportistasPorClub_cuandoClubExiste")
        void debeListarDeportistasPorClub_cuandoClubExiste() {
            when(deportistaRepository.findByClubId(10L)).thenReturn(List.of(deportistaSample));

            List<DeportistaResponseDTO> result = deportistaService.listDeportistasPorClub(10L);

            assertEquals(1, result.size());
            assertEquals("Carlos Tevez", result.get(0).getNombre());
        }

        @Test
        @DisplayName("TC-DEP-08 debeListarDeportistasConDeporteAdaptado")
        void debeListarDeportistasConDeporteAdaptado() {
            deportistaSample.setDeporteAdaptado(true);
            when(deportistaRepository.findByDeporteAdaptadoTrue()).thenReturn(List.of(deportistaSample));

            List<DeportistaResponseDTO> result = deportistaService.listDeportistasConDeporteAdaptado();

            assertEquals(1, result.size());
            assertTrue(result.get(0).getDeporteAdaptado());
        }

        @Test
        @DisplayName("TC-DEP-09 debeBuscarDeportistasPorDeporte")
        void debeBuscarDeportistasPorDeporte() {
            when(deportistaRepository.findByDeporteIgnoreCase("Fútbol")).thenReturn(List.of(deportistaSample));

            List<DeportistaResponseDTO> result = deportistaService.buscarPorDeporte("Fútbol");

            assertEquals(1, result.size());
            assertEquals("Fútbol", result.get(0).getDeporte());
        }
    }

    @Nested
    @DisplayName("Pruebas de actualización de Deportista")
    class ActualizarDeportistaTests {

        @Test
        @DisplayName("TC-DEP-10 debeActualizarDeportista_cuandoDatosSonValidos")
        void debeActualizarDeportista_cuandoDatosSonValidos() {
            when(deportistaRepository.findById(1L)).thenReturn(Optional.of(deportistaSample));
            when(clubRepository.findById(10L)).thenReturn(Optional.of(clubSample));
            when(deportistaRepository.save(any(Deportista.class))).thenReturn(deportistaSample);

            requestDTOSample.setNombre("Nombre Actualizado");
            DeportistaResponseDTO response = deportistaService.actualizarDeportista(1L, requestDTOSample);

            assertNotNull(response);
            verify(deportistaRepository).save(deportistaSample);
        }

        @Test
        @DisplayName("TC-DEP-11 debeLanzarExcepcion_cuandoDeportistaAActualizarNoExiste")
        void debeLanzarExcepcion_cuandoDeportistaAActualizarNoExiste() {
            when(deportistaRepository.findById(99L)).thenReturn(Optional.empty());

            assertThrows(RuntimeException.class, () -> deportistaService.actualizarDeportista(99L, requestDTOSample));
            verify(deportistaRepository, never()).save(any(Deportista.class));
        }

        @Test
        @DisplayName("TC-DEP-12 debeLanzarExcepcion_cuandoClubAAsociarEnActualizacionNoExiste")
        void debeLanzarExcepcion_cuandoClubAAsociarEnActualizacionNoExiste() {
            when(deportistaRepository.findById(1L)).thenReturn(Optional.of(deportistaSample));
            when(clubRepository.findById(99L)).thenReturn(Optional.empty());
            requestDTOSample.setClubId(99L);

            RuntimeException ex = assertThrows(RuntimeException.class, () -> deportistaService.actualizarDeportista(1L, requestDTOSample));
            assertTrue(ex.getMessage().contains("Club no encontrado con id: 99"));
            verify(deportistaRepository, never()).save(any(Deportista.class));
        }
    }

    @Nested
    @DisplayName("Pruebas de eliminación de Deportista")
    class EliminarDeportistaTests {

        @Test
        @DisplayName("TC-DEP-13 debeEliminarDeportista_cuandoIdExiste")
        void debeEliminarDeportista_cuandoIdExiste() {
            when(deportistaRepository.existsById(1L)).thenReturn(true);
            doNothing().when(deportistaRepository).deleteById(1L);

            assertDoesNotThrow(() -> deportistaService.eliminarDeportista(1L));
            verify(deportistaRepository, times(1)).deleteById(1L);
        }

        @Test
        @DisplayName("TC-DEP-14 debeLanzarExcepcion_cuandoDeportistaAEliminarNoExiste")
        void debeLanzarExcepcion_cuandoDeportistaAEliminarNoExiste() {
            when(deportistaRepository.existsById(99L)).thenReturn(false);

            RuntimeException ex = assertThrows(RuntimeException.class, () -> deportistaService.eliminarDeportista(99L));
            assertEquals("Deportista no encontrada", ex.getMessage());
            verify(deportistaRepository, never()).deleteById(anyLong());
        }
    }
}
