import { Component, effect, inject, signal } from '@angular/core';
import { DeviceService } from '../../shared/services/device.service';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { DeviceBrand } from '../../shared/enums/device-brand.enum';
import { DEVICE_PROVIDERS } from '../../shared/constants/device-providers';
import { MetaTagsService } from '../../shared/services/meta-tags.service';

@Component({
  selector: 'app-devices',
  imports: [TranslateModule, TranslatePipe],
  templateUrl: './devices.html',
  styles: ``,
})
export class Devices {
  private deviceService = inject(DeviceService);
  private authService = inject(AuthService);
  private currentSlug = signal<string | undefined>(undefined);
  private translate = inject(TranslateService);
  private metaTagsService = inject(MetaTagsService);

  devices = DEVICE_PROVIDERS;
  selectedBrand = signal<DeviceBrand | null>(null);
  isDisconnecting = signal(false);

  currentUser = this.authService.currentUser;
  providerUrlData = this.deviceService.addDeviceStep1(this.selectedBrand, this.currentSlug);
  pageMetadata = {
    title: this.translate.instant('devices.title'),
    description: this.translate.instant('devices.description'),
  };

  constructor() {
    effect(() => {
      const meta = this.pageMetadata;
      if (meta) this.metaTagsService.updateMetaTags(meta);
    });

    effect(() => {
      const url = this.providerUrlData.value();
      if (url) window.location.href = url;
    });
  }

  hasDeviceConnected(brand: DeviceBrand) {
    return this.currentUser()?.devices?.some((d) => d.brand === brand) ?? false;
  }

  connect(brand: DeviceBrand) {
    this.selectedBrand.set(brand);
  }

  disconnect(brand: DeviceBrand) {
    this.isDisconnecting.set(true);
    this.deviceService.removeDevice(brand).subscribe({
      next: () => {
        this.authService.refreshUserProfile();
        this.isDisconnecting.set(false);
      },
      error: () => {
        this.isDisconnecting.set(false);
      },
    });
  }
}
