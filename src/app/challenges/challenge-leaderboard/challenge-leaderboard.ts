import { NgClass } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ChallengeService } from '../../shared/services/challenge.service';
import { MetaTagsService } from '../../shared/services/meta-tags.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { DatasetService } from '../../shared/services/dataset.service';
import { ChallengeParticipantsTable } from '../../shared/components/challenge-participants-table/challenge-participants-table';
import { Spinner } from '../../shared/components/spinner/spinner';
import { NoDataView } from '../../shared/components/no-data-view/no-data-view';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivityType } from '../../shared/enums/activity-type.enum';
import { ChallengeStatus } from '../../shared/enums/challenge-status.enum';
import { ACTIVITY_TYPE_ICONS } from '../../shared/constants/activity-type-icons';

@Component({
  selector: 'app-challenge-leaderboard',
  imports: [NgClass, TranslatePipe, ChallengeParticipantsTable, Spinner, NoDataView],
  templateUrl: './challenge-leaderboard.html',
  styles: ``,
})
export class ChallengeLeaderboard {
  private readonly challengeService = inject(ChallengeService);
  private readonly metaTagsService = inject(MetaTagsService);
  private readonly translate = inject(TranslateService);
  private readonly languageService = inject(LanguageService);
  private readonly datasetService = inject(DatasetService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly searchInput$ = new Subject<string>();

  readonly activityTypeIcons = ACTIVITY_TYPE_ICONS;
  readonly challengeId = input.required<number>();
  readonly selectedFilter = signal<string>('overall');
  readonly searchTerm = signal<string>('');
  readonly currentPage = signal<number>(1);

  readonly currentLanguage = this.languageService.getCurrentLanguage();
  readonly challengeData = this.challengeService.getChallenge(this.challengeId);
  readonly participantsData = this.challengeService.getParticipants(
    this.challengeId,
    this.currentPage,
    this.selectedFilter,
    this.searchTerm,
  );
  readonly participantFiltersData = this.datasetService.getParticipantFilters();

  readonly pageMetadata = computed(() => {
    const challenge = this.challengeData.value();
    if (!challenge) return null;

    const ogImage = this.activityTypeIcons.find(
      (icon) => icon.type === challenge.goal.activityType,
    )?.ogImage;

    return {
      title: this.translate.instant('meta.challenges.leaderboard.title', {
        challengeTitle: challenge.content.title,
      }),
      description: this.translate.instant('meta.challenges.leaderboard.description', {
        challengeTitle: challenge.content.title,
      }),
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

  readonly participationStatus = computed(() => {
    const challenge = this.challengeData.value();
    if (!challenge?.currentUser?.isParticipating) {
      return challenge?.status === ChallengeStatus.Completed ? 'ended' : null;
    }
    if (challenge.currentUser.isCompleted) return 'completed';
    if (challenge.status === ChallengeStatus.Completed) return 'notCompleted';
    return 'inProgress';
  });

  readonly paginationText = computed(() => {
    const participants = this.participantsData.value();
    if (!participants?.totalCount) return '';

    const { pageNumber, pageSize, totalCount } = participants;
    const start = (pageNumber - 1) * pageSize + 1;
    const end = Math.min(pageNumber * pageSize, totalCount);

    return this.translate.instant('table.showing', { from: start, to: end, total: totalCount });
  });

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.selectedFilter.set(params['filter'] || 'overall');
      this.searchTerm.set(params['search'] || '');
      if (params['page']) {
        const page = Number(params['page']);
        if (!isNaN(page) && page > 0) this.currentPage.set(page);
      }
    });

    this.searchInput$.pipe(debounceTime(300), takeUntilDestroyed()).subscribe((value) => {
      this.searchTerm.set(value.length > 2 ? value : '');
      this.currentPage.set(1);
    });

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

    effect(() => {
      const filter = this.selectedFilter();
      const search = this.searchTerm();
      const page = this.currentPage();

      const queryParams: Params = {
        filter: filter || null,
        search: search || null,
        page: page > 1 ? page : null,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }

  participantFilterChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedFilter.set(selectElement.value);
    this.currentPage.set(1);
  }

  participantSearchInput(event: Event) {
    this.searchInput$.next((event.target as HTMLInputElement).value);
  }

  participantSearchEnter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchInput$.next(value);
  }

  goNextPage(event: Event) {
    event.preventDefault();
    this.goToPage(this.currentPage() + 1);
  }

  goPrevPage(event: Event) {
    event.preventDefault();
    if (this.currentPage() > 1) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  goToPage(page: number, event?: Event) {
    if (event) event.preventDefault();
    if (page > 0) {
      this.currentPage.set(page);
    }
  }
}
