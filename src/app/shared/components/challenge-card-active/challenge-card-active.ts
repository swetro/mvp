import { Component, computed, inject, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { ChallengeDto } from '../../models/challenge.dto';
import { ACTIVITY_TYPE_ICONS } from '../../constants/activity-type-icons';
import { ActivityType } from '../../enums/activity-type.enum';
import { LanguageService } from '../../../core/services/language.service';
import { RouterLink } from '@angular/router';
import { DurationPipe } from '../../pipes/duration.pipe';
import { DistancePipe } from '../../pipes/distance.pipe';
import { PacePipe } from '../../pipes/pace.pipe';
import { ElevationPipe } from '../../pipes/elevation.pipe';
import { CaloriesPipe } from '../../pipes/calories.pipe';
import { SpeedPipe } from '../../pipes/speed.pipe';

@Component({
  selector: 'app-challenge-card-active',
  imports: [
    NgClass,
    TranslatePipe,
    LocalizedDatePipe,
    TruncatePipe,
    RouterLink,
    DurationPipe,
    DistancePipe,
    PacePipe,
    ElevationPipe,
    CaloriesPipe,
    SpeedPipe,
  ],
  templateUrl: './challenge-card-active.html',
  styles: ``,
})
export class ChallengeCardActive {
  private languageService = inject(LanguageService);

  currentLanguage = this.languageService.getCurrentLanguage();

  challengeData = input.required<ChallengeDto>();
  readonly activityTypeIcons = ACTIVITY_TYPE_ICONS;
  readonly activityTypeEnum = ActivityType;

  calendarIcon = './images/shared/calendar.svg';
  usersIcon = './images/shared/users.svg';
  readonly durationIcon = './images/activity/duration.svg';
  readonly distanceIcon = './images/activity/distance.svg';
  readonly elevationIcon = './images/activity/elevation.svg';
  readonly paceIcon = './images/activity/pace.svg';
  readonly caloriesIcon = './images/activity/calories.svg';
  readonly numberActivitiesIcon = './images/challenge/number-activities.svg';
  readonly positionIcon = './images/challenge/position.svg';

  medalEmoji = computed(() => {
    const user = this.challengeData().currentUser;
    if (!user?.isCompleted || !user.position || user.position > 3) return '';
    const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
    return medals[user.position] ?? '';
  });

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
