import { Component, effect, inject, signal } from '@angular/core';
import { ChallengeService } from '../../shared/services/challenge.service';
import { MetaTagsService } from '../../shared/services/meta-tags.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { DatasetService } from '../../shared/services/dataset.service';
import { ChallengeParticipantsTable } from '../../shared/components/challenge-participants-table/challenge-participants-table';

@Component({
  selector: 'app-challenge-leaderboard',
  imports: [TranslatePipe, ChallengeParticipantsTable],
  templateUrl: './challenge-leaderboard.html',
  styles: ``,
})
export class ChallengeLeaderboard {
  private challengeService = inject(ChallengeService);
  private metaTagsService = inject(MetaTagsService);
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);
  private datasetService = inject(DatasetService);
  private searchTimer?: number;
  selectedFilter = signal<string>('');
  searchTerm = signal<string>('');
  currentPage = signal<number>(1);

  currentLanguage = this.languageService.getCurrentLanguage();
  challengeData = this.challengeService.getChallenge();
  participantsData = this.challengeService.getParticipants(
    this.currentPage,
    this.selectedFilter,
    this.searchTerm,
  );
  participantFiltersData = this.datasetService.getParticipantFilters();

  constructor() {
    effect(() => {
      const challenge = this.challengeData.value();
      if (challenge) {
        this.metaTagsService.updateMetaTags({
          title: this.translate.instant('challengeLeaderboard.title', {
            challengeTitle: challenge.content.title,
          }),
          description: this.translate.instant('challengeLeaderboard.description', {
            challengeTitle: challenge.content.title,
          }),
          image: challenge.content.imageUrl,
        });
      }
    });
  }

  participantFilterChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.selectedFilter.set(selectedValue);
    this.currentPage.set(1);
  }

  participantSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    clearTimeout(this.searchTimer);
    this.searchTimer = window.setTimeout(() => {
      this.searchTerm.set(value.length > 2 ? value : '');
    }, 300);
  }

  participantSearchEnter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value.length > 2 ? value : '');
  }

  goNextPage() {
    this.goToPage(this.currentPage() + 1);
  }

  goPrevPage() {
    this.goToPage(this.currentPage() - 1);
  }

  goToPage(page: number) {
    this.currentPage.set(page);
  }
}
