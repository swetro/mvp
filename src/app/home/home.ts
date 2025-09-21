import { Component, inject, resource } from '@angular/core';
import { ChallengeService } from '../shared/services/challenge.service';
import { environment } from '../../environments/environment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {
  private challengeService = inject(ChallengeService);

  challengeData = resource({
    params: () => ({
      leagueSlug: environment.leagueSlug,
      challengeId: environment.challengeId,
    }),
    loader: ({ params }) =>
      this.challengeService.getChallenge(params.leagueSlug, params.challengeId),
  });
}
