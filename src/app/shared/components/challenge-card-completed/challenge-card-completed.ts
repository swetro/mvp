import { Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { DurationPipe } from '../../pipes/duration.pipe';
import { DistancePipe } from '../../pipes/distance.pipe';
import { PacePipe } from '../../pipes/pace.pipe';
import { ElevationPipe } from '../../pipes/elevation.pipe';
import { CaloriesPipe } from '../../pipes/calories.pipe';
import { SpeedPipe } from '../../pipes/speed.pipe';
import { ChallengeDto } from '../../models/challenge.dto';
import { ACTIVITY_TYPE_ICONS } from '../../constants/activity-type-icons';
import { ActivityType } from '../../enums/activity-type.enum';

@Component({
  selector: 'app-challenge-card-completed',
  imports: [
    TranslatePipe,
    LocalizedDatePipe,
    TruncatePipe,
    DurationPipe,
    DistancePipe,
    PacePipe,
    ElevationPipe,
    CaloriesPipe,
    SpeedPipe,
  ],
  templateUrl: './challenge-card-completed.html',
  styles: ``,
})
export class ChallengeCardCompleted {
  challengeData = input.required<ChallengeDto>();
  readonly activityTypeEnum = ActivityType;
  readonly activityTypeIcons = ACTIVITY_TYPE_ICONS;

  calendarIcon = './images/shared/calendar.svg';
  usersIcon = './images/shared/users.svg';
  durationIcon = './images/activity/duration.svg';
  distanceIcon = './images/activity/distance.svg';
  elevationIcon = './images/activity/elevation.svg';
  paceIcon = './images/activity/pace.svg';
  caloriesIcon = './images/activity/calories.svg';

  getActivityTypeIcon(type: ActivityType): string {
    return (
      this.activityTypeIcons.find((icon) => icon.type === type)?.src ||
      this.activityTypeIcons.find((icon) => icon.type === ActivityType.Other)?.src ||
      ''
    );
  }
}
