import { Injectable, Signal } from '@angular/core';
import { ActivityType } from '../enums/activity-type.enum';
import { ActivityVolumeStatsDto } from '../models/stats/activity-volume-stats.dto';
import { HttpResourceRef, httpResource } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResult } from '../models/api-result.dto';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  GetActivityVolumeStats(
    year: Signal<number>,
    month?: Signal<number | undefined>,
    weekOfYear?: Signal<number | undefined>,
    activityType?: Signal<ActivityType | undefined>,
  ): HttpResourceRef<ActivityVolumeStatsDto | undefined> {
    return httpResource<ActivityVolumeStatsDto>(
      () => {
        const params = new URLSearchParams();
        if (year?.()) params.append('year', year().toString());
        if (month?.()) params.append('month', month()!.toString());
        if (weekOfYear?.()) params.append('weekOfYear', weekOfYear()!.toString());
        if (activityType?.()) params.append('activityType', activityType()!);
        const query = params.toString() ? `?${params.toString()}` : '';

        return { url: `${environment.apiUrl}/stats/activity-volume${query}` };
      },
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as ActivityVolumeStatsDto,
      },
    );
  }
}
