package com.pp2.crazySports.config;

import com.pp2.crazySports.model.admin.Administrador;
import com.pp2.crazySports.repository.IAdminRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminCreado implements CommandLineRunner {

    private final IAdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    // Inyección de los valores desde application.properties
    @Value("${app.admin.user}")
    private String adminUser;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.email}")
    private String adminEmail;

    // Constructor manual para combinar los beans finales y las propiedades
    public AdminCreado(IAdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (adminRepository.count() == 0) {
            Administrador admin = new Administrador();
            admin.setUsuario(adminUser);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setEmail(adminEmail);

            adminRepository.save(admin);
            System.out.println("Se creó el administrador inicial con éxito.");
        }
    }
}