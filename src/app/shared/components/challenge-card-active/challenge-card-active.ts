import { Component, computed, inject, input, output, signal } from '@angular/core';
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
import { ChallengeJoin } from '../challenge-join/challenge-join';

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
    ChallengeJoin,
  ],
  templateUrl: './challenge-card-active.html',
  styles: ``,
})
export class ChallengeCardActive {
  private readonly languageService = inject(LanguageService);

  readonly currentLanguage = this.languageService.getCurrentLanguage();
  readonly challengeData = input.required<ChallengeDto>();

  readonly activityTypeIcons = ACTIVITY_TYPE_ICONS;
  readonly activityTypeEnum = ActivityType;
  readonly joined = output<void>();
  readonly showJoinModal = signal(false);

  readonly calendarIcon = './images/shared/calendar.svg';
  readonly durationIcon = './images/activity/duration.svg';
  readonly distanceIcon = './images/activity/distance.svg';
  readonly elevationIcon = './images/activity/elevation.svg';
  readonly paceIcon = './images/activity/pace.svg';
  readonly caloriesIcon = './images/activity/calories.svg';
  readonly numberActivitiesIcon = './images/challenge/number-activities.svg';
  readonly positionIcon = './images/challenge/position.svg';
  readonly participantsHeaderIcon = './images/shared/participants.svg';
  readonly participantsIcon = './images/challenge/participants.svg';

  readonly medalEmoji = computed(() => {
    const user = this.challengeData().currentUser;
    if (!user?.isCompleted || !user.position || user.position > 3) return '';
    const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
    return medals[user.position] ?? '';
  });

  readonly activityIcon = computed(() => {
    const type = this.challengeData().goal.activityType;
    return (
      this.activityTypeIcons.find((icon) => icon.type === type)?.src ||
      this.activityTypeIcons.find((icon) => icon.type === ActivityType.Other)?.src ||
      ''
    );
  });

  readonly progressPercent = computed(() => {
    const progress = this.challengeData().currentUser?.progress ?? 0;
    return Math.min(Math.round(progress), 100);
  });
}
