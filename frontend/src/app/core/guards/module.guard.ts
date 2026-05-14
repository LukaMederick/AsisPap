import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Requiere `route.data['module']` = slug de módulo (`AppModule`). */
export const moduleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const mod = route.data['module'] as string | undefined;
  if (!mod || auth.hasModule(mod)) {
    return true;
  }
  return router.parseUrl(auth.getDefaultHomePath());
};
