import { DeviceBrand } from '../../../shared/Enums/device-brand.enum';

export interface DeviceDto {
  brand: DeviceBrand;
  lastSyncTime: Date;
  creationTime: Date;
}
