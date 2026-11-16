import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ClienteAdmin, TrabajadorAdmin } from './usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuariosAdminService {
  private readonly http = inject(HttpClient);

  // Solo ADMIN (lo valida el backend)
  listarClientes() {
    return this.http.get<ClienteAdmin[]>('/api/clientes');
  }

  listarTrabajadores() {
    return this.http.get<TrabajadorAdmin[]>('/api/trabajadores');
  }
}
