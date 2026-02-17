import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChallengeConfigService {
  getChallengeConfig(slug: string): { leagueSlug: string; challengeId: number } {
    if (!slug) {
      return { leagueSlug: '', challengeId: 0 };
    }
    const config = environment.challenges[slug];
    if (!config) {
      return { leagueSlug: '', challengeId: 0 };
    }
    return config;
  }
}
