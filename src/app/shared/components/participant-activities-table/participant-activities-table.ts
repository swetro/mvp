import { Component, input } from '@angular/core';
import { ActivityDto } from '../../models/activity.dto';
import { DistancePipe } from '../../pipes/distance.pipe';
import { DurationPipe } from '../../pipes/duration.pipe';
import { PacePipe } from '../../pipes/pace.pipe';
import { ElevationPipe } from '../../pipes/elevation.pipe';
import { HeartRatePipe } from '../../pipes/heart-rate.pipe';
import { CaloriesPipe } from '../../pipes/calories.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-participant-activities-table',
  imports: [
    DistancePipe,
    DurationPipe,
    PacePipe,
    ElevationPipe,
    HeartRatePipe,
    CaloriesPipe,
    DatePipe,
  ],
  templateUrl: './participant-activities-table.html',
  styles: ``,
})
export class ParticipantActivitiesTable {
  activitiesData = input.required<ActivityDto[]>();
}
