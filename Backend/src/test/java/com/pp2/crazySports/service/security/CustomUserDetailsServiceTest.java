package com.pp2.crazySports.service.security;

import com.pp2.crazySports.model.admin.Administrador;
import com.pp2.crazySports.repository.IAdminRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private IAdminRepository adminRepository;

    @InjectMocks
    private CustomUserDetailsService userDetailsService;

    @Test
    @DisplayName("TC-SEC-01 debeRetornarUserDetailsConRolAdmin_cuandoUsuarioExiste")
    void debeRetornarUserDetailsConRolAdmin_cuandoUsuarioExiste() {
        Administrador admin = new Administrador(1L, "AdminRoot", "$2a$10$encoded", "admin@crazysports.com");
        when(adminRepository.findByUsuario("AdminRoot")).thenReturn(Optional.of(admin));

        UserDetails userDetails = userDetailsService.loadUserByUsername("AdminRoot");

        assertNotNull(userDetails);
        assertEquals("AdminRoot", userDetails.getUsername());
        assertEquals("$2a$10$encoded", userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
    }

    @Test
    @DisplayName("TC-SEC-02 debeLanzarUsernameNotFoundException_cuandoUsuarioNoExiste")
    void debeLanzarUsernameNotFoundException_cuandoUsuarioNoExiste() {
        when(adminRepository.findByUsuario("NoExiste")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userDetailsService.loadUserByUsername("NoExiste"));
    }
}
