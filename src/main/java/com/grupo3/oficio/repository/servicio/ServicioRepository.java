package com.grupo3.oficio.repository.servicio;

import com.grupo3.oficio.model.trabajos.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio,Integer> {
}
