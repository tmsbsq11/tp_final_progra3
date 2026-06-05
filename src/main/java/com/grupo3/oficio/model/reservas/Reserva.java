package com.grupo3.oficio.model.reservas;

import com.grupo3.oficio.model.users.Cliente;
import com.grupo3.oficio.model.users.Trabajador;
import com.grupo3.oficio.utils.enums.EstadoReserva;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reserva { //abstracto
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "id_trabajador") //obviar, se llama desde el idTrabajo
    private Trabajador trabajador;
    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @Enumerated(EnumType.STRING)
    private EstadoReserva estadoReserva;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaReservada;
}