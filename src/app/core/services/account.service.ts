import { Injectable, inject } from '@angular/core';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserProfileDto } from '../models/account/user-profile.dto';
import { UpdateProfileDto } from '../models/account/update-profile.dto';
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

  updateProfile(data: UpdateProfileDto) {
    return this.http.put<void>(`${environment.apiUrl}/account/profile`, data);
  }

  uploadProfilePicture(file: File) {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<void>(`${environment.apiUrl}/account/profile/picture`, form);
  }

  deleteProfilePicture() {
    return this.http.delete<void>(`${environment.apiUrl}/account/profile/picture`);
  }
}
