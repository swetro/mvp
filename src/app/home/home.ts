import { Component, effect, inject } from '@angular/core';
import { ChallengeService } from '../shared/services/challenge.service';
import { RouterLink } from '@angular/router';
import { MetaTagsService } from '../shared/services/meta-tags.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {
  private challengeService = inject(ChallengeService);
  private metaTagsService = inject(MetaTagsService);

  challengeData = this.challengeService.getChallenge();

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
