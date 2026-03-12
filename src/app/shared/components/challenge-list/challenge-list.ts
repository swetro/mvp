import { Component, input } from '@angular/core';
import { ChallengeDto } from '../../models/challenge.dto';
import { ChallengeStatus } from '../../enums/challenge-status.enum';
import { ChallengeCardActive } from '../challenge-card-active/challenge-card-active';
import { ChallengeCardCompleted } from '../challenge-card-completed/challenge-card-completed';

@Component({
  selector: 'app-challenge-list',
  imports: [ChallengeCardActive, ChallengeCardCompleted],
  templateUrl: './challenge-list.html',
  styles: ``,
})
export class ChallengeList {
  challengesData = input.required<ChallengeDto[]>();
  readonly challengeStatusEnum = ChallengeStatus;
}
