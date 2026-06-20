package com.grupo3.oficio.repository.reservas;

import com.grupo3.oficio.model.reservas.ServicioReserva;
import com.grupo3.oficio.model.users.Cliente;
import com.grupo3.oficio.model.users.Trabajador;
import com.grupo3.oficio.utils.enums.EstadoReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ServicioReservaRepository extends JpaRepository<ServicioReserva, Integer> {
    Optional<ServicioReserva> findByFechaReservadaAndEstadoReserva(LocalDateTime fechaReservada, EstadoReserva EstadoReserva);

    boolean existsByTrabajadorAndEstadoReservaAndInicioLessThanAndFinGreaterThan(
            Trabajador trabajador,
            EstadoReserva estadoReserva,
            LocalDateTime fin,
            LocalDateTime inicio
    );
    boolean existsByClienteAndInicioLessThanAndFinGreaterThan(
            Cliente cliente,
            LocalDateTime fechaFin,
            LocalDateTime fechaInicio);
    boolean existsByTrabajadorAndInicioLessThanAndFinGreaterThan(
            Trabajador trabajador,
            LocalDateTime fechaFin,
            LocalDateTime fechaInicio);
    List<ServicioReserva> findByIdTrabajador(Integer idTrabajador);
    List<ServicioReserva> findByIdCliente(Integer idCliente);
}
