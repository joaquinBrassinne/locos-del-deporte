package com.pp2.crazySports.repository;

import com.pp2.crazySports.model.deportista.Deportista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IDeportistaRepository extends JpaRepository<Deportista, Long> {
    List<Deportista> findByClubId(Long clubId);
    List<Deportista> findByClubIsNull();
    long countByClubId(Long clubId);
    List<Deportista> findByDeporteIgnoreCase(String deporte);
    List<Deportista> findByDeporteAdaptadoTrue();

}
