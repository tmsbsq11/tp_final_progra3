import { Trabajador } from "./trabajador.model";

export interface Servicio {
    id ?: number|string;
    isActive : boolean;
    isApproved : boolean;
    categoria : {
        id : number;
        nombre : string;
        isActive : boolean;
    };
    titulo : string;
    descripcion : string;
    trabajador : Trabajador;
    minTiempo: number;
    precioEstimadoPorHora: number;
    }; //Spring busca la categoría y el trabajador y los asocia al servicio, por eso no pongo solo los id como en el dto
export type ServicioModeloFormulario = Omit<Servicio,'id'>;
//ver si guardamos los estado reserva aca

//dtos que angular le manda al back para crear o editar una postulacion
export interface GuardarServicio {
  idCategoria: number;
  idTrabajador: number;
  titulo: string;
  descripcion: string;
  minTiempo: number;
  precioEstimadoPorHora: number;
}