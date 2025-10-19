import { Component, effect, inject } from '@angular/core';
import { ChallengeService } from '../../shared/services/challenge.service';
import { RouterLink } from '@angular/router';
import { ChallengeLeaderboard } from '../../shared/components/challenge-leaderboard/challenge-leaderboard';
import { MetaTagsService } from '../../shared/services/meta-tags.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-challenge-result',
  imports: [RouterLink, ChallengeLeaderboard, TranslatePipe],
  templateUrl: './challenge-result.html',
  styles: ``,
})
export class ChallengeResult {
  private challengeService = inject(ChallengeService);
  private metaTagsService = inject(MetaTagsService);
  private translate = inject(TranslateService);

  challengeData = this.challengeService.getChallenge();

  constructor() {
    effect(() => {
      const challenge = this.challengeData.value();
      if (challenge) {
        this.metaTagsService.updateMetaTags({
          title: `${this.translate.instant('challengeResult.title')}: ${challenge.content.title}`,
          description: challenge.content.description,
          image: challenge.content.imageUrl,
        });
      }
    });
  }
}
