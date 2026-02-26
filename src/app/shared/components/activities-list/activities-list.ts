import { Component, input, inject } from '@angular/core';
import { ActivityDto } from '../../models/activity/activity.dto';
import { DistancePipe } from '../../pipes/distance.pipe';
import { DurationPipe } from '../../pipes/duration.pipe';
import { PacePipe } from '../../pipes/pace.pipe';
import { ElevationPipe } from '../../pipes/elevation.pipe';
import { HeartRatePipe } from '../../pipes/heart-rate.pipe';
import { CaloriesPipe } from '../../pipes/calories.pipe';
import { DatePipe } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ACTIVITY_TYPE_ICONS } from '../../constants/activity-type-icons';
import { ActivityType } from '../../enums/activity-type.enum';

@Component({
  selector: 'app-activities-list',
  imports: [
    DistancePipe,
    DurationPipe,
    PacePipe,
    ElevationPipe,
    HeartRatePipe,
    CaloriesPipe,
    DatePipe,
    TranslatePipe,
  ],
  templateUrl: './activities-list.html',
  styles: ``,
})
export class ActivitiesList {
  activitiesData = input.required<ActivityDto[]>();
  translateService = inject(TranslateService);

  activityTypeIcons = ACTIVITY_TYPE_ICONS;
  activityTypeEnum = ActivityType;

  // Icon paths
  durationIcon = './images/activity/duration.svg';
  distanceIcon = './images/activity/distance.svg';
  elevationIcon = './images/activity/elevation.svg';
  paceIcon = './images/activity/pace.svg';
  heartRateIcon = './images/activity/heart.svg';
  caloriesIcon = './images/activity/calories.svg';
  deviceIcon = './images/activity/device.svg';

  get dateFormat(): string {
    const lang = this.translateService.getCurrentLang();
    return lang === 'es' ? 'dd MMM yyyy, HH:mm' : 'MMM dd yyyy, h:mm a';
  }

  getActivityTypeIcon(type: ActivityType): string {
    return (
      this.activityTypeIcons.find((icon) => icon.type === type)?.src ||
      this.activityTypeIcons.find((icon) => icon.type === ActivityType.Other)?.src ||
      ''
    );
  }
}
