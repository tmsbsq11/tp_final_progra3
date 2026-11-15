import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Cliente } from '../models/perfil.model';

@Service()
export class ClientesClient {
    private readonly http=inject(HttpClient);
    private readonly url='/';

    todosClientes(){
        return this.http.get<Cliente[]>(this.url);
    }
    obtenerClientePorId(id:string|number){
        return this.http.get<Cliente>(`${this.url}/${id}`);
    }
    actualizarCliente(id:string|number,clienteActualizado:Cliente){
        return this.http.put<Cliente>(`${this.url}/${id}`,clienteActualizado);
    }
    //ver si agregar el de eliminar y agregar
}
