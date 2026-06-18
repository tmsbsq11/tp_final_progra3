package com.grupo3.oficio.model.resenias;

import com.grupo3.oficio.model.users.Cliente;
import com.grupo3.oficio.model.users.Trabajador;
import com.grupo3.oficio.utils.enums.DireccionResenia;
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

    @OneToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @OneToOne
    @JoinColumn(name = "id_trabajador")
    private Trabajador trabajador;

    private Double puntaje;
    private String comentario;
    private LocalDateTime fechaCreacion;
    @Enumerated(EnumType.STRING)
    private DireccionResenia direccionResenia;
}
