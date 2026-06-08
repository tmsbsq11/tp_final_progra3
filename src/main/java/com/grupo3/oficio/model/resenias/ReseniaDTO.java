package com.grupo3.oficio.model.resenias;

import com.grupo3.oficio.utils.enums.DireccionResenia;
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
    private Double puntaje;
    private String comentario;
    private LocalDateTime fechaCreacion;
    private DireccionResenia direccionResenia;
}
