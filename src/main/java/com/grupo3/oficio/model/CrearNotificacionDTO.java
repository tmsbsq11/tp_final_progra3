package com.grupo3.oficio.model;

import com.grupo3.oficio.utils.enums.Rol;
import com.grupo3.oficio.utils.enums.TipoNotificacion;
import com.grupo3.oficio.utils.enums.TipoUsuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CrearNotificacionDTO {
    private String titulo;
    private String mensaje;
    private TipoNotificacion tipoNotificacion;
    private Integer idUserDestino;
    private Rol rol;

}
