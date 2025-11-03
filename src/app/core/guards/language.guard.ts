import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LanguageService } from '../services/language.service';

export const languageGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const languageService = inject(LanguageService);

  const langParam = route.params['lang'];
  console.log('languageGuard activated for langParam:', langParam);

  // If the first segment is a supported language, set language and allow navigation
  if (languageService.isSupportedLanguage(langParam)) {
    languageService.setLanguage(langParam);
    return true;
  }

  // If no language prefix, redirect to detected language
  const detectedLang = languageService.getBrowserLanguage();
  console.log('No valid langParam, redirecting to detected language:', detectedLang);

  const newUrl = `/${detectedLang}${state.url}`;

  router.navigate([newUrl], { replaceUrl: true });
  return false;
};
