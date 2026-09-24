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
        @DisplayName("Debe crear un club exitosamente")
        void crearClub_Exitoso() {
            when(clubRepository.existsByNombreInstitucionIgnoreCase(requestDTOSample.getNombreInstitucion()))
                    .thenReturn(false);
            when(clubRepository.save(any(Club.class))).thenReturn(clubSample);
            when(deportistaRepository.countByClubId(1L)).thenReturn(5L);

            ClubResponseDTO response = clubService.crearClub(requestDTOSample);

            assertNotNull(response);
            assertEquals("Club Atlético Ejemplo", response.getNombreInstitucion());
            assertEquals(5, response.getCantidadDeportistas());
            verify(clubRepository, times(1)).save(any(Club.class));
        }

        @Test
        @DisplayName("Debe lanzar IllegalArgumentException si el nombre ya existe")
        void crearClub_NombreDuplicado_LanzaExcepcion() {
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
        @DisplayName("Debe listar todos los clubes con su conteo de deportistas")
        void listarClubes_Exitoso() {
            when(clubRepository.findAll()).thenReturn(List.of(clubSample));
            when(deportistaRepository.countByClubId(1L)).thenReturn(10L);

            List<ClubResponseDTO> resultado = clubService.listarClubes();

            assertFalse(resultado.isEmpty());
            assertEquals(1, resultado.size());
            assertEquals(10, resultado.get(0).getCantidadDeportistas());
        }

        @Test
        @DisplayName("Debe obtener un club por ID exitosamente")
        void obtenerClubPorId_Exitoso() {
            when(clubRepository.findById(1L)).thenReturn(Optional.of(clubSample));
            when(deportistaRepository.countByClubId(1L)).thenReturn(2L);

            ClubResponseDTO response = clubService.obtenerClubPorId(1L);

            assertNotNull(response);
            assertEquals(1L, response.getId());
        }

        @Test
        @DisplayName("Debe lanzar RuntimeException si no encuentra el ID")
        void obtenerClubPorId_NoEncontrado_LanzaExcepcion() {
            when(clubRepository.findById(99L)).thenReturn(Optional.empty());

            RuntimeException exception = assertThrows(
                    RuntimeException.class,
                    () -> clubService.obtenerClubPorId(99L)
            );

            assertEquals("Club no encontrado", exception.getMessage());
        }

        @Test
        @DisplayName("Debe buscar clubes por coincidencia de nombre")
        void buscarPorNombre_Exitoso() {
            when(clubRepository.findByNombreInstitucionContainingIgnoreCase("Ejemplo"))
                    .thenReturn(List.of(clubSample));
            when(deportistaRepository.countByClubId(1L)).thenReturn(0L);

            List<ClubResponseDTO> resultado = clubService.buscarPorNombre("Ejemplo");

            assertEquals(1, resultado.size());
            assertEquals("Club Atlético Ejemplo", resultado.get(0).getNombreInstitucion());
        }

        @Test
        @DisplayName("Debe filtrar clubes por disciplina")
        void listarPorDisciplina_Exitoso() {
            when(clubRepository.findByDisciplinasContainingIgnoreCase("Fútbol"))
                    .thenReturn(List.of(clubSample));
            when(deportistaRepository.countByClubId(1L)).thenReturn(3L);

            List<ClubResponseDTO> resultado = clubService.listarPorDisciplina("Fútbol");

            assertEquals(1, resultado.size());
            assertEquals("Club Atlético Ejemplo", resultado.get(0).getNombreInstitucion());
        }

        @Test
        @DisplayName("Debe listar clubes con deporte adaptado")
        void listarDeporteAdaptado_Exitoso() {
            when(clubRepository.findByDeporteAdaptadoTrue()).thenReturn(List.of(clubSample));
            when(deportistaRepository.countByClubId(1L)).thenReturn(0L);

            List<ClubResponseDTO> resultado = clubService.listarDeporteAdaptado();

            assertEquals(1, resultado.size());
            assertTrue(resultado.get(0).getDeporteAdaptado());
        }

        @Test
        @DisplayName("Debe mapear correctamente las coordenadas devueltas por el Object[]")
        void obtenerCoordenadas_Exitoso() {
            Object[] row = new Object[]{1L, "-32.17,-64.11", "Club Atlético Ejemplo"};
    
            // Se especifica explícitamente el tipo genérico <Object[]>
            List<Object[]> rows = List.<Object[]>of(row);
            when(clubRepository.findCoordenadas()).thenReturn(rows);

            List<ClubMapaDTO> resultado = clubService.obtenerCoordenadas();

            assertNotNull(resultado);
            assertEquals(1, resultado.size());
            assertEquals(1L, resultado.get(0).getId());
            assertEquals("-32.17,-64.11", resultado.get(0).getCoordenadas());
            assertEquals("Club Atlético Ejemplo", resultado.get(0).getNombreInstitucion());
        }

    @Nested
    @DisplayName("Pruebas de actualización")
    class ActualizarClubTests {

        @Test
        @DisplayName("Debe actualizar los datos del club exitosamente")
        void actualizarClub_Exitoso() {
            when(clubRepository.findById(1L)).thenReturn(Optional.of(clubSample));
            when(clubRepository.save(any(Club.class))).thenReturn(clubSample);
            when(deportistaRepository.countByClubId(1L)).thenReturn(0L);

            requestDTOSample.setNombreInstitucion("Nuevo Nombre");
            ClubResponseDTO response = clubService.actualizarClub(1L, requestDTOSample);

            assertNotNull(response);
            verify(clubRepository).save(clubSample);
        }

        @Test
        @DisplayName("Debe lanzar RuntimeException si el club a actualizar no existe")
        void actualizarClub_NoExiste_LanzaExcepcion() {
            when(clubRepository.findById(99L)).thenReturn(Optional.empty());

            assertThrows(RuntimeException.class, () -> clubService.actualizarClub(99L, requestDTOSample));
            verify(clubRepository, never()).save(any(Club.class));
        }
    }

    @Nested
    @DisplayName("Pruebas de eliminación")
    class EliminarClubTests {

        @Test
        @DisplayName("Debe eliminar el club si existe")
        void eliminarClub_Exitoso() {
            when(clubRepository.existsById(1L)).thenReturn(true);
            doNothing().when(clubRepository).deleteById(1L);

            assertDoesNotThrow(() -> clubService.eliminarClub(1L));
            verify(clubRepository, times(1)).deleteById(1L);
        }

        @Test
        @DisplayName("Debe lanzar RuntimeException si el club a eliminar no existe")
        void eliminarClub_NoExiste_LanzaExcepcion() {
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
}