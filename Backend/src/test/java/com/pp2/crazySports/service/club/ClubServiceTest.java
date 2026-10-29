package com.pp2.crazySports.service.club;

import com.pp2.crazySports.dto.club.ClubMapaDTO;
import com.pp2.crazySports.dto.club.ClubRequestDTO;
import com.pp2.crazySports.dto.club.ClubResponseDTO;
import com.pp2.crazySports.model.club.Club;
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
class ClubServiceTest {

    @Mock
    private IClubRepository clubRepository;

    @Mock
    private IDeportistaRepository deportistaRepository;

    @InjectMocks
    private ClubService clubService;

    private Club clubSample;
    private ClubRequestDTO requestDTOSample;

    @BeforeEach
    void setUp() {
        clubSample = new Club();
        clubSample.setId(1L);
        clubSample.setNombreInstitucion("Club Atlético Ejemplo");
        clubSample.setDireccion("Av. Siempre Viva 123");
        clubSample.setCoordenadas("-32.17,-64.11");
        clubSample.setSitioWebUrl("https://clubejemplo.com");
        clubSample.setEmail("contacto@clubejemplo.com");
        clubSample.setTelefono("123456789");
        clubSample.setDisciplinas("Fútbol, Básquet");
        clubSample.setDescripcion("Club social y deportivo");
        clubSample.setHorarios("08:00 a 22:00");
        clubSample.setDeporteAdaptado(true);
        clubSample.setFotos(new ArrayList<>());

        requestDTOSample = new ClubRequestDTO();
        requestDTOSample.setNombreInstitucion("Club Atlético Ejemplo");
        requestDTOSample.setDireccion("Av. Siempre Viva 123");
        requestDTOSample.setCoordenadas("-32.17,-64.11");
        requestDTOSample.setSitioWebUrl("https://clubejemplo.com");
        requestDTOSample.setEmail("contacto@clubejemplo.com");
        requestDTOSample.setTelefono("123456789");
        requestDTOSample.setDisciplinas("Fútbol, Básquet");
        requestDTOSample.setDescripcion("Club social y deportivo");
        requestDTOSample.setHorarios("08:00 a 22:00");
        requestDTOSample.setDeporteAdaptado(true);
        requestDTOSample.setFotos(new ArrayList<>());
    }

    @Nested
    @DisplayName("Pruebas de creación de Club")
    class CrearClubTests {

        @Test
        @DisplayName("TC-CLU-01 debeCrearClub_cuandoDatosSonValidos")
        void debeCrearClub_cuandoDatosSonValidos() {
            when(clubRepository.existsByNombreInstitucionIgnoreCase(requestDTOSample.getNombreInstitucion()))
                    .thenReturn(false);
            when(clubRepository.save(any(Club.class))).thenReturn(clubSample);
            when(deportistaRepository.countByClubId(1L)).thenReturn(5L);

            ClubResponseDTO response = clubService.crearClub(requestDTOSample);

            assertNotNull(response);
            assertEquals("Club Atlético Ejemplo", response.getNombreInstitucion());
            verify(clubRepository, times(1)).save(any(Club.class));
        }

        @Test
        @DisplayName("TC-CLU-02 debeLanzarExcepcion_cuandoNombreDeClubYaExiste")
        void debeLanzarExcepcion_cuandoNombreDeClubYaExiste() {
            when(clubRepository.existsByNombreInstitucionIgnoreCase(requestDTOSample.getNombreInstitucion()))
                    .thenReturn(true);

            IllegalArgumentException exception = assertThrows(
                    IllegalArgumentException.class,
                    () -> clubService.crearClub(requestDTOSample)
            );

            assertTrue(exception.getMessage().contains("Ya existe un club con el nombre"));
            verify(clubRepository, never()).save(any(Club.class));
        }
    }

    @Nested
    @DisplayName("Pruebas de consulta y búsqueda")
    class ConsultasTests {

