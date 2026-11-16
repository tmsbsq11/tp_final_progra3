import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Cliente } from '../models/perfil.model';

@Service()
export class ClientePerfilClient {
        private http=inject(HttpClient);
        private url= 'api/clientes/perfil';

        obtenerClientePerfil(){
            return this.http.get<Cliente>(this.url);
        }
        actualizarPerfil(datos:Cliente){
            return this.http.post<Cliente>(this.url,datos);
        }

}
