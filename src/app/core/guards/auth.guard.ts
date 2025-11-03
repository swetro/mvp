import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../services/language.service';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const languageService = inject(LanguageService);
  const router = inject(Router);
  const currentLanguage = languageService.getCurrentLanguage();

  const isAuthenticated = authService.isAuthenticated();
  if (isAuthenticated.value()) {
    return true;
  }

  return router.createUrlTree(['/', currentLanguage, 'account', 'sign-in'], {
    queryParams: {
      returnUrl: state.url,
    },
  });
};
