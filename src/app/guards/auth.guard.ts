import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  let authService: AuthService;
  authService = inject(AuthService);
  let router: Router;
  router = inject(Router);
  if (authService.isUserLogged()) {
    return true;
  } else {
    router.navigate(['']);
    return false;
  }
};
