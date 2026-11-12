package com.grupo3.oficio.repository.servicio;

import com.grupo3.oficio.model.trabajos.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio,Integer>, JpaSpecificationExecutor<Servicio> {

}
