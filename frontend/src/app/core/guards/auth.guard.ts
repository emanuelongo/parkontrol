import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardClass {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLogged()) return true;
    this.router.navigate(['/login']);
    return false;
  }
}

/* For use with provideRouter you can export a function:
   export const authGuard: CanActivateFn = (route, state) => { ... }
   but here we'll keep class-based guard for potential NgModule use */
