// === Import : NPM
import {inject} from '@angular/core';
import {CanActivateFn} from '@angular/router';

// === Import : LOCAL
import {AuthService} from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  if (!authService.isAuthenticated()) {
    authService.redirectToLogin();
    return false;
  }

  const expectedRoles = route.data['expectedRoles'] || [];
  for (const expectedRole of expectedRoles) {
    if (authService.hasRole(expectedRole)) {
      return true;
    }
  }

  return false;
};
