package com.grupo3.oficio.model.trabajos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServicioDTO extends TrabajoDTO{
    private Integer minTiempo = 30; //minutos
    private Double precioEstimadoPorHora;
}
