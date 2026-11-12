package com.grupo3.oficio.model.users;

import com.grupo3.oficio.utils.enums.Rol;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioSalidaDTO {
    private Integer id;
    //credenciales
    private String correo;
    private String username;
    private Boolean isActive;
    //datos
    private String nombre;
    private String apellido;
    private String dni; //api validación ejemplo
    private String direccionFoto;
    private LocalDateTime fechaCreacion;
    //agregar atributo ubicación api (ciudad)
    private Rol rol;
}
