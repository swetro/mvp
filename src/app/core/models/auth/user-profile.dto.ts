import { DeviceDto } from '../profile/device.dto';

export interface UserProfileDto {
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  email: string;
  phoneNumber: string;
  gender: string;
  age: number;
  birthDate: Date;
  country: string;
  countryCode: string;
  state: string;
  stateCode: string;
  city: string;
  instagramAccount: string;
  defaultLanguageCode: string;
  isComplete: boolean;
  hasSynchronizedDevices: boolean;
  devices: DeviceDto[];
}
