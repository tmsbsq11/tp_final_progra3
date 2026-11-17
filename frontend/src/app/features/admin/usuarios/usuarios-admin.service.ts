import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  ClienteAdmin,
  ClienteFormulario,
  TrabajadorAdmin,
  TrabajadorFormulario,
} from './usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuariosAdminService {
  private readonly http = inject(HttpClient);

  // clientes
  listarClientes() {
    return this.http.get<ClienteAdmin[]>('/api/clientes');
  }
  obtenerCliente(id: number) {
    return this.http.get<ClienteAdmin>(`/api/clientes/${id}`);
  }
  crearCliente(datos: ClienteFormulario) {
    return this.http.post<ClienteAdmin>('/api/clientes', datos);
  }
  actualizarCliente(id: number, datos: ClienteFormulario) {
    return this.http.put<ClienteAdmin>(`/api/clientes/${id}`, datos);
  }
  // estas dos devuelven texto plano, por eso responseType: 'text'
  desactivarCliente(id: number) {
    return this.http.delete(`/api/clientes/${id}`, { responseType: 'text' });
  }
  reactivarCliente(id: number) {
    return this.http.put(`/api/clientes/reactivar/${id}`, null, { responseType: 'text' });
  }

  // trabajadores
  listarTrabajadores() {
    return this.http.get<TrabajadorAdmin[]>('/api/trabajadores');
  }
  obtenerTrabajador(id: number) {
    return this.http.get<TrabajadorAdmin>(`/api/trabajadores/${id}`);
  }
  crearTrabajador(datos: TrabajadorFormulario) {
    return this.http.post<TrabajadorAdmin>('/api/trabajadores', datos);
  }
  actualizarTrabajador(id: number, datos: TrabajadorFormulario) {
    return this.http.put<TrabajadorAdmin>(`/api/trabajadores/${id}`, datos);
  }
  desactivarTrabajador(id: number) {
    return this.http.delete(`/api/trabajadores/${id}`, { responseType: 'text' });
  }
  reactivarTrabajador(id: number) {
    return this.http.put(`/api/trabajadores/reactivar/${id}`, null, { responseType: 'text' });
  }
}
