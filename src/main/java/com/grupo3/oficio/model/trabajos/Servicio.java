package com.grupo3.oficio.model.trabajos;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "servicios")
public class Servicio extends Trabajo {
    private Integer minTiempo; //minutos
    private Double precioEstimadoPorHora;
    //max tiempo
}
