import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  readonly calendarIcon = './images/shared/calendar.svg';
  readonly clockIcon = './images/shared/clock.svg';
  readonly participantsIcon = './images/shared/participants.svg';

  readonly rulesExpanded = signal(false);
  readonly showJoinModal = signal(false);
  readonly isCtaFixed = signal(true);
  readonly RULES_PREVIEW_COUNT = 2;

  private readonly ctaSentinel = viewChild<ElementRef>('ctaSentinel');
  private readonly platformId = inject(PLATFORM_ID);

  readonly participationStatus = computed(() => {
    const challenge = this.challengeData.value();
    if (!challenge?.currentUser?.isParticipating) return null;
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
    return {
      title: this.translate.instant('meta.challenges.details.title', {
        challengeTitle: challenge.content.title,
      }),
      description: challenge.content.goalDescription,
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

    effect((onCleanup) => {
      if (!isPlatformBrowser(this.platformId)) return;
      const el = this.ctaSentinel()?.nativeElement;
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => this.isCtaFixed.set(!entry.isIntersecting),
        { threshold: 0 },
      );
      observer.observe(el);
      onCleanup(() => observer.disconnect());
    });
  }
}
