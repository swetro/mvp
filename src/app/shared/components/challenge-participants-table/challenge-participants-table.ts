import { Component, input } from '@angular/core';
import { ParticipantDto } from '../../models/participant.dto';
import { CompletedChallengePipe } from '../../pipes/completed-challenge.pipe';
import { CountryFlagPipe } from '../../pipes/country-flag.pipe';
import { DistancePipe } from '../../pipes/distance.pipe';
import { DurationPipe } from '../../pipes/duration.pipe';
import { GenderPipe } from '../../pipes/gender.pipe';
import { PacePipe } from '../../pipes/pace.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-challenge-participants-table',
  imports: [
    CountryFlagPipe,
    DistancePipe,
    DurationPipe,
    PacePipe,
    GenderPipe,
    CompletedChallengePipe,
    RouterLink,
  ],
  templateUrl: './challenge-participants-table.html',
  styles: ``,
})
export class ChallengeParticipantsTable {
  participantsData = input.required<ParticipantDto[]>();
  route = input.required<string>();
}
