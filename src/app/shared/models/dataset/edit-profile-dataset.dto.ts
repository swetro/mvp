import { ItemListDto } from '../item-list.dto';

export interface EditProfileDatasetDto {
  countries: ItemListDto[];
  genders: ItemListDto[];
  languages: ItemListDto[];
  months: ItemListDto[];
  years: ItemListDto[];
}
