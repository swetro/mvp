import { Component, inject, input } from '@angular/core';
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
  participantId = input.required<string>();

  challengeData = this.challengeService.getChallenge();
  participantData = this.challengeService.getParticipant(this.participantId);
}
