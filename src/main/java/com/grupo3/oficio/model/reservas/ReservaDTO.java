package com.grupo3.oficio.model.reservas;

import com.grupo3.oficio.utils.enums.EstadoReserva;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservaDTO {
    private Integer id;
    private Integer idCliente;
    private Integer idTrabajador;
    private EstadoReserva estadoReserva;
    private LocalDateTime fechaCreacion;
}
