package com.grupo3.oficio.model;

import com.grupo3.oficio.model.users.User;
import com.grupo3.oficio.utils.enums.TipoNotificacion;
import com.grupo3.oficio.utils.enums.TipoUsuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.query.sql.internal.ParameterRecognizerImpl;

import java.time.LocalDateTime;

//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Entity
//@Table(name="notificaciones")
public class Notificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String titulo;
    private String mensaje;
    private LocalDateTime fechaCreacion;
    private boolean leida;
    private TipoNotificacion tipoNotificacion;

    private Integer idDestino;

    @Enumerated(EnumType.STRING)
    private TipoUsuario tipoDestino;
}
