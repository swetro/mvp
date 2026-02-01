import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieTransferService } from '../services/cookie-transfer.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieTransferService);

  if (cookieService.isServer()) {
    const cookies = cookieService.getCookies();

    if (cookies) {
      const clonedReq = req.clone({
        setHeaders: {
          Cookie: cookies,
        },
        withCredentials: true,
      });

      return next(clonedReq);
    }
  } else {
    const clonedReq = req.clone({
      withCredentials: true,
    });
    return next(clonedReq);
  }

  return next(req);
};
