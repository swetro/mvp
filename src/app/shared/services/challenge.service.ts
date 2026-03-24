import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, Signal } from '@angular/core';
import { ChallengeDto } from '../models/challenge.dto';
import { ChallengeStatus } from '../enums/challenge-status.enum';
import { ActivityType } from '../enums/activity-type.enum';
import { environment } from '../../../environments/environment';
import { ApiResult } from '../models/api-result.dto';
import { ParticipantDto } from '../models/participant.dto';
import { PagedResult } from '../models/paged-result.dto';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { ChallengeConfigService } from './challenge-config.service';
import { JoinChallengeDto } from '../models/challenge/join-challenge.dto';
import { Observable } from 'rxjs';
import { JoinRequirementDto } from '../models/challenge/join-requirement.dto';

@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
  private readonly challengeConfigService = inject(ChallengeConfigService);
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  getChallenges(
    pageNumber: Signal<number>,
    status?: Signal<ChallengeStatus | undefined>,
    activityType?: Signal<ActivityType | null>,
  ): HttpResourceRef<PagedResult<ChallengeDto> | undefined> {
    return httpResource<PagedResult<ChallengeDto>>(
      () => {
        const leagueSlug = this.challengeConfigService.getDefaultLeagueSlug();
        const params = new URLSearchParams();
        if (pageNumber?.()) params.append('page', pageNumber().toString());
        if (status?.()) params.append('status', status()!);
        if (activityType?.() != null) params.append('activityType', activityType()!);
        const query = params.toString() ? `?${params.toString()}` : '';

        return { url: `${environment.apiUrl}/challenges/${leagueSlug}${query}` };
      },
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as PagedResult<ChallengeDto>,
      },
    );
  }

  getChallenge(challengeId: Signal<number>): HttpResourceRef<ChallengeDto | undefined> {
    return httpResource<ChallengeDto>(
      () => {
        const leagueSlug = this.challengeConfigService.getDefaultLeagueSlug();
        return {
          url: `${environment.apiUrl}/challenges/${leagueSlug}/${challengeId()}`,
        };
      },
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as ChallengeDto,
      },
    );
  }

  getParticipants(
    challengeId: Signal<number>,
    pageNumber: Signal<number>,
    filter?: Signal<string>,
    search?: Signal<string>,
  ): HttpResourceRef<PagedResult<ParticipantDto> | undefined> {
    return httpResource<PagedResult<ParticipantDto>>(
      () => {
        const leagueSlug = this.challengeConfigService.getDefaultLeagueSlug();
        const params = new URLSearchParams();
        if (filter?.()) params.append('filter', filter());
        if (search?.()) params.append('search', search());
        if (pageNumber?.()) params.append('page', pageNumber().toString());
        const query = params.toString() ? `?${params.toString()}` : '';

        return {
          url: `${environment.apiUrl}/challenges/${leagueSlug}/${challengeId()}/participants${query}`,
        };
      },
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as PagedResult<ParticipantDto>,
      },
    );
  }

  getParticipant(
    challengeId: Signal<number>,
    participantId: Signal<string>,
  ): HttpResourceRef<ParticipantDto | undefined> {
    return httpResource<ParticipantDto>(
      () => {
        const leagueSlug = this.challengeConfigService.getDefaultLeagueSlug();
        return {
          url: `${environment.apiUrl}/challenges/${leagueSlug}/${challengeId()}/participants/${participantId()}`,
        };
      },
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as ParticipantDto,
      },
    );
  }

  getJoinRequirements(
    challengeId: Signal<number>,
  ): HttpResourceRef<JoinRequirementDto[] | undefined> {
    return httpResource<JoinRequirementDto[]>(
      () => {
        const leagueSlug = this.challengeConfigService.getDefaultLeagueSlug();
        const utcOffsetSeconds = isPlatformBrowser(this.platformId)
          ? -new Date().getTimezoneOffset() * 60
          : 0;
        return {
          url: `${environment.apiUrl}/challenges/${leagueSlug}/${challengeId()}/join-requirements`,
          headers: { 'X-Local-Timestamp': utcOffsetSeconds.toString() },
        };
      },
      {
        parse: (raw: unknown) => (raw as ApiResult)?.data as JoinRequirementDto[],
      },
    );
  }

  joinChallenge(data: JoinChallengeDto): Observable<ApiResult> {
    const leagueSlug = this.challengeConfigService.getDefaultLeagueSlug();
    const utcOffsetSeconds = isPlatformBrowser(this.platformId)
      ? -new Date().getTimezoneOffset() * 60
      : 0;
    return this.http.post<ApiResult>(
      `${environment.apiUrl}/challenges/${leagueSlug}/${data.challengeId}/participants`,
      data,
      { headers: { 'X-Local-Timestamp': utcOffsetSeconds.toString() } },
    );
  }
}
