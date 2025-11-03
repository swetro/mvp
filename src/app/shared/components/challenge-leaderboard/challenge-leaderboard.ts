import { Component, inject, signal } from '@angular/core';
import { ChallengeService } from '../../services/challenge.service';
import { DatasetService } from '../../services/dataset.service';
import { LanguageService } from '../../../core/services/language.service';
import { ChallengeParticipantsTable } from '../challenge-participants-table/challenge-participants-table';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-challenge-leaderboard',
  imports: [ChallengeParticipantsTable, TranslatePipe],
  templateUrl: './challenge-leaderboard.html',
  styles: ``,
})
export class ChallengeLeaderboard {
  private challengeService = inject(ChallengeService);
  private datasetService = inject(DatasetService);
  private languageService = inject(LanguageService);
  private searchTimer?: number;
  selectedFilter = signal<string>('');
  searchTerm = signal<string>('');
  currentPage = signal<number>(1);

  participantsData = this.challengeService.getParticipants(
    this.currentPage,
    this.selectedFilter,
    this.searchTerm,
  );

  participantFiltersData = this.datasetService.getParticipantFilters();
  currentLanguage = this.languageService.getCurrentLanguage();

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
