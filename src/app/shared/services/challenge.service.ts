import { Injectable } from '@angular/core';
import { ChallengeDto } from '../models/challenge.dto';
import { environment } from '../../../environments/environment';
import { ApiResult } from '../models/api-result.dto';
import { ParticipantDto } from '../models/participant.dto';
import { PagedResult } from '../models/paged-result.dto';

@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
  async getChallenge(leagueSlug: string, challengeId: number): Promise<ChallengeDto> {
    const response = await fetch(`${environment.apiUrl}/challenges/${leagueSlug}/${challengeId}`, {
      headers: {
        'Accept-Language': 'en',
      },
    });
    const result = (await response.json()) as ApiResult;
    return result.data as ChallengeDto;
  }

  async getParticipants(
    leagueSlug: string,
    challengeId: number,
    filter: string,
  ): Promise<PagedResult<ParticipantDto>> {
    const params = new URLSearchParams();
    if (filter) params.append('filter', filter);
    const query = params.toString() ? `?${params.toString()}` : '';

    const response = await fetch(
      `${environment.apiUrl}/challenges/${leagueSlug}/${challengeId}/participants${query}`,
    );
    const result = (await response.json()) as ApiResult;
    return result.data as PagedResult<ParticipantDto>;
  }
}
