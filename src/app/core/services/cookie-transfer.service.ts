import { Injectable, PLATFORM_ID, REQUEST, inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CookieTransferService {
  private platformId = inject(PLATFORM_ID);
  private cookies = '';

  constructor() {
    if (isPlatformServer(this.platformId)) {
      const request = inject(REQUEST, { optional: true });
      if (request) {
        this.cookies = request.headers.get('Cookie') || '';
      }
    }
  }

  getCookies(): string {
    return this.cookies;
  }

  isServer(): boolean {
    return isPlatformServer(this.platformId);
  }
}
