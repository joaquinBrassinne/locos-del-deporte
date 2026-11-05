package com.pp2.crazySports.service.security;

import com.pp2.crazySports.model.admin.Administrador;
import com.pp2.crazySports.repository.IAdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final IAdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Administrador admin = adminRepository.findByUsuario(username).orElseThrow(() -> new UsernameNotFoundException("Admin " + username + " no encontrado"));
        return User.builder().username(admin.getUsuario()).password(admin.getPassword()).roles("ADMIN").build();
    }
}
