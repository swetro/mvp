import { Component, effect, inject, input, signal, OnDestroy, computed } from '@angular/core';
import { ChallengeService } from '../../shared/services/challenge.service';
import { MetaTagsService } from '../../shared/services/meta-tags.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { DatasetService } from '../../shared/services/dataset.service';
import { ChallengeParticipantsTable } from '../../shared/components/challenge-participants-table/challenge-participants-table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-challenge-leaderboard',
  imports: [TranslatePipe, ChallengeParticipantsTable],
  templateUrl: './challenge-leaderboard.html',
  styles: ``,
})
export class ChallengeLeaderboard implements OnDestroy {
  private challengeService = inject(ChallengeService);
  private metaTagsService = inject(MetaTagsService);
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);
  private datasetService = inject(DatasetService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private searchTimer?: number;

  slug = input.required<string>();
  selectedFilter = signal<string>('overall');
  searchTerm = signal<string>('');
  currentPage = signal<number>(1);

  currentLanguage = this.languageService.getCurrentLanguage();
  challengeData = this.challengeService.getChallenge(this.slug);
  participantsData = this.challengeService.getParticipants(
    this.slug,
    this.currentPage,
    this.selectedFilter,
    this.searchTerm,
  );
  participantFiltersData = this.datasetService.getParticipantFilters();
  pageMetadata = computed(() => {
    const challenge = this.challengeData.value();
    if (!challenge) return null;

    return {
      title: this.translate.instant('challengeLeaderboard.title', {
        title: challenge.content.title,
      }),
      description: this.translate.instant('challengeLeaderboard.description', {
        challengeTitle: challenge.content.title,
      }),
      image: challenge.content.imageUrl,
    };
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

  ngOnDestroy() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
  }

  participantFilterChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedFilter.set(selectElement.value);
    this.currentPage.set(1);
  }

  participantSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    clearTimeout(this.searchTimer);
    this.searchTimer = window.setTimeout(() => {
      this.searchTerm.set(value.length > 2 ? value : '');
      this.currentPage.set(1);
    }, 300);
  }

  participantSearchEnter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    clearTimeout(this.searchTimer);
    this.searchTerm.set(value.length > 2 ? value : '');
    this.currentPage.set(1);
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

  getPaginationText(pageNumber: number, pageSize: number, totalCount: number) {
    if (!totalCount) return '';

    const start = (pageNumber - 1) * pageSize + 1;
    const end = Math.min(pageNumber * pageSize, totalCount);

    return this.translate.instant('table.showing', {
      from: start,
      to: end,
      total: totalCount,
    });
  }
}
