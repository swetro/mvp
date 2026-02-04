import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  isAuthenticated = signal<boolean>(false);

  private userProfileData = this.accountService.getProfile();

  currentUser = computed(() => {
    if (this.isAuthenticated()) {
      return this.userProfileData.value() ?? null;
    }
    return null;
  });

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
