export type DireccionResenia = 'CLIENTEATRABAJADOR' | 'TRABAJADORACLIENTE';

export interface NuevaResenia {
  idCliente: number;
  idTrabajador: number;
  puntaje: number;
  comentario: string;
  direccionResenia: DireccionResenia;
}

//datos que Angular usa para mostrar una reseña.
export interface ReseniaRecibida {
  id: number;
  puntaje: number;
  comentario: string;
  fechaCreacion: string;
  cliente?: { id: number } | null;
  trabajador?: { id: number } | null;
  direccionResenia?: DireccionResenia;
}