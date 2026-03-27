import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivityService } from '../../shared/services/activity.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivityList } from '../../shared/components/activity-list/activity-list';
import { Spinner } from '../../shared/components/spinner/spinner';
import { NoDataView } from '../../shared/components/no-data-view/no-data-view';

@Component({
  selector: 'app-activities',
  imports: [ActivityList, TranslatePipe, Spinner, NoDataView],
  templateUrl: './activities.html',
  styles: ``,
})
export class Activities {
  private readonly activityService = inject(ActivityService);
  private readonly translate = inject(TranslateService);
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly year = signal<number>(0);
  readonly weekOfYear = signal<number>(0);

  readonly currentLanguage = this.languageService.getCurrentLanguage();
  readonly weeklyActivitiesData = this.activityService.getWeeklyActivities(
    this.year,
    this.weekOfYear,
  );

  readonly weekLabel = computed(() => {
    const y = this.year();
    const w = this.weekOfYear();
    if (!y || !w) return '';

    const start = this.getStartOfISOWeek(y, w);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const fmt = (d: Date) =>
      d.toLocaleDateString(this.currentLanguage, { day: '2-digit', month: 'short' });

    return `${this.translate.instant('activities.week')} ${String(w).padStart(2, '0')} · ${y} (${fmt(start)} – ${fmt(end)})`;
  });

  readonly isCurrentWeek = computed(() => {
    const now = this.getISOWeekYearAndWeek(new Date());
    const currentYear = this.year();
    const currentWeek = this.weekOfYear();
    return currentYear > now.year || (currentYear === now.year && currentWeek >= now.week);
  });

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      const y = Number(params['year'] ?? 0);
      const w = Number(params['weekOfYear'] ?? 0);

      if (!y || !w) {
        const now = this.getISOWeekYearAndWeek(new Date());
        this.year.set(now.year);
        this.weekOfYear.set(now.week);
        return;
      }

      this.year.set(y);
      this.weekOfYear.set(w);
    });

    effect(() => {
      const year = this.year();
      const weekOfYear = this.weekOfYear();

      const queryParams: Params = { year: year || 0, weekOfYear: weekOfYear || 0 };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }

  prevWeek() {
    const y = this.year();
    const w = this.weekOfYear();
    if (!y || !w) return;

    if (w > 1) {
      this.weekOfYear.set(w - 1);
    } else {
      const prevYear = y - 1;
      this.year.set(prevYear);
      this.weekOfYear.set(this.weeksInISOYear(prevYear));
    }
  }

  nextWeek() {
    const y = this.year();
    const w = this.weekOfYear();
    if (!y || !w) return;

    const max = this.weeksInISOYear(y);
    if (w < max) {
      this.weekOfYear.set(w + 1);
    } else {
      this.year.set(y + 1);
      this.weekOfYear.set(1);
    }
  }

  private getISOWeekYearAndWeek(date: Date): { year: number; week: number } {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    const isoYear = d.getUTCFullYear();

    const yearStart = new Date(Date.UTC(isoYear, 0, 1));
    const diffDays = Math.floor((d.getTime() - yearStart.getTime()) / 86400000) + 1;
    const week = Math.ceil(diffDays / 7);

    return { year: isoYear, week };
  }

  private weeksInISOYear(year: number): number {
    const dec28 = new Date(Date.UTC(year, 11, 28));
    return this.getISOWeekYearAndWeek(dec28).week;
  }

  private getStartOfISOWeek(year: number, week: number): Date {
    const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
    const day = simple.getUTCDay() || 7;
    const monday = new Date(simple);
    monday.setUTCDate(simple.getUTCDate() - day + 1);
    return new Date(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate());
  }
}
