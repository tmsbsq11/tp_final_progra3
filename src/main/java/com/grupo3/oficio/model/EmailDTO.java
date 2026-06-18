package com.grupo3.oficio.model;

import lombok.Data;

@Data
public class EmailDTO {
    private String destinatario;
    private String asunto;
    private String mensaje;
}
