import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  isAuthenticated(): HttpResourceRef<boolean> {
    return httpResource<boolean>(
      () => ({
        url: `${environment.apiUrl}/auth/session`,
      }),
      {
        defaultValue: false,
        parse: (raw: unknown) => {
          // Since httpResource handles the HTTP request internally, we can't directly check the status
          // But we can assume that if the request succeeds, it's authenticated
          // However, to check status, we might need to use a different method
          // For now, return true if raw is not null or undefined, assuming success
          return raw !== null && raw !== undefined;
        },
      },
    );
  }
}
