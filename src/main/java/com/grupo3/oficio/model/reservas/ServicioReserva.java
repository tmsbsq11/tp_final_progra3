package com.grupo3.oficio.model.reservas;

import jakarta.persistence.Table;
import jdk.jfr.Enabled;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Enabled
@Table(name = "servicio_reservas")
public class ServicioReserva extends Reserva {
    private LocalDateTime inicio;
    private LocalDateTime fin;
}
