import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { StatsService } from '../../shared/services/stats.service';
import { ActivityType } from '../../shared/enums/activity-type.enum';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { DistancePipe } from '../../shared/pipes/distance.pipe';
import { ElevationPipe } from '../../shared/pipes/elevation.pipe';
import { CaloriesPipe } from '../../shared/pipes/calories.pipe';
import { Spinner } from '../../shared/components/spinner/spinner';
import { DatasetService } from '../../shared/services/dataset.service';

@Component({
  selector: 'app-stats',
  imports: [TranslatePipe, DurationPipe, DistancePipe, ElevationPipe, CaloriesPipe, Spinner],
  templateUrl: './stats.html',
  styles: ``,
})
export class Stats {
  private readonly statsService = inject(StatsService);
  private readonly datasetService = inject(DatasetService);
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly yearFilter = signal<number>(new Date().getFullYear());
  readonly monthFilter = signal<number | undefined>(new Date().getMonth() + 1);
  readonly activityTypeFilter = signal<ActivityType | undefined>(undefined);

  readonly activityVolumeStatsData = this.statsService.GetActivityVolumeStats(
    this.yearFilter,
    this.monthFilter,
    undefined,
    this.activityTypeFilter,
  );
  readonly statsFiltersData = this.datasetService.getStatsFilters();
  private readonly currentYear = new Date().getFullYear();
  private readonly currentMonth = new Date().getMonth() + 1;

  readonly availableMonths = computed(() => {
    const months = this.statsFiltersData.value()?.months ?? [];
    if (this.yearFilter() === this.currentYear) {
      return months.filter((m) => Number(m.value) <= this.currentMonth);
    }
    return months;
  });

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      const y = Number(params['year'] ?? undefined);
      if (y) this.yearFilter.set(y);

      if (params['month']) this.monthFilter.set(Number(params['month']));

      const type = params['type'];
      this.activityTypeFilter.set(
        type && Object.values(ActivityType).includes(type as ActivityType)
          ? (type as ActivityType)
          : undefined,
      );
    });

    effect(() => {
      // Reset month if it's no longer available for the selected year
      const month = this.monthFilter();
      if (month && this.yearFilter() === this.currentYear && month > this.currentMonth) {
        this.monthFilter.set(undefined);
      }

      const queryParams: Params = {
        year: this.yearFilter(),
        month: this.monthFilter() ?? null,
        type: this.activityTypeFilter() ?? null,
      };
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }

  onYearChange(event: Event): void {
    this.yearFilter.set(Number((event.target as HTMLSelectElement).value));
  }

  onMonthChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.monthFilter.set(val ? Number(val) : undefined);
  }

  onActivityTypeChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.activityTypeFilter.set(val ? (val as ActivityType) : undefined);
  }
}
