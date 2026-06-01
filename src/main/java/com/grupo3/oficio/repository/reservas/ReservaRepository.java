package com.grupo3.oficio.repository.reservas;

import com.grupo3.oficio.model.reservas.Reserva;
import com.grupo3.oficio.utils.enums.EstadoReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
    Optional<Reserva> findByFechaReservadaAndEstadoReserva(LocalDateTime fechaReservada, EstadoReserva EstadoReserva);
}
