import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiResult } from '../models/api-result.dto';
import { ItemListDto } from '../models/item-list.dto';
import { HttpResourceRef, httpResource } from '@angular/common/http';
import { LanguageService } from '../../core/services/language.service';

@Injectable({
  providedIn: 'root',
})
export class DatasetService {
  private languageService = inject(LanguageService);

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
}
