import { Injectable, Signal } from '@angular/core';
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
  private getChallengeConfig(slug: string): { leagueSlug: string; challengeId: number } {
    if (!slug) {
      return { leagueSlug: '', challengeId: 0 };
    }
    const config = environment.challenges[slug];
    if (!config) {
      return { leagueSlug: '', challengeId: 0 };
    }
    return config;
  }

  getChallenge(slug: Signal<string>): HttpResourceRef<ChallengeDto | undefined> {
    return httpResource<ChallengeDto>(
      () => {
        const { leagueSlug, challengeId } = this.getChallengeConfig(slug());
        return {
          url: `${environment.apiUrl}/challenges/${leagueSlug}/${challengeId}`,
        };
      },
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as ChallengeDto,
      },
    );
  }

  getParticipants(
    slug: Signal<string>,
    pageNumber: Signal<number>,
    filter?: Signal<string>,
    search?: Signal<string>,
  ): HttpResourceRef<PagedResult<ParticipantDto> | undefined> {
    return httpResource<PagedResult<ParticipantDto>>(
      () => {
        const { leagueSlug, challengeId } = this.getChallengeConfig(slug());
        const params = new URLSearchParams();
        if (filter?.()) params.append('filter', filter());
        if (search?.()) params.append('search', search());
        if (pageNumber?.()) params.append('page', pageNumber().toString());
        const query = params.toString() ? `?${params.toString()}` : '';

        return {
          url: `${environment.apiUrl}/challenges/${leagueSlug}/${challengeId}/participants${query}`,
        };
      },
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as PagedResult<ParticipantDto>,
      },
    );
  }

  getParticipant(
    slug: Signal<string>,
    participantId: Signal<string>,
  ): HttpResourceRef<ParticipantDto | undefined> {
    return httpResource<ParticipantDto>(
      () => {
        const { leagueSlug, challengeId } = this.getChallengeConfig(slug());
        return {
          url: `${environment.apiUrl}/challenges/${leagueSlug}/${challengeId}/participants/${participantId()}`,
        };
      },
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as ParticipantDto,
      },
    );
  }
}
