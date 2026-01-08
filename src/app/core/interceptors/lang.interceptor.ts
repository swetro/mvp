import { HttpInterceptorFn } from '@angular/common/http';
import { DOCUMENT, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

export const LangInterceptor: HttpInterceptorFn = (req, next) => {
  const document = inject(DOCUMENT);
  const supportedLangs = environment.supportedLanguages || ['en'];
  const defaultLanguage = environment.defaultLanguage || 'en';
  const currentUrl = document.location?.pathname || '';

  let lang = defaultLanguage;
  const segments = currentUrl.split('/').filter((s) => s);

  if (segments.length > 0 && supportedLangs.includes(segments[0])) {
    lang = segments[0];
  }

  const modifiedReq = req.clone({
    setHeaders: {
      'Accept-Language': lang,
    },
  });
  return next(modifiedReq);
};
