package com.pp2.crazySports.config;

import com.pp2.crazySports.model.admin.Administrador;
import com.pp2.crazySports.repository.IAdminRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminCreadoTest {

    @Mock
    private IAdminRepository adminRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private AdminCreado adminCreado;

    @BeforeEach
    void setUp() {
        adminCreado = new AdminCreado(adminRepository, passwordEncoder);
        ReflectionTestUtils.setField(adminCreado, "adminUser", "AdminRoot");
        ReflectionTestUtils.setField(adminCreado, "adminPassword", "locos1234");
        ReflectionTestUtils.setField(adminCreado, "adminEmail", "admin@crazysports.com");
    }

    @Test
    @DisplayName("TC-CFG-01 debeCrearAdminPorDefectoConPasswordHasheada_cuandoBaseDeDatosEstaVacia")
    void debeCrearAdminPorDefectoConPasswordHasheada_cuandoBaseDeDatosEstaVacia() throws Exception {
        when(adminRepository.count()).thenReturn(0L);
        when(passwordEncoder.encode("locos1234")).thenReturn("$2a$10$hashedAdminPassword");

        adminCreado.run();

        ArgumentCaptor<Administrador> captor = ArgumentCaptor.forClass(Administrador.class);
        verify(adminRepository, times(1)).save(captor.capture());

        Administrador guardado = captor.getValue();
        assertEquals("AdminRoot", guardado.getUsuario());
        assertEquals("$2a$10$hashedAdminPassword", guardado.getPassword());
        assertEquals("admin@crazysports.com", guardado.getEmail());
    }

    @Test
    @DisplayName("TC-CFG-02 noDebeCrearAdmin_cuandoYaExisteRegistroEnBaseDeDatos")
    void noDebeCrearAdmin_cuandoYaExisteRegistroEnBaseDeDatos() throws Exception {
        when(adminRepository.count()).thenReturn(1L);

        adminCreado.run();

        verify(adminRepository, never()).save(any());
        verifyNoInteractions(passwordEncoder);
    }
}
