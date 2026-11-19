import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estaAutenticado()) {
    return router.createUrlTree(['/login']);
  }

  const rol = authService.getUserRole()?.toLowerCase() ?? '';
  const roles = route.data['roles'] as string[] | undefined;

  if (roles && !roles.includes(rol)) {
    if (rol === 'trabajador') {
      return router.createUrlTree(['/mis-postulaciones']);
    }

    if (rol === 'admin') {
      return router.createUrlTree(['/servicios']);
    }

    return router.createUrlTree(['/']);
  }

  return true;
};