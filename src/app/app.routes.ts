import { Routes } from '@angular/router';
import { ChallengeDetail } from './features/challenge/challenge-detail/challenge-detail';
import { PageNotFound } from './shared/components/page-not-found/page-not-found';
import { ParticipantDetail } from './features/challenge/participant-detail/participant-detail';

export const routes: Routes = [
  {
    path: '',
    // component: JobPostingLayoutComponent,
    children: [
      {
        path: '',
        component: ChallengeDetail,
        pathMatch: 'full',
      },
      {
        path: 'participants/:id',
        component: ParticipantDetail,
      },
    ],
  },
  {
    path: '**',
    component: PageNotFound,
  },
];
