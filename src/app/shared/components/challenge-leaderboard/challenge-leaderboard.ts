import { Component, inject, input, resource, signal } from '@angular/core';
import { ChallengeService } from '../../services/challenge.service';
import { DatasetService } from '../../services/dataset.service';
import { ChallengeParticipantsTable } from '../challenge-participants-table/challenge-participants-table';

@Component({
  selector: 'app-challenge-leaderboard',
  imports: [ChallengeParticipantsTable],
  templateUrl: './challenge-leaderboard.html',
  styles: ``,
})
export class ChallengeLeaderboard {
  private challengeService = inject(ChallengeService);
  private datasetService = inject(DatasetService);
  private searchTimer?: number;
  leagueSlug = input.required<string>();
  challengeId = input.required<number>();
  selectedFilter = signal<string>('');
  searchTerm = signal<string>('');

  participantsData = resource({
    params: () => ({
      leagueSlug: this.leagueSlug(),
      challengeId: this.challengeId(),
      filter: this.selectedFilter(),
      search: this.searchTerm(),
    }),
    loader: ({ params }) =>
      this.challengeService.getParticipants(
        params.leagueSlug,
        params.challengeId,
        params.filter,
        params.search,
      ),
  });

  participantFiltersData = resource({
    loader: () => this.datasetService.getParticipantFilters(),
  });

  onFilterChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.selectedFilter.set(selectedValue);
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    clearTimeout(this.searchTimer);
    this.searchTimer = window.setTimeout(() => {
      this.searchTerm.set(value.length > 2 ? value : '');
    }, 300);
  }

  onSearchEnter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value.length > 2 ? value : '');
  }
}
