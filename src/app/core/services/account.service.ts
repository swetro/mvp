import { Injectable, inject } from '@angular/core';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserProfileDto } from '../models/auth/user-profile.dto';
import { ApiResult } from '../../shared/models/api-result.dto';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);

  getProfile(): HttpResourceRef<UserProfileDto | undefined> {
    return httpResource<UserProfileDto>(
      () => {
        return {
          url: `${environment.apiUrl}/account/profile`,
        };
      },
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as UserProfileDto,
      },
    );
  }
}
