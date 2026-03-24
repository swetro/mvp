import { Component, computed, effect, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChallengeService } from '../../shared/services/challenge.service';
import { AuthService } from '../../core/services/auth.service';
import { ChallengeStatus } from '../../shared/enums/challenge-status.enum';
import { ActivityType } from '../../shared/enums/activity-type.enum';
import { MetaTagsService } from '../../shared/services/meta-tags.service';
import { ChallengeList } from '../../shared/components/challenge-list/challenge-list';
import { Spinner } from '../../shared/components/spinner/spinner';
import { NoDataView } from '../../shared/components/no-data-view/no-data-view';
import { ChallengeDto } from '../../shared/models/challenge.dto';
import { ACTIVITY_TYPE_ICONS } from '../../shared/constants/activity-type-icons';

@Component({
  selector: 'app-challenge-index',
  imports: [NgClass, ChallengeList, TranslatePipe, Spinner, NoDataView],
  templateUrl: './challenge-index.html',
  styles: ``,
})
export class ChallengeIndex {
  private readonly challengeService = inject(ChallengeService);
  private readonly authService = inject(AuthService);
  private readonly metaTagsService = inject(MetaTagsService);

  readonly isAuthenticated = this.authService.isAuthenticated;
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly challengeStatusEnum = ChallengeStatus;
  readonly activityTypeIcons = ACTIVITY_TYPE_ICONS;
  readonly activityTypes: ActivityType[] = [
    ActivityType.Running,
    ActivityType.Cycling,
    ActivityType.Walking,
    ActivityType.Multisport,
  ];

  readonly statusTab = signal<ChallengeStatus>(ChallengeStatus.Active);
  readonly activityTypeFilter = signal<ActivityType | null>(null);
  readonly currentPage = signal<number>(1);
  readonly challengesData = this.challengeService.getChallenges(
    this.currentPage,
    this.statusTab,
    this.activityTypeFilter,
  );
  readonly accumulatedChallenges = signal<ChallengeDto[]>([]);

  readonly hasMore = computed(() => {
    const d = this.challengesData.value();
    return !!d && d.pageNumber < d.totalPages;
  });

  readonly isLoadingMore = computed(
    () => this.challengesData.isLoading() && this.currentPage() > 1,
  );

  readonly pageMetadata = {
    title: this.translate.instant('challengeIndex.title'),
    description: this.translate.instant('challengeIndex.description'),
  };

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      const status = params['status'];
      const resolvedStatus =
        status && Object.values(ChallengeStatus).includes(status as ChallengeStatus)
          ? (status as ChallengeStatus)
          : ChallengeStatus.Active;

      this.statusTab.set(
        !this.isAuthenticated() && resolvedStatus === ChallengeStatus.Completed
          ? ChallengeStatus.Active
          : resolvedStatus,
      );

      const type = params['type'];
      this.activityTypeFilter.set(
        type && Object.values(ActivityType).includes(type as ActivityType)
          ? (type as ActivityType)
          : null,
      );

      const page = Number(params['page']);
      this.currentPage.set(!isNaN(page) && page > 0 ? page : 1);
    });

    effect(() => {
      const queryParams: Params = {
        status: this.statusTab() !== ChallengeStatus.Active ? this.statusTab() : null,
        type: this.activityTypeFilter() ?? null,
        page: this.currentPage() > 1 ? this.currentPage() : null,
      };
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });

    effect(() => {
      const meta = this.pageMetadata;
      if (meta) this.metaTagsService.updateMetaTags(meta);
    });

    effect(() => {
      const result = this.challengesData.value();
      if (!result) return;
      if (result.pageNumber === 1) {
        this.accumulatedChallenges.set(result.items);
      } else {
        this.accumulatedChallenges.update((prev) => {
          const newItems = result.items.filter((item) => !prev.some((p) => p.id === item.id));
          return [...prev, ...newItems];
        });
      }
    });
  }

  setStatusTab(status: ChallengeStatus): void {
    if (this.statusTab() === status) return;
    this.resetPagination();
    this.statusTab.set(status);
  }

  setActivityType(type: ActivityType | null): void {
    if (this.activityTypeFilter() === type) return;
    this.resetPagination();
    this.activityTypeFilter.set(type);
  }

  loadMore(): void {
    if (!this.isLoadingMore()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  getActivityTypeIcon(type: ActivityType, white = false): string {
    const icon = this.activityTypeIcons.find((i) => i.type === type);
    if (!icon) return this.activityTypeIcons[0].src;
    return white && icon.srcWhite ? icon.srcWhite : icon.src;
  }

  onChallengeJoined(): void {
    this.accumulatedChallenges.set([]);
    if (this.currentPage() === 1) {
      this.challengesData.reload();
    } else {
      this.currentPage.set(1);
    }
  }

  private resetPagination(): void {
    this.accumulatedChallenges.set([]);
    this.currentPage.set(1);
  }
}
