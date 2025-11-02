import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/autenticacion.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const requiredRoles = route.data['roles'] as string[];
  
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const currentUser = authService.getUsuarioActual();
  
  if (currentUser && requiredRoles.includes(currentUser.rol)) {
    return true;
  }

  alert('No tienes permisos para acceder a esta pagina.');
  return router.createUrlTree(['/dashboard']);
};