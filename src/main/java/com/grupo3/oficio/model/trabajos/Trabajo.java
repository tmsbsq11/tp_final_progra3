package com.grupo3.oficio.model.trabajos;

import com.grupo3.oficio.model.Categoria;
import com.grupo3.oficio.model.users.Trabajador;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Trabajo { //extiende servicio y producto
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    //bools
    private Boolean isActive;
    private Boolean needsCertification;

    //datos
    @OneToOne
    @Column(name = "id_categoria")
    private Categoria categoria;
    private String titulo;
    private String descripcion;
    @ManyToOne
    @Column(name = "id_trabajador")
    private Trabajador trabajador;
}
