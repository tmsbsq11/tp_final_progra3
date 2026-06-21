package com.grupo3.oficio.model.users;

import lombok.AllArgsConstructor;
import lombok.Data;
//import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClienteEntradaDTO extends UsuarioEntradaDTO {
    private Double puntaje;
    private String descripcion;
}
