import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignInDto } from '../models/account/sign-in.dto';
import { SignUpDto } from '../models/account/sign-up.dto';
import { VerifyOtpDto } from '../models/account/verify-otp.dto';
import { environment } from '../../../environments/environment';
import { AuthenticationResultDto } from '../models/account/authentication-result.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);

  resendOtp(email: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/account/resend-otp`, { email });
  }

  signIn(signIn: SignInDto): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/account/login`, signIn);
  }

  signUp(signUp: SignUpDto): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/account/register`, signUp);
  }

  verifyOtp(verifyOtp: VerifyOtpDto): Observable<AuthenticationResultDto> {
    return this.http.post<AuthenticationResultDto>(
      `${environment.apiUrl}/account/verify-otp`,
      verifyOtp,
    );
  }
}
