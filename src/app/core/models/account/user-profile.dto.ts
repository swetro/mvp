import { MeasurementSystem } from '../../../shared/enums/measurement-system.enum';
import { DeviceDto } from './device.dto';

export interface UserProfileDto {
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  email: string;
  phoneNumber: string;
  gender: string;
  age: number;
  birthDate: string;
  measurementSystem: MeasurementSystem;
  heightInCentimeters: number;
  weightInKilograms: number;
  country: string;
  countryCode: string;
  defaultLanguageCode: string;
  isComplete: boolean;
  hasSynchronizedDevices: boolean;
  devices: DeviceDto[];
}
