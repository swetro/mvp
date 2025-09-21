import { Component, inject, resource } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ChallengeService } from '../../shared/services/challenge.service';
import { RouterLink } from '@angular/router';
import { ChallengeLeaderboard } from '../../shared/components/challenge-leaderboard/challenge-leaderboard';

@Component({
  selector: 'app-challenge-result',
  imports: [RouterLink, ChallengeLeaderboard],
  templateUrl: './challenge-result.html',
  styles: ``,
})
export class ChallengeResult {
  private challengeService = inject(ChallengeService);
  leagueSlug = environment.leagueSlug;
  challengeId = environment.challengeId;

  challengeData = resource({
    params: () => ({
      leagueSlug: this.leagueSlug,
      challengeId: this.challengeId,
    }),
    loader: ({ params }) =>
      this.challengeService.getChallenge(params.leagueSlug, params.challengeId),
  });
}
