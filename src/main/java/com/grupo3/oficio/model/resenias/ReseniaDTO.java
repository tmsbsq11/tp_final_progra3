package com.grupo3.oficio.model.resenias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReseniaDTO {
    private Integer id;
    private Integer idCliente;
    private Integer idTrabajador;
    private double puntaje;
    private String comentario;
    private LocalDateTime fechaCreacion;
}
