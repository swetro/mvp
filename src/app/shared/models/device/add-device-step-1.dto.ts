import { DeviceBrand } from '../../enums/device-brand.enum';

export interface AddDeviceStep1Dto {
  provider: DeviceBrand;
  league: string;
  challengeId: string;
}
