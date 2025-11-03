import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LanguageService } from '../services/language.service';

export const languageGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const languageService = inject(LanguageService);

  const langParam = route.params['lang'];

  // If the first segment is a supported language, set language and allow navigation
  if (languageService.isSupportedLanguage(langParam)) {
    languageService.setLanguage(langParam);
    return true;
  }

  // If no language prefix, redirect to detected language
  const detectedLang = languageService.getBrowserLanguage();

  const urlWithoutLang = state.url.replace(/^\/[^/]+/, '');
  const newUrl = `/${detectedLang}${urlWithoutLang}`;

  router.navigate([newUrl], { replaceUrl: true });
  return false;
};
