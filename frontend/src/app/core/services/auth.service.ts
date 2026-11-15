import { HttpClient } from '@angular/common/http';
import { Injectable, inject,signal } from '@angular/core';
import {Router} from '@angular/router'
import {jwtDecode} from 'jwt-decode';
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
  register(correo: string, password: string,rol: string,nombre: string) {
    return this.http.post('/api/auth/register', { correo, password,rol,nombre }, {
      responseType: 'text',
    });
  }

guardarSesion(token: string): void {
  sessionStorage.setItem(this.tokenKey, token);
  this.autenticado.set(true);
}

  logout():void {
    sessionStorage.removeItem('oficiosya_token');
    this.autenticado.set(false);
    this.router.navigate(['/login']);
  }
  getToken(): string|null {
    return sessionStorage.getItem('oficiosya_token');
  }
  getUserId(): number|null {
    const token = this.getToken();
    if(!token) return null;
    try {
      const payload = jwtDecode<TokenPayload>(token);
      return payload.id ?? null;
    } catch {
      return null;
    }
  }
    getUserRole(): string|null {
      const token = this.getToken();
      if(!token) return null;
      try{
        const payload = jwtDecode<TokenPayload>(token);
        return payload.role ?? null;
      } catch {
        return null;
      }
    }
}

interface TokenPayload {
    id:number;
    correo: string,
    role: string
  }
  