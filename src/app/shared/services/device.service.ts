import { inject, Injectable, Signal } from '@angular/core';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResult } from '../models/api-result.dto';
import { DeviceBrand } from '../enums/device-brand.enum';
import { ChallengeConfigService } from './challenge-config.service';
import { AddDeviceStep2Dto } from '../models/device/add-device-step-2.dto';
import { AddDeviceResultDto } from '../models/device/add-device-result.dto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private readonly challengeConfigService = inject(ChallengeConfigService);
  private http = inject(HttpClient);

  addDeviceStep1(
    brand: Signal<DeviceBrand | null>,
    slug: Signal<string | undefined>,
  ): HttpResourceRef<string | undefined> {
    return httpResource<string>(
      () => {
        const b = brand()?.toString().toLowerCase();
        if (!b) return undefined;

        const s = slug();
        const baseUrl = `${environment.apiUrl}/devices/${b}/get-url`;

        if (!s) return { url: baseUrl };

        const { leagueSlug, challengeId } = this.challengeConfigService.getChallengeConfig(s);
        return {
          url: `${baseUrl}?league=${leagueSlug}&challengeId=${challengeId}`,
        };
      },
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as string,
      },
    );
  }

  addDeviceStep2(
    addDeviceStep2: Signal<AddDeviceStep2Dto | null>,
  ): HttpResourceRef<AddDeviceResultDto | undefined> {
    return httpResource<AddDeviceResultDto>(
      () => {
        const b = addDeviceStep2()?.provider?.toString().toLowerCase();
        if (!b) return undefined;

        return {
          url: `${environment.apiUrl}/devices/${b}/get-uat?requestToken=${addDeviceStep2()?.requestToken}&code=${addDeviceStep2()?.code}`,
        };
      },
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as AddDeviceResultDto,
      },
    );
  }

  removeDevice(brand: DeviceBrand): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/devices/${brand.toLowerCase()}`);
  }
}
