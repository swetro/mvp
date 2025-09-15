import { Component, effect, inject, resource } from '@angular/core';
import { ChallengeService } from '../../../shared/services/challenge.service';

@Component({
  selector: 'app-challenge-detail',
  imports: [],
  templateUrl: './challenge-detail.html',
  styles: ``,
})
export class ChallengeDetail {
  private challengeService = inject(ChallengeService);

  challengeData = resource({
    params: () => ({
      leagueSlug: 'rene-valencia-vallejo-league',
      challengeId: 550,
    }),
    loader: ({ params }) =>
      this.challengeService.getChallenge(params.leagueSlug, params.challengeId),
  });

  participantsData = resource({
    params: () => ({
      leagueSlug: 'rene-valencia-vallejo-league',
      challengeId: 550,
    }),
    loader: ({ params }) =>
      this.challengeService.getParticipants(params.leagueSlug, params.challengeId),
  });

  constructor() {}
}
