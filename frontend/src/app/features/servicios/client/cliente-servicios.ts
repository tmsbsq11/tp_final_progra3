import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import {Servicio} from '../model/servicio.model';
@Service()
export class ClienteServicios {
    private url=''; //reemplazar con la url del back o json server
    private cliente=inject(HttpClient);

    obtenerServicios() {
        return this.cliente.get(this.url);
    }
    obtenerServicioPorId(id: number) {
        return this.cliente.get(`${this.url}/${id}`);
    }
    agregarServicio(servicio: Servicio){
        return this.cliente.post(this.url,servicio);
    }
    modificarServicio(id:number,servicio: Servicio){
        return this.cliente.put(`${this.url}/${id}`,servicio);
    }
    eliminarServicio(id:number){
        return this.cliente.delete(`${this.url}/${id}`);
    }
}
