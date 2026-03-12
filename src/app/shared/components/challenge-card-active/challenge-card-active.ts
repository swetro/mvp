import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { ChallengeDto } from '../../models/challenge.dto';
import { ACTIVITY_TYPE_ICONS } from '../../constants/activity-type-icons';
import { ActivityType } from '../../enums/activity-type.enum';

@Component({
  selector: 'app-challenge-card-active',
  imports: [NgClass, TranslatePipe, LocalizedDatePipe, TruncatePipe],
  templateUrl: './challenge-card-active.html',
  styles: ``,
})
export class ChallengeCardActive {
  challengeData = input.required<ChallengeDto>();
  readonly activityTypeIcons = ACTIVITY_TYPE_ICONS;

  calendarIcon = './images/shared/calendar.svg';
  usersIcon = './images/shared/users.svg';

  getActivityTypeIcon(type: ActivityType): string {
    return (
      this.activityTypeIcons.find((icon) => icon.type === type)?.src ||
      this.activityTypeIcons.find((icon) => icon.type === ActivityType.Other)?.src ||
      ''
    );
  }

  getProgressPercent(): number {
    return Math.min(Math.round(this.challengeData().currentUser?.progress ?? 0), 100);
  }
}
