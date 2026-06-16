package com.grupo3.oficio.model.trabajos;

import com.grupo3.oficio.model.Categoria;
import com.grupo3.oficio.model.users.Trabajador;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "trabajos")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Trabajo { //extiende servicio y producto
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    //bools
    private Boolean isActive;
    private Boolean isApproved;
    // private Boolean needsCertification; Eso va en categoria

    //datos
    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;
    private String titulo;
    private String descripcion;
    @ManyToOne
    @JoinColumn(name = "id_trabajador")
    private Trabajador trabajador;
}
