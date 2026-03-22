import { Component, computed, inject, input } from '@angular/core';
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
import { NgClass } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { RouterLink } from '@angular/router';

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
    NgClass,
    RouterLink,
  ],
  templateUrl: './challenge-card-completed.html',
  styles: ``,
})
export class ChallengeCardCompleted {
  private readonly languageService = inject(LanguageService);

  readonly currentLanguage = this.languageService.getCurrentLanguage();
  readonly challengeData = input.required<ChallengeDto>();

  readonly activityTypeEnum = ActivityType;
  readonly activityTypeIcons = ACTIVITY_TYPE_ICONS;

  readonly calendarIcon = './images/shared/calendar.svg';
  readonly durationIcon = './images/activity/duration.svg';
  readonly distanceIcon = './images/activity/distance.svg';
  readonly elevationIcon = './images/activity/elevation.svg';
  readonly paceIcon = './images/activity/pace.svg';
  readonly caloriesIcon = './images/activity/calories.svg';
  readonly numberActivitiesIcon = './images/challenge/number-activities.svg';
  readonly positionIcon = './images/challenge/position.svg';
  readonly participantsIcon = './images/challenge/participants.svg';

  readonly activityIcon = computed(() => {
    const type = this.challengeData().goal.activityType;
    return (
      this.activityTypeIcons.find((icon) => icon.type === type)?.src ||
      this.activityTypeIcons[0].src
    );
  });

  readonly medalEmoji = computed(() => {
    const user = this.challengeData().currentUser;
    if (!user?.isCompleted || !user.position || user.position > 3) {
      return '';
    }

    const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
    return medals[user.position] ?? '';
  });
}
