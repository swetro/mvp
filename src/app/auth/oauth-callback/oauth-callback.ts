import { Component, effect, inject, OnInit, signal } from '@angular/core';
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
export class OauthCallback implements OnInit {
  private deviceService = inject(DeviceService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private languageService = inject(LanguageService);

  private step2Params = signal<AddDeviceStep2Dto | null>(null);

  addDeviceResource = this.deviceService.addDeviceStep2(this.step2Params);
  currentLanguage = this.languageService.getCurrentLanguage();

  ngOnInit() {
    const provider = this.route.snapshot.params['provider'];
    const oauthToken = this.route.snapshot.queryParams['oauth_token'];
    const oauthVerifier = this.route.snapshot.queryParams['oauth_verifier'];

    if (provider && oauthToken && oauthVerifier) {
      this.step2Params.set({
        provider: provider,
        requestToken: oauthToken,
        code: oauthVerifier,
      });
    }
  }

  constructor() {
    effect(() => {
      // Check if there is an error first to avoid reading the value
      if (this.addDeviceResource.error()) {
        this.router.navigate(['/', this.currentLanguage, 'account', 'devices'], {
          queryParams: {
            provider: this.step2Params()?.provider,
            error: 'add-device-error',
          },
        });
        return;
      }

      const result = this.addDeviceResource.value();
      if (result) {
        this.router.navigate(['/', this.currentLanguage, 'account', 'devices'], {
          queryParams: {
            provider: this.step2Params()?.provider,
            league: result.league,
            challengeId: result.challengeId,
          },
        });
      }
    });
  }
}
