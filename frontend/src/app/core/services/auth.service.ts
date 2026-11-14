import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
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
  