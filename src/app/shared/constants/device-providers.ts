import { DeviceBrand } from '../enums/device-brand.enum';
import { DeviceProvider } from '../models/device/device-provider.model';

export const DEVICE_PROVIDERS: DeviceProvider[] = [
  {
    brand: DeviceBrand.Garmin,
    label: 'Garmin',
    logoSrc: '/images/device-garmin.svg',
  },
  {
    brand: DeviceBrand.Suunto,
    label: 'Suunto',
    logoSrc: '/images/device-suunto.svg',
  },
  {
    brand: DeviceBrand.Wahoo,
    label: 'Wahoo',
    logoSrc: '/images/device-wahoo.svg',
  },
  {
    brand: DeviceBrand.Polar,
    label: 'Polar',
    logoSrc: '/images/device-polar.svg',
  },
  {
    brand: DeviceBrand.Coros,
    label: 'Coros',
    logoSrc: '/images/device-coros.png',
  },
  {
    brand: DeviceBrand.Igpsport,
    label: 'iGPSPORT',
    logoSrc: '/images/device-igpsport.svg',
  },
];
