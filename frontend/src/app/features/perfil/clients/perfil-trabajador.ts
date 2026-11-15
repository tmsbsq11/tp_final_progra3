import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Trabajador } from '../models/perfil.model';
@Service()
export class PerfilTrabajadorClient {
    private readonly http=inject(HttpClient);
    private readonly url='api/trabajadores/perfil';

    obtenerPerfil(){
        return this.http.get<Trabajador>(this.url);
    }
    actualizarPerfil(perfilActualizado:Trabajador){
        return this.http.put<Trabajador>(this.url,perfilActualizado);
    }
}