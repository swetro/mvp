import { Component, input } from '@angular/core';
import { ActivityDto } from '../../models/activity/activity.dto';
import { DistancePipe } from '../../pipes/distance.pipe';
import { DurationPipe } from '../../pipes/duration.pipe';
import { PacePipe } from '../../pipes/pace.pipe';
import { ElevationPipe } from '../../pipes/elevation.pipe';
import { HeartRatePipe } from '../../pipes/heart-rate.pipe';
import { CaloriesPipe } from '../../pipes/calories.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';

@Component({
  selector: 'app-participant-activities-table',
  imports: [
    DistancePipe,
    DurationPipe,
    PacePipe,
    ElevationPipe,
    HeartRatePipe,
    CaloriesPipe,
    TranslatePipe,
    LocalizedDatePipe,
  ],
  templateUrl: './participant-activities-table.html',
  styles: ``,
})
export class ParticipantActivitiesTable {
  readonly activitiesData = input.required<ActivityDto[]>();
}
