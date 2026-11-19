package com.grupo3.oficio.repository;

import com.grupo3.oficio.model.Notificacion;
import com.grupo3.oficio.utils.enums.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Integer> {
    List<Notificacion> findByIdDestinoAndRol(Integer idDestino, Rol rol);

    List<Notificacion> findByIdDestinoAndRolAndLeida(
            Integer idDestino,
            Rol rol,
            boolean leida
    );
}
