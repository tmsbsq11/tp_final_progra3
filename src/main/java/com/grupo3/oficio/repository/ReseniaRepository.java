package com.grupo3.oficio.repository;

import com.grupo3.oficio.model.resenias.Resenia;
import com.grupo3.oficio.utils.enums.DireccionResenia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReseniaRepository extends JpaRepository<Resenia, Integer> {
    List<Resenia> findByTrabajadorIdAndDireccionResenia(
            Integer idTrabajador,
            DireccionResenia direccionResenia);

    List<Resenia> findByClienteIdAndDireccionResenia(
            Integer idCliente,
            DireccionResenia direccionResenia);
}
