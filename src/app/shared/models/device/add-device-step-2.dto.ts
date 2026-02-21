import { DeviceBrand } from '../../enums/device-brand.enum';

export interface AddDeviceStep2Dto {
  provider: DeviceBrand;
  requestToken: string;
  code: string;
}
