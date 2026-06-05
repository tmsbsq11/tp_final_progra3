package com.grupo3.oficio.model.trabajos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor


public abstract class TrabajoDTO {
    private Integer id;
    private Boolean isActive;
    // private Boolean needsCertification;
    private Integer idCategoria;
    private Integer idTrabajador;

}
