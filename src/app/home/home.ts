import { Component, effect, inject, resource } from '@angular/core';
import { ChallengeService } from '../shared/services/challenge.service';
import { environment } from '../../environments/environment';
import { RouterLink } from '@angular/router';
import { MetaTagsService } from '../shared/services/meta-tags.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {
  private challengeService = inject(ChallengeService);
  private metaTagsService = inject(MetaTagsService);

  challengeData = resource({
    params: () => ({
      leagueSlug: environment.leagueSlug,
      challengeId: environment.challengeId,
    }),
    loader: ({ params }) =>
      this.challengeService.getChallenge(params.leagueSlug, params.challengeId),
  });

  constructor() {
    effect(() => {
      const challenge = this.challengeData.value();
      if (challenge) {
        this.metaTagsService.updateMetaTags({
          title: challenge.content.title,
          description: challenge.content.description,
          url: `https://swetro.com/challenges/${challenge.id}`,
        });
      }
    });
  }
}
