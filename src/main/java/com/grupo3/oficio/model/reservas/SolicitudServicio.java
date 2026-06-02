package com.grupo3.oficio.model.reservas;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "servicio_solicitudes")
public class SolicitudServicio {
    private LocalDateTime inicio;
    private LocalDateTime fin;
    // idServicio
}
