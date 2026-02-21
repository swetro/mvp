import { Component, effect, inject, signal } from '@angular/core';
import { DeviceService } from '../../shared/services/device.service';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { DeviceBrand } from '../../shared/enums/device-brand.enum';

@Component({
  selector: 'app-devices',
  imports: [TranslateModule],
  templateUrl: './devices.html',
  styles: ``,
})
export class Devices {
  private deviceService = inject(DeviceService);
  private authService = inject(AuthService);
  private currentSlug = signal<string | undefined>(undefined);

  selectedBrand = signal<DeviceBrand | null>(null);
  currentUser = this.authService.currentUser;
  DeviceBrand = DeviceBrand;

  providerUrlData = this.deviceService.addDeviceStep1(this.selectedBrand, this.currentSlug);

  hasDeviceConnected(brand: DeviceBrand) {
    return this.currentUser()?.devices?.some((d) => d.brand === brand) ?? false;
  }

  constructor() {
    effect(() => {
      const url = this.providerUrlData.value();
      if (url) window.location.href = url;
    });
  }

  connect(brand: DeviceBrand) {
    this.selectedBrand.set(brand);
  }

  // private trigger = signal<string | null>(null);

  // currentUser = this.authService.currentUser;
  // devices = computed(() => this.currentUser()?.devices ?? []);
  // hasGarmin = computed(
  //   () => this.currentUser()?.devices?.some((d) => d.brand.toLowerCase() === 'garmin') ?? false,
  // );
  // garminUrlData = this.deviceService.getGarminUrl(this.trigger);

  // constructor() {
  //   effect(() => {
  //     const url = this.garminUrlData.value();
  //     if (url) {
  //       window.location.href = url;
  //     }
  //   });
  // }

  // getGarminUrl() {
  //   this.trigger.set('');
  // }
}
