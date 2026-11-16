import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// sirve para no cargar vistas que tiren errores de autorizacion
// Pero la seguridad real la tiene el backend
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estaAutenticado()) {
    return router.createUrlTree(['/login']);
  }
  if (authService.getUserRole()?.toUpperCase() === 'ADMIN') {
    return true;
  }
  return router.createUrlTree(['/']);
};
