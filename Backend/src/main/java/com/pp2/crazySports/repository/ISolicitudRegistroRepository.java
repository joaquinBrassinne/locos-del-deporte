package com.pp2.crazySports.repository;

import com.pp2.crazySports.model.enums.EstadoSolicitud;
import com.pp2.crazySports.model.enums.TipoSolicitud;
import com.pp2.crazySports.model.solicitud.SolicitudRegistro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ISolicitudRegistroRepository extends JpaRepository<SolicitudRegistro, Long> {
    List<SolicitudRegistro> findByEstado(EstadoSolicitud estado);
    List<SolicitudRegistro>findByTipo(TipoSolicitud  tipo);
    List<SolicitudRegistro>findByEstadoAndTipo(EstadoSolicitud estado, TipoSolicitud tipo);
}
