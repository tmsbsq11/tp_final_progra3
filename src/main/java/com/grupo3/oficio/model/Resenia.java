package com.grupo3.oficio.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "resenias")
public class Resenia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "id_cliente")
    private Integer idCliente;

    @Column(name = "id_trabajador")
    private Integer idTrabajador;

    private Double puntaje;
    private String comentario;
    private LocalDateTime fechaCreacion;
}
