import { ItemListDto } from '../item-list.dto';

export interface StatsFiltersDatasetDto {
  years: ItemListDto[];
  months: ItemListDto[];
  activityTypes: ItemListDto[];
}
