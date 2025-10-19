import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiResult } from '../models/api-result.dto';
import { ItemListDto } from '../models/item-list.dto';
import { HttpResourceRef, httpResource } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DatasetService {
  getParticipantFilters(): HttpResourceRef<ItemListDto[] | undefined> {
    return httpResource<ItemListDto[]>(
      () => ({
        url: `${environment.apiUrl}/dataset/filter/participants`,
      }),
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as ItemListDto[],
      },
    );
  }
}
