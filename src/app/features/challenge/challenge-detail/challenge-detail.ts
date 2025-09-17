import { Component, inject, resource } from '@angular/core';
import { ChallengeService } from '../../../shared/services/challenge.service';
import { RouterLink } from '@angular/router';
import { CountryFlagPipe } from '../../../shared/pipes/country-flag.pipe';
import { DistancePipe } from '../../../shared/pipes/distance.pipe';
import { DurationPipe } from '../../../shared/pipes/duration.pipe';
import { PacePipe } from '../../../shared/pipes/pace.pipe';
import { GenderPipe } from '../../../shared/pipes/gender.pipe';

@Component({
  selector: 'app-challenge-detail',
  imports: [RouterLink, CountryFlagPipe, DistancePipe, DurationPipe, PacePipe, GenderPipe],
  templateUrl: './challenge-detail.html',
  styles: ``,
})
export class ChallengeDetail {
  private challengeService = inject(ChallengeService);

  challengeData = resource({
    params: () => ({
      leagueSlug: 'polar-colombia',
      challengeId: 1130,
    }),
    loader: ({ params }) =>
      this.challengeService.getChallenge(params.leagueSlug, params.challengeId),
  });

  participantsData = resource({
    params: () => ({
      leagueSlug: 'polar-colombia',
      challengeId: 1130,
    }),
    loader: ({ params }) =>
      this.challengeService.getParticipants(params.leagueSlug, params.challengeId),
  });
}
