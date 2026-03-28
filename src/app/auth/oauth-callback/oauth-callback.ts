import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from '../../shared/services/device.service';
import { AddDeviceStep2Dto } from '../../shared/models/device/add-device-step-2.dto';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-oauth-callback',
  imports: [],
  templateUrl: './oauth-callback.html',
  styles: ``,
})
export class OauthCallback {
  private readonly deviceService = inject(DeviceService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly languageService = inject(LanguageService);

  private readonly step2Params = signal<AddDeviceStep2Dto | null>(null);

  readonly addDeviceResource = this.deviceService.addDeviceStep2(this.step2Params);
  readonly currentLanguage = this.languageService.getCurrentLanguage();

  constructor() {
    const snapshot = this.route.snapshot;
    const provider = snapshot.params['provider'];
    const queryParams = snapshot.queryParams;

    // OAuth 1.0 (Garmin): oauth_token + oauth_verifier
    const oauthToken = queryParams['oauth_token'];
    const oauthVerifier = queryParams['oauth_verifier'];

    // OAuth 2.0 (Suunto, Wahoo, Polar, Coros, iGPSPORT): code
    const code = queryParams['code'];
    const error = queryParams['error'];

    if (provider && error) {
      this.router.navigate(['/', this.currentLanguage, 'account', 'devices'], {
        queryParams: { provider, error: 'add-device-error' },
        replaceUrl: true,
      });
    } else if (provider && oauthToken && oauthVerifier) {
      this.step2Params.set({ provider, requestToken: oauthToken, code: oauthVerifier });
    } else if (provider && code) {
      this.step2Params.set({ provider, requestToken: '', code });
    }

    effect(() => {
      if (this.addDeviceResource.error()) {
        this.router.navigate(['/', this.currentLanguage, 'account', 'devices'], {
          queryParams: { provider, error: 'add-device-error' },
        });
        return;
      }

      const result = this.addDeviceResource.value();
      if (result) {
        this.router.navigate(['/', this.currentLanguage, 'account', 'devices'], {
          queryParams: { provider, league: result.league, challengeId: result.challengeId },
        });
      }
    });
  }
}
