import { Injectable, Signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiResult } from '../models/api-result.dto';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import { ActivityDto } from '../models/activity/activity.dto';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  getWeeklyActivities(
    year: Signal<number>,
    weekOfYear: Signal<number>,
  ): HttpResourceRef<ActivityDto[] | undefined> {
    return httpResource<ActivityDto[]>(
      () => {
        return {
          url: `${environment.apiUrl}/activities/weekly?year=${year()}&weekOfYear=${weekOfYear()}`,
        };
      },
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as ActivityDto[],
      },
    );
  }
}
