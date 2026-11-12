package com.grupo3.oficio.model.reservas;

import com.grupo3.oficio.model.trabajos.Servicio;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "servicio_reservas")
public class ServicioReserva extends Reserva {
    private LocalDateTime inicio;
    private LocalDateTime fin;
    @ManyToOne
    @JoinColumn(name = "servicio_id")
    private Servicio servicio;
}
