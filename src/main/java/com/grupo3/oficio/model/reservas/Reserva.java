package com.grupo3.oficio.model.reservas;

import com.grupo3.oficio.utils.enums.EstadoReserva;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "id_trabajador")
    private Integer idTrabajador;
    @Column(name = "id_cliente")
    private Integer idCliente;

    private EstadoReserva estadoReserva;
    private LocalDateTime fechaCreacion;
}
