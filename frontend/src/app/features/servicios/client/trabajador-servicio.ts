import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Trabajador } from '../model/trabajador.model';

@Service()
export class TrabajadorServicio {

    private http = inject(HttpClient);
    private url = '/api/trabajadores';

    getTrabajadores(){
        return this.http.get<Trabajador[]>(this.url);
    }

    getTrabajadorById(id: number){
        return this.http.get<Trabajador>(`${this.url}/${id}`);
    }

}
