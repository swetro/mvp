import { DeviceBrand } from '../../enums/device-brand.enum';

export interface DeviceProvider {
  brand: DeviceBrand;
  label: string;
  logoSrc: string;
}
