import { Component, effect, inject } from '@angular/core';
import { ChallengeService } from '../../shared/services/challenge.service';
import { ChallengeLeaderboard } from '../../shared/components/challenge-leaderboard/challenge-leaderboard';
import { MetaTagsService } from '../../shared/services/meta-tags.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-challenge-result',
  imports: [ChallengeLeaderboard, TranslatePipe],
  templateUrl: './challenge-result.html',
  styles: ``,
})
export class ChallengeResult {
  private challengeService = inject(ChallengeService);
  private metaTagsService = inject(MetaTagsService);
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);

  challengeData = this.challengeService.getChallenge();
  currentLanguage = this.languageService.getCurrentLanguage();

  constructor() {
    effect(() => {
      const challenge = this.challengeData.value();
      if (challenge) {
        this.metaTagsService.updateMetaTags({
          title: this.translate.instant('challengeResult.title', {
            challengeTitle: challenge.content.title,
          }),
          description: this.translate.instant('challengeResult.description', {
            challengeTitle: challenge.content.title,
          }),
          image: challenge.content.imageUrl,
        });
      }
    });
  }
}
