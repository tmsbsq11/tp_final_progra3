import {inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
// sirve para evitar que una persona acceda sin sesion
//no valida que el token siga siendo valido o si expiro
export const authGuard: CanActivateFn= (route,state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = sessionStorage.getItem('oficiosya_token');
    if(authService.estaAutenticado()){
        return true;
    }
    return router.createUrlTree(['/login']);
}