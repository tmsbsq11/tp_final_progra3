export interface ReservaNueva {
    idCliente: number;
    idTrabajador: number;
    idServicio: number;
    fechaReservada: string; // yyyy-MM-dd
    horaInicio: string;     // HH:mm
    horaFin: string;        // HH:mm
  }