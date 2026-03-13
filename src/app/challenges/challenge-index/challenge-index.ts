import { Component, computed, effect, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChallengeService } from '../../shared/services/challenge.service';
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
  private challengeService = inject(ChallengeService);
  private metaTagsService = inject(MetaTagsService);
  private translate = inject(TranslateService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly challengeStatusEnum = ChallengeStatus;
  readonly activityTypeIcons = ACTIVITY_TYPE_ICONS;
  readonly activityTypes: ActivityType[] = [
    ActivityType.Running,
    ActivityType.Cycling,
    ActivityType.Walking,
    ActivityType.Multisport,
  ];

  statusTab = signal<ChallengeStatus>(ChallengeStatus.Active);
  activityTypeFilter = signal<ActivityType | null>(null);
  currentPage = signal<number>(1);
  challengesData = this.challengeService.getChallenges(
    this.currentPage,
    this.statusTab,
    this.activityTypeFilter,
  );
  accumulatedChallenges = signal<ChallengeDto[]>([]);

  hasMore = computed(() => {
    const d = this.challengesData.value();
    return !!d && d.pageNumber < d.totalPages;
  });

  isLoadingMore = computed(() => this.challengesData.isLoading() && this.currentPage() > 1);

  pageMetadata = {
    title: this.translate.instant('challengeIndex.title'),
    description: this.translate.instant('challengeIndex.description'),
  };

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      const status = params['status'];
      this.statusTab.set(
        status && Object.values(ChallengeStatus).includes(status as ChallengeStatus)
          ? (status as ChallengeStatus)
          : ChallengeStatus.Active,
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
        this.accumulatedChallenges.update((prev) => [...prev, ...result.items]);
      }
    });
  }

  setStatusTab(status: ChallengeStatus): void {
    if (this.statusTab() === status) return;
    this.accumulatedChallenges.set([]);
    this.currentPage.set(1);
    this.statusTab.set(status);
  }

  setActivityType(type: ActivityType | null): void {
    if (this.activityTypeFilter() === type) return;
    this.accumulatedChallenges.set([]);
    this.currentPage.set(1);
    this.activityTypeFilter.set(type);
  }

  loadMore(): void {
    this.currentPage.update((p) => p + 1);
  }

  getActivityTypeIcon(type: ActivityType, white = false): string {
    const icon =
      this.activityTypeIcons.find((i) => i.type === type) ||
      this.activityTypeIcons.find((i) => i.type === ActivityType.Other);
    return (white ? icon?.srcWhite : undefined) ?? icon?.src ?? '';
  }
}
