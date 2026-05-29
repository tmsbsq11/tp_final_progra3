package com.grupo3.oficio.model.trabajos;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "servicios")
public class Servicio extends Trabajo {
    private Integer minTiempo = 30; //minutos
    private Double precioEstimadoPorHora;
    //max tiempo
}
