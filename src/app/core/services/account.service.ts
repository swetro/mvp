import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginDto } from '../models/account/login.dto';
import { VerifyOtpDto } from '../models/account/verify-otp.dto';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AuthenticationResultDto } from '../models/account/authentication-result.dto';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);

  login(login: LoginDto): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/account/login`, login);
  }

  verifyOtp(verifyOtp: VerifyOtpDto): Observable<AuthenticationResultDto> {
    return this.http.post<AuthenticationResultDto>(
      `${environment.apiUrl}/account/verify-otp`,
      verifyOtp,
    );
  }
}
