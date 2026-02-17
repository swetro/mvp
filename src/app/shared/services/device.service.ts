import { inject, Injectable, Signal } from '@angular/core';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResult } from '../models/api-result.dto';
import { DeviceBrand } from '../Enums/device-brand.enum';
import { ChallengeConfigService } from './challenge-config.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private readonly challengeConfigService = inject(ChallengeConfigService);

  getDeviceProviderUrl(
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

  // getGarminUrl(slug: Signal<string | null>): HttpResourceRef<string | undefined> {
  //   return httpResource<string>(
  //     () => {
  //       const s = slug();
  //       if (s === null) return undefined;

  //       const baseUrl = `${environment.apiUrl}/devices/garmin/get-url`;
  //       if (s === '') return { url: baseUrl };

  //       const { leagueSlug, challengeId } = this.getChallengeConfig(s);
  //       return {
  //         url: `${baseUrl}?league=${leagueSlug}&challengeId=${challengeId}`,
  //       };
  //     },
  //     {
  //       parse: (raw: unknown) => (raw as ApiResult)?.data as string,
  //     },
  //   );
  // }
}
