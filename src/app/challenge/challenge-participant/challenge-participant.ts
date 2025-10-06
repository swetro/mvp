import { Component, inject, input, resource } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ChallengeService } from '../../shared/services/challenge.service';
import { RouterLink } from '@angular/router';
import { CountryFlagPipe } from '../../shared/pipes/country-flag.pipe';
import { CompletedChallengePipe } from '../../shared/pipes/completed-challenge.pipe';
import { ParticipantActivitiesTable } from '../../shared/components/participant-activities-table/participant-activities-table';
import { DistancePipe } from '../../shared/pipes/distance.pipe';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { PacePipe } from '../../shared/pipes/pace.pipe';
import { ElevationPipe } from '../../shared/pipes/elevation.pipe';
import { HeartRatePipe } from '../../shared/pipes/heart-rate.pipe';
import { CaloriesPipe } from '../../shared/pipes/calories.pipe';

@Component({
  selector: 'app-challenge-participant',
  imports: [
    RouterLink,
    CountryFlagPipe,
    CompletedChallengePipe,
    ParticipantActivitiesTable,
    DistancePipe,
    DurationPipe,
    PacePipe,
    ElevationPipe,
    HeartRatePipe,
    CaloriesPipe,
  ],
  templateUrl: './challenge-participant.html',
  styles: ``,
})
export class ChallengeParticipant {
  private challengeService = inject(ChallengeService);
  leagueSlug = environment.leagueSlug;
  challengeId = environment.challengeId;
  participantId = input.required<string>();

  challengeData = resource({
    params: () => ({
      leagueSlug: this.leagueSlug,
      challengeId: this.challengeId,
    }),
    loader: ({ params }) =>
      this.challengeService.getChallenge(params.leagueSlug, params.challengeId),
  });

  participantData = resource({
    params: () => ({
      leagueSlug: this.leagueSlug,
      challengeId: this.challengeId,
      participantId: this.participantId(),
    }),
    loader: ({ params }) =>
      this.challengeService.getParticipant(
        params.leagueSlug,
        params.challengeId,
        params.participantId,
      ),
  });
}
