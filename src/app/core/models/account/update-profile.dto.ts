export interface UpdateProfileDto {
  firstName: string;
  lastName: string;
  countryCode?: string;
  gender?: string;
  birthDate?: string;
  defaultLanguageCode?: string;
  phoneNumber?: string;
  measurementSystem?: string;
  heightInCentimeters?: number;
  weightInKilograms?: number;
}
