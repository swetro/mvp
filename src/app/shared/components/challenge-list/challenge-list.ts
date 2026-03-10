import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';
import { ChallengeDto } from '../../models/challenge.dto';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { ACTIVITY_TYPE_ICONS } from '../../constants/activity-type-icons';
import { ActivityType } from '../../enums/activity-type.enum';
import { ChallengeStatus } from '../../enums/challenge-status.enum';

@Component({
  selector: 'app-challenge-list',
  imports: [NgClass, TranslatePipe, LocalizedDatePipe, TruncatePipe],
  templateUrl: './challenge-list.html',
  styles: ``,
})
export class ChallengeList {
  challengesData = input.required<ChallengeDto[]>();
  activityTypeIcons = ACTIVITY_TYPE_ICONS;
  activityTypeEnum = ActivityType;
  challengeStatusEnum = ChallengeStatus;

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

  getProgressPercent(challenge: ChallengeDto): number {
    return Math.min(Math.round(challenge.currentUser?.progress ?? 0), 100);
  }

  isChallengeStarted(challenge: ChallengeDto): boolean {
    return new Date(challenge.startTime) >= new Date();
  }
}
