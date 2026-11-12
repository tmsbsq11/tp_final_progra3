import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {Servicio} from '../model/servicio.model';

@Injectable({ providedIn: 'root' })
export class ClienteServicios {
    // readonly es solo para lectura, no deja cambiarle el valor
    private readonly url='/api/servicios'; 
    private cliente = inject(HttpClient);

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

    //Si no se ingresa texto, la búsqueda se hace sin filtro de texto
    buscarServicios( busqueda = '', idCategoria ?: number) {
        //el 1er string es para el nombre y el 2do para el valor del filtro y el ={} es para que empiece en vacio
        const params : Record<string, string> = {};

        const texto = busqueda.trim(); //limpia el texto y agrega lo que este escrito

        if(texto){
            params['busqueda'] = texto; //si el campo esta vacio el if salta ese filtro
        }

        if(idCategoria !== undefined){
            params['idCategoria'] = String(idCategoria); //si el campo esta vacio el if salta ese filtro
        }

        return this.cliente.get<Servicio[]>(`${this.url}/buscar`,{params}); //arma la ruta api-servicios-buscar
    }

}
