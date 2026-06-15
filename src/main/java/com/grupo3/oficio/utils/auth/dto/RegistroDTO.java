package com.grupo3.oficio.utils.auth.dto;

import com.grupo3.oficio.utils.enums.Rol;
import lombok.Data;

@Data
public class RegistroDTO {
    private String nombre;
    private String correo;
    private String password;
    private Rol rol;
}