        @Test
        @DisplayName("TC-CLU-03 debeListarClubes_cuandoExistenRegistros")
        void debeListarClubes_cuandoExistenRegistros() {
            when(clubRepository.findAll()).thenReturn(List.of(clubSample));
            when(deportistaRepository.countByClubId(1L)).thenReturn(10L);

            List<ClubResponseDTO> resultado = clubService.listarClubes();

            assertEquals(1, resultado.size());
            assertEquals(10, resultado.get(0).getCantidadDeportistas());
        }

        @Test
        @DisplayName("TC-CLU-04 debeRetornarListaVacia_cuandoNoHayClubes")
        void debeRetornarListaVacia_cuandoNoHayClubes() {
            when(clubRepository.findAll()).thenReturn(List.of());

            List<ClubResponseDTO> resultado = clubService.listarClubes();

            assertTrue(resultado.isEmpty());
        }

        @Test
        @DisplayName("TC-CLU-05 debeObtenerClubPorId_cuandoIdExiste")
        void debeObtenerClubPorId_cuandoIdExiste() {
            when(clubRepository.findById(1L)).thenReturn(Optional.of(clubSample));
            when(deportistaRepository.countByClubId(1L)).thenReturn(2L);

            ClubResponseDTO response = clubService.obtenerClubPorId(1L);

            assertNotNull(response);
            assertEquals(1L, response.getId());
        }

        @Test
        @DisplayName("TC-CLU-06 debeLanzarExcepcion_cuandoIdNoExiste")
        void debeLanzarExcepcion_cuandoIdNoExiste() {
            when(clubRepository.findById(99L)).thenReturn(Optional.empty());

            RuntimeException exception = assertThrows(
                    RuntimeException.class,
                    () -> clubService.obtenerClubPorId(99L)
            );

            assertEquals("Club no encontrado", exception.getMessage());
        }

        @Test
        @DisplayName("TC-CLU-07 debeBuscarClubesPorNombre_cuandoCoincide")
        void debeBuscarClubesPorNombre_cuandoCoincide() {
            when(clubRepository.findByNombreInstitucionContainingIgnoreCase("Ejemplo"))
                    .thenReturn(List.of(clubSample));
            when(deportistaRepository.countByClubId(1L)).thenReturn(0L);

            List<ClubResponseDTO> resultado = clubService.buscarPorNombre("Ejemplo");

            assertEquals(1, resultado.size());
            assertEquals("Club Atlético Ejemplo", resultado.get(0).getNombreInstitucion());
        }

        @Test
        @DisplayName("TC-CLU-08 debeRetornarListaVacia_cuandoBusquedaPorNombreNoCoincide")
        void debeRetornarListaVacia_cuandoBusquedaPorNombreNoCoincide() {
            when(clubRepository.findByNombreInstitucionContainingIgnoreCase("Inexistente"))
                    .thenReturn(List.of());

            List<ClubResponseDTO> resultado = clubService.buscarPorNombre("Inexistente");

            assertTrue(resultado.isEmpty());
        }

        @Test
        @DisplayName("TC-CLU-09 debeFiltrarClubesPorDisciplina_cuandoExiste")
        void debeFiltrarClubesPorDisciplina_cuandoExiste() {
            when(clubRepository.findByDisciplinasContainingIgnoreCase("Fútbol"))
                    .thenReturn(List.of(clubSample));
            when(deportistaRepository.countByClubId(1L)).thenReturn(3L);

            List<ClubResponseDTO> resultado = clubService.listarPorDisciplina("Fútbol");

            assertEquals(1, resultado.size());
            assertEquals("Club Atlético Ejemplo", resultado.get(0).getNombreInstitucion());
        }

