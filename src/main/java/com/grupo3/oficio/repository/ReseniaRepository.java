package com.grupo3.oficio.repository;

import com.grupo3.oficio.model.resenias.Resenia;
import com.grupo3.oficio.utils.enums.DireccionResenia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReseniaRepository extends JpaRepository<Resenia, Integer> {
List<Resenia> findByIdTrabajadorAndDireccionResenia(Integer idTrabajador, DireccionResenia direccionResenia);
List<Resenia> findByIdClienteAndDireccionResenia(Integer idCliente, DireccionResenia direccionResenia);
}
