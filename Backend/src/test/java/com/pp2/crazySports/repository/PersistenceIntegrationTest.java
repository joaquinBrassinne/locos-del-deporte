package com.pp2.crazySports.repository;

import com.pp2.crazySports.model.admin.Administrador;
import com.pp2.crazySports.model.club.Club;
import com.pp2.crazySports.model.deportista.Deportista;
import com.pp2.crazySports.model.enums.EstadoSolicitud;
import com.pp2.crazySports.model.enums.TipoSolicitud;
import com.pp2.crazySports.model.solicitud.SolicitudRegistro;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class PersistenceIntegrationTest {

    @Autowired
    private IClubRepository clubRepository;

    @Autowired
    private IDeportistaRepository deportistaRepository;

    @Autowired
    private ISolicitudRegistroRepository solicitudRepository;

    @Autowired
    private IAdminRepository adminRepository;

    @Test
    @DisplayName("TC-INT-01 debeGuardarYRecuperarClub_enBaseDeDatosDePrueba")
    void debeGuardarYRecuperarClub_enBaseDeDatosDePrueba() {
        Club club = new Club();
        club.setNombreInstitucion("Club Atlético Integración");
        club.setDireccion("Av. Test 100");
        club.setDeporteAdaptado(true);

        Club guardado = clubRepository.save(club);

        assertNotNull(guardado.getId());
        Optional<Club> recuperado = clubRepository.findById(guardado.getId());
        assertTrue(recuperado.isPresent());
        assertEquals("Club Atlético Integración", recuperado.get().getNombreInstitucion());
    }

    @Test
    @DisplayName("TC-INT-02 debeBuscarClubesPorNombreIgnoreCase_enBaseDeDatosDePrueba")
    void debeBuscarClubesPorNombreIgnoreCase_enBaseDeDatosDePrueba() {
        Club club = new Club();
        club.setNombreInstitucion("Club Deportivo Belgrano");
        club.setDireccion("Arturo Orgaz 550");
        clubRepository.save(club);

        List<Club> encontrados = clubRepository.findByNombreInstitucionContainingIgnoreCase("belgrano");

        assertFalse(encontrados.isEmpty());
        assertTrue(encontrados.stream().anyMatch(c -> c.getNombreInstitucion().contains("Belgrano")));
    }

    @Test
    @DisplayName("TC-INT-03 debeFiltrarClubesConDeporteAdaptado_enBaseDeDatosDePrueba")
    void debeFiltrarClubesConDeporteAdaptado_enBaseDeDatosDePrueba() {
        Club clubAdaptado = new Club();
        clubAdaptado.setNombreInstitucion("Club Inclusivo");
        clubAdaptado.setDireccion("Calle 5");
        clubAdaptado.setDeporteAdaptado(true);
        clubRepository.save(clubAdaptado);

        List<Club> adaptados = clubRepository.findByDeporteAdaptadoTrue();

        assertFalse(adaptados.isEmpty());
        assertTrue(adaptados.stream().allMatch(Club::getDeporteAdaptado));
    }

    @Test
    @DisplayName("TC-INT-04 debeGuardarDeportistaAsociadoAClub_yRecuperarPorClubId")
    void debeGuardarDeportistaAsociadoAClub_yRecuperarPorClubId() {
        Club club = new Club();
        club.setNombreInstitucion("Club Asociado");
        club.setDireccion("Av. Los Incas");
        Club clubGuardado = clubRepository.save(club);

        Deportista deportista = new Deportista();
        deportista.setNombre("Matías Suárez");
        deportista.setDeporte("Fútbol");
        deportista.setEdad(34);
        deportista.setClub(clubGuardado);
        deportistaRepository.save(deportista);

        List<Deportista> deportistas = deportistaRepository.findByClubId(clubGuardado.getId());

        assertEquals(1, deportistas.size());
        assertEquals("Matías Suárez", deportistas.get(0).getNombre());
    }

    @Test
    @DisplayName("TC-INT-05 debeContarCantidadDeportistasPorClub_enBaseDeDatosDePrueba")
    void debeContarCantidadDeportistasPorClub_enBaseDeDatosDePrueba() {
        Club club = new Club();
        club.setNombreInstitucion("Club Conteo");
        club.setDireccion("Calle Conteo 1");
        Club clubGuardado = clubRepository.save(club);

        Deportista d1 = new Deportista();
        d1.setNombre("Deportista 1");
        d1.setDeporte("Tenis");
        d1.setEdad(20);
        d1.setClub(clubGuardado);
        deportistaRepository.save(d1);

        long cantidad = deportistaRepository.countByClubId(clubGuardado.getId());

        assertEquals(1L, cantidad);
    }

    @Test
    @DisplayName("TC-INT-06 debeGuardarYFiltrarSolicitudesPorEstado_enBaseDeDatosDePrueba")
    void debeGuardarYFiltrarSolicitudesPorEstado_enBaseDeDatosDePrueba() {
        SolicitudRegistro s = new SolicitudRegistro();
        s.setTipo(TipoSolicitud.CLUB);
        s.setEstado(EstadoSolicitud.PENDIENTE);
        s.setDatosAdjuntos("{\"nombre\":\"Club Solicitud\"}");
        s.setFechaEnvio(LocalDateTime.now());
        solicitudRepository.save(s);

        List<SolicitudRegistro> pendientes = solicitudRepository.findByEstado(EstadoSolicitud.PENDIENTE);

        assertFalse(pendientes.isEmpty());
        assertTrue(pendientes.stream().allMatch(sol -> sol.getEstado() == EstadoSolicitud.PENDIENTE));
    }

    @Test
    @DisplayName("TC-INT-07 debeGuardarYConsultarAdministrador_enBaseDeDatosDePrueba")
    void debeGuardarYConsultarAdministrador_enBaseDeDatosDePrueba() {
        Administrador admin = Administrador.builder()
                .usuario("AdminIntTest")
                .password("$2a$10$xyz")
                .email("adminint@test.com")
                .build();
        adminRepository.save(admin);

        Optional<Administrador> encontrado = adminRepository.findByUsuario("AdminIntTest");

        assertTrue(encontrado.isPresent());
        assertEquals("adminint@test.com", encontrado.get().getEmail());
    }

    @Test
    @Tag("bug-conocido") // BUG-02D: Falla a nivel base de datos por varchar(255) al no validarse en DTO
    @DisplayName("TC-INT-08 debeFallarAlSuperarVarchar255EnBaseDeDatos_cuandoNombreSupera255Caracteres")
    void debeFallarAlSuperarVarchar255EnBaseDeDatos_cuandoNombreSupera255Caracteres() {
        Club club = new Club();
        club.setNombreInstitucion("X".repeat(256));
        club.setDireccion("Av. 123");

        assertThrows(Exception.class, () -> {
            clubRepository.saveAndFlush(club);
        }, "Al guardar un nombre con más de 255 caracteres debería lanzar excepción de persistencia");
    }
}
