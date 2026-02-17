import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AccountService } from './account.service';
import { SignInDto } from '../models/auth/sign-in.dto';
import { SignUpDto } from '../models/auth/sign-up.dto';
import { VerifyOtpDto } from '../models/auth/verify-otp.dto';
import { AuthenticationResultDto } from '../models/auth/authentication-result.dto';

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

  logout(): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/logout`, {}).pipe(
      tap(() => this.isAuthenticated.set(false)),
      catchError(() => {
        // Even if the logout request fails, clear the local state
        this.isAuthenticated.set(false);
        return of(undefined);
      }),
    );
  }

  resendOtp(email: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/resend-otp`, { email });
  }

  signIn(signIn: SignInDto): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/login`, signIn);
  }

  signUp(signUp: SignUpDto): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/register`, signUp);
  }

  verifyOtp(verifyOtp: VerifyOtpDto): Observable<AuthenticationResultDto> {
    return this.http.post<AuthenticationResultDto>(
      `${environment.apiUrl}/auth/verify-otp`,
      verifyOtp,
    );
  }
}
