export interface ReservaNueva {
    idCliente: number;
    idTrabajador: number;
    idServicio: number;
    fechaReservada: string; // yyyy-MM-dd
    horaInicio: string;     // HH:mm
    horaFin: string;        // HH:mm
}

export type EstadoReserva = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'FINALIZADO';

export interface ReservaDetalle {
    id: number;
    estadoReserva: EstadoReserva;
    inicio: string;
    fin: string;
    servicio: { id: number; titulo: string };
    trabajador: { id: number; nombre: string };
    cliente: { id: number; nombre: string; apellido?: string | null }; // el campo queda opcional para que la ficha pueda mostrar el nombre si una reserva viene sin apellido
  }