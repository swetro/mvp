import { Component, computed, effect, inject, input } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ChallengeService } from '../../shared/services/challenge.service';
import { LanguageService } from '../../core/services/language.service';
import { LocalizedDatePipe } from '../../shared/pipes/localized-date.pipe';
import { ACTIVITY_TYPE_ICONS } from '../../shared/constants/activity-type-icons';
import { ActivityType } from '../../shared/enums/activity-type.enum';
import { Spinner } from '../../shared/components/spinner/spinner';
import { MetaTagsService } from '../../shared/services/meta-tags.service';

@Component({
  selector: 'app-challenge-details',
  imports: [TranslatePipe, LocalizedDatePipe, Spinner],
  templateUrl: './challenge-details.html',
  styles: ``,
})
export class ChallengeDetails {
  private challengeService = inject(ChallengeService);
  private languageService = inject(LanguageService);
  private translate = inject(TranslateService);
  private metaTagsService = inject(MetaTagsService);

  challengeId = input.required<number>();
  currentLanguage = this.languageService.getCurrentLanguage();
  challengeData = this.challengeService.getChallenge(this.challengeId);

  readonly activityTypeIcons = ACTIVITY_TYPE_ICONS;
  readonly activityTypeEnum = ActivityType;
  readonly calendarIcon = './images/shared/calendar.svg';
  readonly clockIcon = './images/shared/clock.svg';
  readonly participantsIcon = './images/shared/participants.svg';

  readonly durationInDays = computed(() => {
    const challenge = this.challengeData.value();
    if (!challenge) return 0;

    const start = new Date(challenge.startTime).getTime();
    const end = new Date(challenge.endTime).getTime();

    const diffInMs = end - start;
    return Math.max(0, Math.round(diffInMs / (1000 * 60 * 60 * 24)));
  });

  readonly pageMetadata = computed(() => {
    const challenge = this.challengeData.value();
    if (!challenge) return null;

    return {
      title: this.translate.instant('challengeDetails.title', {
        challengeTitle: challenge.content.title,
      }),
      description: challenge.content.goalDescription,
    };
  });

  constructor() {
    effect(() => {
      const meta = this.pageMetadata();
      if (meta) this.metaTagsService.updateMetaTags(meta);
    });
  }

  getActivityTypeIcon(type: ActivityType): string {
    return (
      this.activityTypeIcons.find((icon) => icon.type === type)?.src ||
      this.activityTypeIcons.find((icon) => icon.type === ActivityType.Other)?.src ||
      ''
    );
  }
}
