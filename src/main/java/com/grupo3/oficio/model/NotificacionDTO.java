package com.grupo3.oficio.model;

import com.grupo3.oficio.utils.enums.TipoNotificacion;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class NotificacionDTO {
    private Integer id;
    private String titulo;
    private String mensaje;
    private LocalDateTime fechaCreacion;
    private boolean leida;
    private TipoNotificacion tipoNotificacion;
    private Integer idUserDestino;
}
