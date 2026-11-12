import { Injectable } from '@angular/core';

const CLAVE = 'oficiosya_token';

@Injectable({ providedIn: 'root' })
export class TokenService {
  guardar(token: string): void { sessionStorage.setItem(CLAVE, token); }
  obtener(): string | null { return sessionStorage.getItem(CLAVE); }
  borrar(): void { sessionStorage.removeItem(CLAVE); }
}