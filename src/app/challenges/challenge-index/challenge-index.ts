import { Component, computed, effect, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChallengeService } from '../../shared/services/challenge.service';
import { ChallengeConfigService } from '../../shared/services/challenge-config.service';
import { LanguageService } from '../../core/services/language.service';
import { MetaTagsService } from '../../shared/services/meta-tags.service';
import { ChallengeList } from '../../shared/components/challenge-list/challenge-list';
import { Spinner } from '../../shared/components/spinner/spinner';
import { NoDataView } from '../../shared/components/no-data-view/no-data-view';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-challenge-index',
  imports: [ChallengeList, TranslatePipe, Spinner, NoDataView],
  templateUrl: './challenge-index.html',
  styles: ``,
})
export class ChallengeIndex {
  private challengeService = inject(ChallengeService);
  private challengeConfigService = inject(ChallengeConfigService);
  private languageService = inject(LanguageService);
  private metaTagsService = inject(MetaTagsService);
  private translate = inject(TranslateService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  currentPage = signal<number>(1);
  currentLanguage = this.languageService.getCurrentLanguage();
  challengesData = this.challengeService.getChallenges(this.currentPage);

  pageMetadata = {
    title: this.translate.instant('challenges.title'),
    description: this.translate.instant('challenges.description'),
  };

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      if (params['page']) {
        const page = Number(params['page']);
        if (!isNaN(page) && page > 0) this.currentPage.set(page);
      }
    });

    effect(() => {
      const meta = this.pageMetadata;
      if (meta) this.metaTagsService.updateMetaTags(meta);
    });

    effect(() => {
      const queryParams: Params = { page: this.currentPage() > 1 ? this.currentPage() : null };
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }
}
