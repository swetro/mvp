import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginDto } from '../models/account/login.dto';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);

  login(login: LoginDto): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/account/login`, login);
  }
}
