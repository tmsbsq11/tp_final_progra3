export interface Perfil {
    id: string | number;
    correo: string;
    username: string;
    dni: number;
    apellido: string;
    fechaCreacion: string;
    puntaje: number;
    nombre: string;
    descripcion: string;
}

export interface Cliente extends Perfil{
}

export interface Trabajador extends Perfil{
    minutosMinimoEntreReservas: number,
}
