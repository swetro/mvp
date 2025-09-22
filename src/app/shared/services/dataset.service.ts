import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiResult } from '../models/api-result.dto';
import { ItemListDto } from '../models/item-list.dto';

@Injectable({
  providedIn: 'root',
})
export class DatasetService {
  async getParticipantFilters(): Promise<ItemListDto[]> {
    const response = await fetch(`${environment.apiUrl}/dataset/filter/participants`, {
      headers: {
        'Accept-Language': 'en',
      },
    });
    const result = (await response.json()) as ApiResult;
    return result.data as ItemListDto[];
  }
}
