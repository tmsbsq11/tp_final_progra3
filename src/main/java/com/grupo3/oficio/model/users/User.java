package com.grupo3.oficio.model.users;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@MappedSuperclass
@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    //credenciales
    private String correo;
    private String username;
    private String password;
    private Boolean isActive;

    //datos
    private String nombre;
    private String apellido;
    private String dni; //api validación ejemplo
    private String direccionFoto;
    private LocalDateTime fechaCreacion;
    //agregar atributo ubicación api (ciudad)
}
