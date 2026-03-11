import { Component, input } from '@angular/core';
import { ActivityDto } from '../../models/activity/activity.dto';
import { DistancePipe } from '../../pipes/distance.pipe';
import { DurationPipe } from '../../pipes/duration.pipe';
import { PacePipe } from '../../pipes/pace.pipe';
import { ElevationPipe } from '../../pipes/elevation.pipe';
import { HeartRatePipe } from '../../pipes/heart-rate.pipe';
import { CaloriesPipe } from '../../pipes/calories.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { ACTIVITY_TYPE_ICONS } from '../../constants/activity-type-icons';
import { ActivityType } from '../../enums/activity-type.enum';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';

@Component({
  selector: 'app-activity-list',
  imports: [
    DistancePipe,
    DurationPipe,
    PacePipe,
    ElevationPipe,
    HeartRatePipe,
    CaloriesPipe,
    LocalizedDatePipe,
    TranslatePipe,
  ],
  templateUrl: './activity-list.html',
  styles: ``,
})
export class ActivityList {
  activitiesData = input.required<ActivityDto[]>();
  readonly activityTypeIcons = ACTIVITY_TYPE_ICONS;
  readonly activityTypeEnum = ActivityType;

  // Icon paths
  durationIcon = './images/activity/duration.svg';
  distanceIcon = './images/activity/distance.svg';
  elevationIcon = './images/activity/elevation.svg';
  paceIcon = './images/activity/pace.svg';
  heartRateIcon = './images/activity/heart.svg';
  caloriesIcon = './images/activity/calories.svg';
  deviceIcon = './images/activity/device.svg';

  getActivityTypeIcon(type: ActivityType): string {
    return (
      this.activityTypeIcons.find((icon) => icon.type === type)?.src ||
      this.activityTypeIcons.find((icon) => icon.type === ActivityType.Other)?.src ||
      ''
    );
  }
}
