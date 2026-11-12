package com.grupo3.oficio.model.users;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClienteSalidaDTO extends UsuarioSalidaDTO{
    private Double puntaje;
    private String descripcion;
}
