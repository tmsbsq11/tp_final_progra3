export interface Perfil {
    id: string | number;
    correo: string;
    username: string;
    dni: number;
    apellido: string;
    fechaCreacion: string;
    puntaje: number;
    nombre: string;
}

export interface Cliente extends Perfil{
    id:string,
    correo: string,
    username:string,
    puntaje: number,
    dni:number,
    apellido:string,
    fechaCreacion:string,
    nombre:string,
    descripcion: string,
}

export interface Trabajador extends Perfil{
    id:string,
    correo:string,
    username:string,
    dni:number,
    descripcion:string,
    fechaCreacion:string,
    puntaje:number,
    nombre:string,
    apellido:string,

}
