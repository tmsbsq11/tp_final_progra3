export interface Notificacion{
    'id': number,
    'titulo': string,
    'mensaje': string,
    'fechaCreacion': string,
    'leida': boolean,
    'tipoNotificacion': string,
    'idDestino': number,
    'rol': Rol,
}

export interface CrearNotificacionDTO {
  titulo: string;
  mensaje: string;
  tipoNotificacion: TipoNotificacion;
  idUserDestino: number;
  rol: Rol;
}

export interface NotificacionDTO {
  id?: number;
  titulo: string;
  mensaje: string;
  fechaCreacion?: string;
  leida?: boolean;
  tipoNotificacion: TipoNotificacion;
  idUserDestino: number;
  rol: Rol;
}
export type TipoNotificacion =
  | 'RESERVA'
  | 'RESENIA'
  | 'VALIDACION'
  | 'SISTEMA'
  | 'RECORDATORIO';

export type Rol =
  | 'CLIENTE'
  | 'TRABAJADOR'
  | 'ADMIN';