        @Test
        @DisplayName("TC-CLU-10 debeListarClubesConDeporteAdaptado_cuandoExisten")
        void debeListarClubesConDeporteAdaptado_cuandoExisten() {
            when(clubRepository.findByDeporteAdaptadoTrue()).thenReturn(List.of(clubSample));
            when(deportistaRepository.countByClubId(1L)).thenReturn(0L);

            List<ClubResponseDTO> resultado = clubService.listarDeporteAdaptado();

            assertEquals(1, resultado.size());
            assertTrue(resultado.get(0).getDeporteAdaptado());
        }

        @Test
        @DisplayName("TC-CLU-11 debeListarClubesConDeporteAdaptadoDesdeMetodoAlternativo")
        void debeListarClubesConDeporteAdaptadoDesdeMetodoAlternativo() {
            when(clubRepository.findByDeporteAdaptadoTrue()).thenReturn(List.of(clubSample));
            when(deportistaRepository.countByClubId(1L)).thenReturn(0L);

            List<ClubResponseDTO> resultado = clubService.listarClubesConDeporteAdaptado();

            assertEquals(1, resultado.size());
            assertTrue(resultado.get(0).getDeporteAdaptado());
        }

        @Test
        @DisplayName("TC-CLU-12 debeMapearCoordenadas_cuandoSeConsultanClubes")
        void debeMapearCoordenadas_cuandoSeConsultanClubes() {
            when(clubRepository.findAll()).thenReturn(List.of(clubSample));

            List<ClubMapaDTO> resultado = clubService.obtenerCoordenadas();

            assertNotNull(resultado);
            assertEquals(1, resultado.size());
            assertEquals(1L, resultado.get(0).getId());
            assertEquals("-32.17,-64.11", resultado.get(0).getCoordenadas());
            assertEquals("Club Atlético Ejemplo", resultado.get(0).getNombreInstitucion());
        }
    }

    @Nested
    @DisplayName("Pruebas de actualización")
    class ActualizarClubTests {

        @Test
        @DisplayName("TC-CLU-13 debeActualizarClub_cuandoDatosSonValidos")
        void debeActualizarClub_cuandoDatosSonValidos() {
            when(clubRepository.findById(1L)).thenReturn(Optional.of(clubSample));
            when(clubRepository.save(any(Club.class))).thenReturn(clubSample);
            when(deportistaRepository.countByClubId(1L)).thenReturn(0L);

            requestDTOSample.setNombreInstitucion("Nuevo Nombre");
            ClubResponseDTO response = clubService.actualizarClub(1L, requestDTOSample);

            assertNotNull(response);
            verify(clubRepository).save(clubSample);
        }

        @Test
        @DisplayName("TC-CLU-14 debeLanzarExcepcion_cuandoClubAActualizarNoExiste")
        void debeLanzarExcepcion_cuandoClubAActualizarNoExiste() {
            when(clubRepository.findById(99L)).thenReturn(Optional.empty());

            assertThrows(RuntimeException.class, () -> clubService.actualizarClub(99L, requestDTOSample));
            verify(clubRepository, never()).save(any(Club.class));
        }
    }

    @Nested
    @DisplayName("Pruebas de eliminación")
    class EliminarClubTests {

        @Test
        @DisplayName("TC-CLU-15 debeEliminarClub_cuandoIdExiste")
        void debeEliminarClub_cuandoIdExiste() {
            when(clubRepository.existsById(1L)).thenReturn(true);
            doNothing().when(clubRepository).deleteById(1L);

            assertDoesNotThrow(() -> clubService.eliminarClub(1L));
            verify(clubRepository, times(1)).deleteById(1L);
        }

        @Test
        @DisplayName("TC-CLU-16 debeLanzarExcepcion_cuandoClubAEliminarNoExiste")
        void debeLanzarExcepcion_cuandoClubAEliminarNoExiste() {
            when(clubRepository.existsById(99L)).thenReturn(false);

            RuntimeException exception = assertThrows(
                    RuntimeException.class,
                    () -> clubService.eliminarClub(99L)
            );

            assertEquals("Club no encontrado", exception.getMessage());
            verify(clubRepository, never()).deleteById(anyLong());
        }
    }
}