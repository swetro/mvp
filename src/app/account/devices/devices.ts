import { Component, effect, inject, signal } from '@angular/core';
import { DeviceService } from '../../shared/services/device.service';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { DeviceBrand } from '../../shared/enums/device-brand.enum';
import { DEVICE_PROVIDERS } from '../../shared/constants/device-providers';

@Component({
  selector: 'app-devices',
  imports: [TranslatePipe],
  templateUrl: './devices.html',
  styles: ``,
})
export class Devices {
  private readonly deviceService = inject(DeviceService);
  private readonly authService = inject(AuthService);
  private readonly currentSlug = signal<string | undefined>(undefined);

  readonly devices = DEVICE_PROVIDERS;
  readonly selectedBrand = signal<DeviceBrand | null>(null);
  readonly isDisconnecting = signal(false);

  readonly currentUser = this.authService.currentUser;
  readonly providerUrlData = this.deviceService.addDeviceStep1(this.selectedBrand, this.currentSlug);

  constructor() {
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
