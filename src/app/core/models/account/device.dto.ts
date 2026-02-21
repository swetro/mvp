import { DeviceBrand } from '../../../shared/enums/device-brand.enum';

export interface DeviceDto {
  brand: DeviceBrand;
  lastSyncTime: Date;
  creationTime: Date;
}
