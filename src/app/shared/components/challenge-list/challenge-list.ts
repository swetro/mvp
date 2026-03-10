import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';
import { ChallengeDto } from '../../models/challenge.dto';
import { ACTIVITY_TYPE_ICONS } from '../../constants/activity-type-icons';
import { ActivityType } from '../../enums/activity-type.enum';

@Component({
  selector: 'app-challenge-list',
  imports: [TranslatePipe, LocalizedDatePipe],
  templateUrl: './challenge-list.html',
  styles: ``,
})
export class ChallengeList {
  challengesData = input.required<ChallengeDto[]>();
  activityTypeIcons = ACTIVITY_TYPE_ICONS;
  activityTypeEnum = ActivityType;

  // Icon paths
  calendarIcon = './images/shared/calendar.svg';
  usersIcon = './images/shared/users.svg';

  getActivityTypeIcon(type: ActivityType): string {
    return (
      this.activityTypeIcons.find((icon) => icon.type === type)?.src ||
      this.activityTypeIcons.find((icon) => icon.type === ActivityType.Other)?.src ||
      ''
    );
  }
}
