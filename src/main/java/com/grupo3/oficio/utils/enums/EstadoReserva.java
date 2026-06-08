package com.grupo3.oficio.utils.enums;

public enum EstadoReserva {
    PENDIENTE, RECHAZADO, APROBADO, FINALIZADO;

    public boolean puedeCambiarA(EstadoReserva nuevo) {
        return switch (this) {
            case PENDIENTE ->
                    nuevo == APROBADO || nuevo == RECHAZADO;
            case APROBADO ->
                    nuevo == FINALIZADO || nuevo == RECHAZADO;
            case RECHAZADO, FINALIZADO ->
                    false;
        };
    }
}
