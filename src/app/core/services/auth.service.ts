import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  isAuthenticated = signal<boolean>(false);

  checkAuthentication(): Observable<boolean> {
    return this.http.get(`${environment.apiUrl}/auth/session`).pipe(
      map(() => true),
      tap((isAuth) => this.isAuthenticated.set(isAuth)),
      catchError(() => {
        this.isAuthenticated.set(false);
        return of(false);
      }),
    );
  }

  logout(): void {
    this.isAuthenticated.set(false);
  }
}
