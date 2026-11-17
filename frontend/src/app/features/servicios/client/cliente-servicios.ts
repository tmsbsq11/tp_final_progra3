import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GuardarServicio, Servicio } from '../model/servicio.model';

@Injectable({ providedIn: 'root' })
export class ClienteServicios {
  // readonly es solo para lectura, no deja cambiarle el valor
  private readonly url = '/api/servicios';
  private cliente = inject(HttpClient);

  obtenerServicios() {
    return this.cliente.get<Servicio[]>(this.url);
  }

  obtenerServicioPorId(id: number) {
    return this.cliente.get<Servicio>(`${this.url}/${id}`);
  }

  agregarServicio(servicio: GuardarServicio) {
    return this.cliente.post<Servicio>(this.url, servicio);
  }

  modificarServicio(id: number, servicio: GuardarServicio) {
    return this.cliente.put<Servicio>(`${this.url}/${id}`, servicio);
  }

  eliminarServicio(id: number) {
    return this.cliente.delete(`${this.url}/${id}`);
  }

  activarServicio(id: number) {
    return this.cliente.put(`${this.url}/activar/${id}`,null);
  }

  //Si no se ingresa texto, la búsqueda se hace sin filtro de texto
  buscarServicios(busqueda = '', idCategoria?: number) {
    //el 1er string es para el nombre y el 2do para el valor del filtro y el ={} es para que empiece en vacio
    const params: Record<string, string> = {};

    const texto = busqueda.trim(); //limpia el texto y agrega lo que este escrito

    if (texto) {
      params['busqueda'] = texto; //si el campo esta vacio el if salta ese filtro
    }

    if (idCategoria !== undefined) {
      params['idCategoria'] = String(idCategoria); //si el campo esta vacio el if salta ese filtro
    }

    return this.cliente.get<Servicio[]>(`${this.url}/buscar`, { params }); //arma la ruta api-servicios-buscar
  }

  obtenerCategorias() { //indica los campos que usa, el nombre para el selector y el id para el filtro, y devuelve una lsita
    return this.cliente.get<{ id: number; nombre: string }[]>('/api/categorias');
  }
}