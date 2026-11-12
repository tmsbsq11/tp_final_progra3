export interface Servicio {
    id ?: number|string;
    isActive : boolean;
    isApproved : boolean;
    categoria : {
        id : number;
        nombre : string;
    };
    titulo : string;
    descripcion : string;
    trabajador : {
        id :number
        nombre : string;
    }; //Spring busca la categoría y el trabajador y los asocia al servicio, por eso no pongo solo los id como en el dto
}
export type ServicioModeloFormulario = Omit<Servicio,'id'>;
//ver si guardamos los estado reserva aca
