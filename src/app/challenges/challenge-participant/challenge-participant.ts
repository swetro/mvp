import { Component, computed, effect, inject, input } from '@angular/core';
import { ChallengeService } from '../../shared/services/challenge.service';
import { Router, RouterLink } from '@angular/router';
import { CountryFlagPipe } from '../../shared/pipes/country-flag.pipe';
import { CompletedChallengePipe } from '../../shared/pipes/completed-challenge.pipe';
import { ParticipantActivitiesTable } from '../../shared/components/participant-activities-table/participant-activities-table';
import { DistancePipe } from '../../shared/pipes/distance.pipe';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { PacePipe } from '../../shared/pipes/pace.pipe';
import { ElevationPipe } from '../../shared/pipes/elevation.pipe';
import { HeartRatePipe } from '../../shared/pipes/heart-rate.pipe';
import { CaloriesPipe } from '../../shared/pipes/calories.pipe';
import { MetaTagsService, PageMetadata } from '../../shared/services/meta-tags.service';
import { ACTIVITY_TYPE_ICONS } from '../../shared/constants/activity-type-icons';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-challenge-participant',
  imports: [
    RouterLink,
    CountryFlagPipe,
    CompletedChallengePipe,
    ParticipantActivitiesTable,
    DistancePipe,
    DurationPipe,
    PacePipe,
    ElevationPipe,
    HeartRatePipe,
    CaloriesPipe,
    TranslatePipe,
  ],
  templateUrl: './challenge-participant.html',
  styles: ``,
})
export class ChallengeParticipant {
  private challengeService = inject(ChallengeService);
  private metaTagsService = inject(MetaTagsService);
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);
  private router = inject(Router);
  readonly activityTypeIcons = ACTIVITY_TYPE_ICONS;
  challengeId = input.required<number>();
  participantId = input.required<string>();

  currentLanguage = this.languageService.getCurrentLanguage();
  challengeData = this.challengeService.getChallenge(this.challengeId);
  participantData = this.challengeService.getParticipant(this.challengeId, this.participantId);
  pageMetadata = computed<Partial<PageMetadata> | null>(() => {
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
