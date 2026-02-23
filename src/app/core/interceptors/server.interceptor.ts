import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

export const serverInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId) && req.url.startsWith('/api')) {
    // URL absolutizada para que HttpClient funcione durante SSR o prerender
    const newReq = req.clone({
      url: `https://aca-services-openswetro.grayhill-df08ba08.eastus2.azurecontainerapps.io${req.url}`,
    });
    return next(newReq);
  }

  return next(req);
};
