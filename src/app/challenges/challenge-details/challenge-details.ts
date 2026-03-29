import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ChallengeService } from '../../shared/services/challenge.service';
import { LanguageService } from '../../core/services/language.service';
import { LocalizedDatePipe } from '../../shared/pipes/localized-date.pipe';
import { ACTIVITY_TYPE_ICONS } from '../../shared/constants/activity-type-icons';
import { ActivityType } from '../../shared/enums/activity-type.enum';
import { ChallengeStatus } from '../../shared/enums/challenge-status.enum';
import { Spinner } from '../../shared/components/spinner/spinner';
import { ChallengeJoin } from '../../shared/components/challenge-join/challenge-join';
import { MetaTagsService } from '../../shared/services/meta-tags.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-challenge-details',
  imports: [TranslatePipe, LocalizedDatePipe, Spinner, RouterLink, NgClass, ChallengeJoin],
  templateUrl: './challenge-details.html',
  styles: ``,
})
export class ChallengeDetails {
  private readonly challengeService = inject(ChallengeService);
  private readonly languageService = inject(LanguageService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly metaTagsService = inject(MetaTagsService);

  readonly challengeId = input.required<number>();
  readonly currentLanguage = this.languageService.getCurrentLanguage();
  readonly challengeData = this.challengeService.getChallenge(this.challengeId);

  readonly activityTypeIcons = ACTIVITY_TYPE_ICONS;
  readonly activityTypeEnum = ActivityType;
  readonly challengeStatusEnum = ChallengeStatus;
  readonly calendarIcon = './images/shared/calendar.svg';
  readonly clockIcon = './images/shared/clock.svg';
  readonly participantsIcon = './images/shared/participants.svg';

  readonly rulesExpanded = signal(false);
  readonly showJoinModal = signal(false);
  readonly RULES_PREVIEW_COUNT = 2;

  readonly participationStatus = computed(() => {
    const challenge = this.challengeData.value();
    if (!challenge?.currentUser?.isParticipating) {
      return challenge?.status === ChallengeStatus.Completed ? 'ended' : null;
    }
    if (challenge.currentUser.isCompleted) return 'completed';
    if (challenge.status === ChallengeStatus.Completed) return 'notCompleted';
    return 'inProgress';
  });

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
    const ogImage = this.activityTypeIcons.find(
      (icon) => icon.type === challenge.goal.activityType,
    )?.ogImage;
    return {
      title: this.translate.instant('meta.challenges.details.title', {
        challengeTitle: challenge.content.title,
      }),
      description: challenge.content.goalDescription,
      ...(ogImage && { image: ogImage }),
    };
  });

  readonly activityIcon = computed(() => {
    const type = this.challengeData.value()?.goal.activityType;
    if (!type) return '';
    return (
      this.activityTypeIcons.find((icon) => icon.type === type)?.src ||
      this.activityTypeIcons.find((icon) => icon.type === ActivityType.Other)?.src ||
      ''
    );
  });

  onJoinClick(): void {
    if (this.authService.isAuthenticated()) {
      this.showJoinModal.set(true);
    } else {
      this.router.navigate(['/', this.currentLanguage, 'auth', 'sign-in'], {
        queryParams: { returnUrl: this.router.url },
      });
    }
  }

  constructor() {
    effect(() => {
      const error = this.challengeData.error();
      if (error instanceof HttpErrorResponse && error.status === 404) {
        this.router.navigate(['/', this.currentLanguage, '404'], { replaceUrl: true });
      }
    });

    effect(() => {
      const meta = this.pageMetadata();
      if (meta) this.metaTagsService.updateMetaTags(meta);
    });
  }
}
