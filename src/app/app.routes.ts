import { Routes } from '@angular/router';
import { PageNotFound } from './shared/components/page-not-found/page-not-found';
import { DefaultLayout } from './shared/layouts/default-layout/default-layout';
import { Home } from './home/home';
import { ChallengeResult } from './challenge/challenge-result/challenge-result';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: Home,
        pathMatch: 'full',
      },
      {
        path: 'results',
        component: ChallengeResult,
        pathMatch: 'full',
      },
      // {
      //   path: 'participants/:id',
      //   component: ParticipantDetail,
      // },
    ],
  },
  {
    path: '**',
    component: PageNotFound,
  },
];
