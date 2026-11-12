import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly router= inject(Router);

  private readonly tokenKey = 'oficiosya_token';
  //estado de sesion, si hay token en sessionStorage es true, sino false.
  private readonly autenticado= signal<boolean>(
    !!sessionStorage.getItem(this.tokenKey)
  );

  estaAutenticado= this.autenticado.asReadonly();

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
  logout():void {
    sessionStorage.removeItem('oficiosya_token');
    this.autenticado.set(false);
    this.router.navigate(['/login']);
  }
}