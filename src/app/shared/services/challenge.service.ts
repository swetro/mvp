import { Injectable, Signal, signal } from '@angular/core';
import { ChallengeDto } from '../models/challenge.dto';
import { environment } from '../../../environments/environment';
import { ApiResult } from '../models/api-result.dto';
import { ParticipantDto } from '../models/participant.dto';
import { PagedResult } from '../models/paged-result.dto';
import { httpResource, HttpResourceRef } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
  private leagueSlug = signal<string>(environment.leagueSlug);
  private challengeId = signal<number>(environment.challengeId);

  getChallenge(): HttpResourceRef<ChallengeDto | undefined> {
    return httpResource<ChallengeDto>(
      () => ({
        url: `${environment.apiUrl}/challenges/${this.leagueSlug()}/${this.challengeId()}`,
        headers: {
          'Accept-Language': 'en',
        },
      }),
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as ChallengeDto,
      },
    );
  }

  getParticipants(
    pageNumber: Signal<number>,
    filter?: Signal<string>,
    search?: Signal<string>,
  ): HttpResourceRef<PagedResult<ParticipantDto> | undefined> {
    return httpResource<PagedResult<ParticipantDto>>(
      () => {
        const params = new URLSearchParams();
        if (filter?.()) params.append('filter', filter());
        if (search?.()) params.append('search', search());
        if (pageNumber?.()) params.append('page', pageNumber().toString());
        const query = params.toString() ? `?${params.toString()}` : '';

        return {
          url: `${environment.apiUrl}/challenges/${this.leagueSlug()}/${this.challengeId()}/participants${query}`,
          headers: {
            'Accept-Language': 'en',
          },
        };
      },
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as PagedResult<ParticipantDto>,
      },
    );
  }

  getParticipant(participantId: Signal<string>): HttpResourceRef<ParticipantDto | undefined> {
    return httpResource<ParticipantDto>(
      () => ({
        url: `${environment.apiUrl}/challenges/${this.leagueSlug()}/${this.challengeId()}/participants/${participantId()}`,
        headers: {
          'Accept-Language': 'en',
        },
      }),
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as ParticipantDto,
      },
    );
  }
}
