import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiResult } from '../models/api-result.dto';
import { ItemListDto } from '../models/item-list.dto';
import { HttpResourceRef, httpResource } from '@angular/common/http';
import { LanguageService } from '../../core/services/language.service';
import { EditProfileDatasetDto } from '../models/dataset/edit-profile-dataset.dto';
import { StatsFiltersDatasetDto } from '../models/dataset/stats-filters-dataset.dto';

@Injectable({
  providedIn: 'root',
})
export class DatasetService {
  private languageService = inject(LanguageService);

  getEditProfileDataset(): HttpResourceRef<EditProfileDatasetDto | undefined> {
    return httpResource<EditProfileDatasetDto>(
      () => ({
        url: `${environment.apiUrl}/dataset/edit-profile/${this.languageService.getCurrentLanguage()}`,
      }),
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as EditProfileDatasetDto,
      },
    );
  }

  getParticipantFilters(): HttpResourceRef<ItemListDto[] | undefined> {
    return httpResource<ItemListDto[]>(
      () => ({
        url: `${environment.apiUrl}/dataset/participant/filters/${this.languageService.getCurrentLanguage()}`,
      }),
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as ItemListDto[],
      },
    );
  }

  getStatsFilters(): HttpResourceRef<StatsFiltersDatasetDto | undefined> {
    return httpResource<StatsFiltersDatasetDto>(
      () => ({
        url: `${environment.apiUrl}/dataset/stats/filters/${this.languageService.getCurrentLanguage()}`,
      }),
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as StatsFiltersDatasetDto,
      },
    );
  }
}
