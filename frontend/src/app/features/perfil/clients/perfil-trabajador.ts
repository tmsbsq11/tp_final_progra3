import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class PerfilTrabajadorClient {
    private readonly http=inject(HttpClient);
    private readonly url='api/trabajadores/perfil';

    obtenerPerfil(){
        return this.http.get<Trabajador>(this.url);
    }
}
export interface Trabajador{
    id:string|number,
    correo:string,
    username:string,
    dni:number,
    descripcion:string,
    fechaCreacion:string,
    puntaje:number,
    nombre:string,
    apellido:string,

}
