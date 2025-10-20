import { Routes } from '@angular/router';
import { PageNotFound } from './shared/components/page-not-found/page-not-found';
import { DefaultLayout } from './shared/layouts/default-layout/default-layout';
import { Home } from './home/home';
import { ChallengeResult } from './challenge/challenge-result/challenge-result';
import { ChallengeParticipant } from './challenge/challenge-participant/challenge-participant';
import { Login } from './account/login/login';
import { Register } from './account/register/register';
import { VerifyOtp } from './account/verify-otp/verify-otp';

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
      {
        path: 'results/:participantId',
        component: ChallengeParticipant,
      },
    ],
  },
  {
    path: 'account',
    component: DefaultLayout,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'register',
        component: Register,
      },
      {
        path: 'verify-otp',
        component: VerifyOtp,
      },
    ],
  },
  {
    path: '**',
    component: PageNotFound,
  },
];
