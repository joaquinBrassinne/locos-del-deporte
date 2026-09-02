package com.pp2.crazySports.repository;

import com.pp2.crazySports.model.club.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IClubRepository extends JpaRepository<Club, Long> {
    List<Club> findByNombreInstitucionContainingIgnoreCase(String nombre);
    boolean existsByNombreInstitucionIgnoreCase(String nombreInstitucion);
    Optional<Club> findByNombreInstitucionIgnoreCase(String nombreInstitucion);
    List<Club> findByDeporteAdaptadoTrue();
    List<Club> findByDisciplinasContainingIgnoreCase(String disciplina);

    @Query("SELECT c.id, c.nombreInstitucion, c.coordenadas FROM Club c WHERE c.coordenadas IS NOT NULL")
    List<Object[]> findCoordenadas();
}
