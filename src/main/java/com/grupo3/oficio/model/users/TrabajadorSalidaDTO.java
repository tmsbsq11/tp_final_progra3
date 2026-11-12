package com.grupo3.oficio.model.users;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrabajadorSalidaDTO extends UsuarioSalidaDTO{
    private Double puntaje;
    private String descripcion;
    private Integer minutosMinimoEntreReservas; // bloque minimo tiempo de reserva
    private Double latitud;
    private Double longitud;


}
