import { ItemListDto } from '../item-list.dto';

export interface EditProfileDatasetDto {
  countries: ItemListDto[];
  genders: ItemListDto[];
  feetForHeight: ItemListDto[];
  languages: ItemListDto[];
  inchesForHeight: ItemListDto[];
  measurementSystems: ItemListDto[];
  months: ItemListDto[];
  years: ItemListDto[];
}
