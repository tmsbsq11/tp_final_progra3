import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly http = inject(HttpClient);

  ///es tipo post pq estamos enviando datos, si fuera get no enviaria nada y no se podrian validar los datos.
  login(correo: string, password: string) {
    return this.http.post('/api/auth/login', { correo, password }, {
      responseType: 'text',
    });
  }
  register(correo: string, password: string) {
    return this.http.post('/api/auth/register', { correo, password }, {
      responseType: 'text',
    });
  }
}