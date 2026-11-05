package com.pp2.crazySports.repository;

import com.pp2.crazySports.model.admin.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IAdminRepository extends JpaRepository<Administrador, Long> {
    Optional<Administrador> findByUsuario(String usuario);
}
