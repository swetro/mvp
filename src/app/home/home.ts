import { Component, effect, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ChallengeService } from '../shared/services/challenge.service';
import { MetaTagsService } from '../shared/services/meta-tags.service';
import { LanguageService } from '../core/services/language.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [TranslateModule, RouterLink],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {
  private challengeService = inject(ChallengeService);
  private metaTagsService = inject(MetaTagsService);
  private languageService = inject(LanguageService);

  challengeData = this.challengeService.getChallenge();
  currentLanguage = this.languageService.getCurrentLanguage();

  constructor() {
    effect(() => {
      const challenge = this.challengeData.value();
      if (challenge) {
        this.metaTagsService.updateMetaTags({
          title: challenge.content.title,
          description: challenge.content.description,
          image: challenge.content.imageUrl,
        });
      }
    });
  }
}
