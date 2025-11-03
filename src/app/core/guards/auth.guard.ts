import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../services/language.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const languageService = inject(LanguageService);
  const router = inject(Router);
  const currentLanguage = languageService.getCurrentLanguage();

  return authService.checkAuthentication().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      } else {
        return router.createUrlTree(['/', currentLanguage, 'account', 'sign-in'], {
          queryParams: {
            returnUrl: state.url,
          },
        });
      }
    }),
    catchError(() => {
      return of(router.createUrlTree(['/', currentLanguage, 'account', 'sign-in']));
    }),
  );

  // return authService.isAuthenticated().pipe(
  //   map((isAuthenticated) => {
  //     if (isAuthenticated) {
  //       return true;
  //     }

  //     return router.createUrlTree(['/', currentLanguage, 'account', 'sign-in'], {
  //       queryParams: {
  //         returnUrl: state.url,
  //       },
  //     });
  //   }),
  // );
};
