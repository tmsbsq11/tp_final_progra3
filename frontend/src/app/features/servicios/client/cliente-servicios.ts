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
  buscarServicios(
    busqueda = '',
    idCategoria?: number,
    lat?: number, // busca por latitud, longitud y radio 
    lng?: number,
    radioKm?: number
  ) {
    const params: Record<string, string> = {};

    const texto = busqueda.trim();

    if (texto) {
      params['busqueda'] = texto;
    }

    if (idCategoria !== undefined) {
      params['idCategoria'] = String(idCategoria);
    }

    if (
      lat !== undefined &&
      lng !== undefined &&
      radioKm !== undefined
    ) {
      params['lat'] = String(lat);
      params['lng'] = String(lng);
      params['radioKm'] = String(radioKm);
    }

    return this.cliente.get<Servicio[]>(
      `${this.url}/buscar`,
      { params }
    );
  }

  obtenerCategorias() { //indica los campos que usa, el nombre para el selector y el id para el filtro, y devuelve una lsita
    return this.cliente.get<{ id: number; nombre: string; isActive: boolean }[]>('/api/categorias');
  }

  validarServicio(id:number|string|undefined){
    return this.cliente.put<Servicio>(`${this.url}/validar/${id}`,null)
  }
}