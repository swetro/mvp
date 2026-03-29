import { NgClass } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { ChallengeService } from '../../shared/services/challenge.service';
import { Router, RouterLink } from '@angular/router';
import { CountryFlagPipe } from '../../shared/pipes/country-flag.pipe';
import { ParticipantActivitiesTable } from '../../shared/components/participant-activities-table/participant-activities-table';
import { DistancePipe } from '../../shared/pipes/distance.pipe';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { PacePipe } from '../../shared/pipes/pace.pipe';
import { SpeedPipe } from '../../shared/pipes/speed.pipe';
import { ElevationPipe } from '../../shared/pipes/elevation.pipe';
import { HeartRatePipe } from '../../shared/pipes/heart-rate.pipe';
import { CaloriesPipe } from '../../shared/pipes/calories.pipe';
import { MetaTagsService, PageMetadata } from '../../shared/services/meta-tags.service';
import { ActivityType } from '../../shared/enums/activity-type.enum';
import { ACTIVITY_TYPE_ICONS } from '../../shared/constants/activity-type-icons';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Spinner } from '../../shared/components/spinner/spinner';
import { NoDataView } from '../../shared/components/no-data-view/no-data-view';
import { NameInitialsPipe } from '../../shared/pipes/name-initials.pipe';
import { LocalizedDatePipe } from '../../shared/pipes/localized-date.pipe';

@Component({
  selector: 'app-challenge-participant',
  imports: [
    NgClass,
    RouterLink,
    CountryFlagPipe,
    ParticipantActivitiesTable,
    DistancePipe,
    DurationPipe,
    PacePipe,
    SpeedPipe,
    ElevationPipe,
    HeartRatePipe,
    CaloriesPipe,
    TranslatePipe,
    Spinner,
    NoDataView,
    NameInitialsPipe,
    LocalizedDatePipe,
  ],
  templateUrl: './challenge-participant.html',
  styles: ``,
})
export class ChallengeParticipant {
  private readonly challengeService = inject(ChallengeService);
  private readonly metaTagsService = inject(MetaTagsService);
  private readonly translate = inject(TranslateService);
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);

  readonly activityTypeEnum = ActivityType;
  readonly activityTypeIcons = ACTIVITY_TYPE_ICONS;
  readonly backIcon = './images/shared/back.svg';
  readonly challengeId = input.required<number>();
  readonly participantId = input.required<string>();

  readonly currentLanguage = this.languageService.getCurrentLanguage();
  readonly challengeData = this.challengeService.getChallenge(this.challengeId);
  readonly participantData = this.challengeService.getParticipant(
    this.challengeId,
    this.participantId,
  );

  readonly progressPercent = computed(() => {
    const progress = this.participantData.value()?.progress ?? 0;
    return Math.min(Math.round(progress), 100);
  });

  readonly medalEmoji = computed(() => {
    const participant = this.participantData.value();
    if (!participant?.isCompleted || !participant.position || participant.position > 3) return '';
    const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
    return medals[participant.position] ?? '';
  });

  readonly medalEmojiByAgeCategory = computed(() => {
    const participant = this.participantData.value();
    if (
      !participant?.isCompleted ||
      !participant.positionByAgeCategory ||
      participant.positionByAgeCategory > 3
    )
      return '';
    const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
    return medals[participant.positionByAgeCategory] ?? '';
  });

  readonly pageMetadata = computed<Partial<PageMetadata> | null>(() => {
    const challenge = this.challengeData.value();
    const participant = this.participantData.value();

    if (!challenge || !participant) return null;

    const participantName = `${participant.firstName} ${participant.lastName}`;
    const ogImage = this.activityTypeIcons.find(
      (icon) => icon.type === challenge.goal.activityType,
    )?.ogImage;

    return {
      title: this.translate.instant('meta.challenges.participant.title', {
        participantName,
        challengeTitle: challenge.content.title,
      }),
      description: this.translate.instant('meta.challenges.participant.description', {
        participantName,
        challengeTitle: challenge.content.title,
      }),
      ...(ogImage && { image: ogImage }),
    };
  });

  constructor() {
    effect(() => {
      const error = this.challengeData.error() ?? this.participantData.error();
      if (error instanceof HttpErrorResponse && error.status === 404) {
        this.router.navigate(['/', this.currentLanguage, '404'], { replaceUrl: true });
      }
    });

    effect(() => {
      const metadata = this.pageMetadata();
      if (metadata) {
        this.metaTagsService.updateMetaTags(metadata);
      }
    });
  }
}
