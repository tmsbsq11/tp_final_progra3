package com.grupo3.oficio.model.users;

import com.grupo3.oficio.model.resenias.Resenia;
import com.grupo3.oficio.model.trabajos.Trabajo;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.HashSet;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "trabajadores")
public class Trabajador extends User {
    private Double puntaje;
    private String descripcion;
    private Integer minutosMinimoEntreReservas; // bloque minimo tiempo de reserva
    private Double latitud;
    private Double longitud;
}
