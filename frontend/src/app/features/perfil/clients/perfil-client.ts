import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class ClientePerfilClient {
        private http=inject(HttpClient);
        private url= 'api/clientes/perfil';

        obtenerClientePerfil(){
            return this.http.get<Cliente>(this.url);
        }

}
export interface Cliente{
    id:string,
    correo: string,
    username:string,
    puntaje: number,
    dni:string|number,
    apellido:string,
    fechaCreacion:string,
    nombre:string,
}
