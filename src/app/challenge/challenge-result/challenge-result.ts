import { Component, inject } from '@angular/core';
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

  challengeData = this.challengeService.getChallenge();
}
