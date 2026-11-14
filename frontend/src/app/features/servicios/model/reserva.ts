export interface Reserva {
    'id': number;
    'idCliente': number|string;
    'idTrabajador': number|string;
    'idServicio': number|string;
    'estadoReserva': string;
    'fechaCreacion': string; //ver si es string o otro tipo
    'fechaReservada': string;
    'horaInicio': string;
    'horaFin': string;    
}
export type ServicioModeloFormulario = Omit<Reserva,'id'>;
//ver si guardamos los estado reserva aca