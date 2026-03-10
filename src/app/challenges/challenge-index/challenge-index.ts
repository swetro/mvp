import { Component, computed, effect, inject, signal } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { ChallengeService } from '../../shared/services/challenge.service';
import { ChallengeStatus } from '../../shared/enums/challenge-status.enum';
import { LanguageService } from '../../core/services/language.service';
import { MetaTagsService } from '../../shared/services/meta-tags.service';
import { ChallengeList } from '../../shared/components/challenge-list/challenge-list';
import { Spinner } from '../../shared/components/spinner/spinner';
import { NoDataView } from '../../shared/components/no-data-view/no-data-view';
import { ChallengeDto } from '../../shared/models/challenge.dto';

@Component({
  selector: 'app-challenge-index',
  imports: [ChallengeList, TranslatePipe, Spinner, NoDataView],
  templateUrl: './challenge-index.html',
  styles: ``,
})
export class ChallengeIndex {
  private challengeService = inject(ChallengeService);
  private languageService = inject(LanguageService);
  private metaTagsService = inject(MetaTagsService);
  private translate = inject(TranslateService);

  currentPage = signal<number>(1);
  statusFilter = signal<ChallengeStatus | undefined>(ChallengeStatus.Completed);
  currentLanguage = this.languageService.getCurrentLanguage();
  challengesData = this.challengeService.getChallenges(this.currentPage, this.statusFilter);

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

  loadMore(): void {
    this.currentPage.update((p) => p + 1);
  }
}
