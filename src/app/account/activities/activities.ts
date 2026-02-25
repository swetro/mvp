import { Component, effect, inject, signal } from '@angular/core';
import { ActivityService } from '../../shared/services/activity.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { MetaTagsService } from '../../shared/services/meta-tags.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-activities',
  imports: [JsonPipe],
  templateUrl: './activities.html',
  styles: ``,
})
export class Activities {
  private activityService = inject(ActivityService);
  private metaTagsService = inject(MetaTagsService);
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  year = signal<number>(0);
  weekOfYear = signal<number>(0);

  currentLanguage = this.languageService.getCurrentLanguage();
  weeklyActivitiesData = this.activityService.getWeeklyActivities(this.year, this.weekOfYear);
  pageMetadata = {
    title: this.translate.instant('activities.title'),
    description: this.translate.instant('activities.description'),
  };

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.year.set(params['year'] || 0);
      this.weekOfYear.set(params['weekOfYear'] || 0);
    });

    effect(() => {
      const meta = this.pageMetadata;
      if (meta) this.metaTagsService.updateMetaTags(meta);
    });

    effect(() => {
      const year = this.year();
      const weekOfYear = this.weekOfYear();

      const queryParams: Params = {
        year: year || 0,
        weekOfYear: weekOfYear || 0,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }
}
