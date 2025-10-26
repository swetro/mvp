import { Routes } from '@angular/router';
import { PageNotFound } from './shared/components/page-not-found/page-not-found';
import { DefaultLayout } from './shared/layouts/default-layout/default-layout';
import { Home } from './home/home';
import { ChallengeResult } from './challenge/challenge-result/challenge-result';
import { ChallengeParticipant } from './challenge/challenge-participant/challenge-participant';
import { SignIn } from './account/sign-in/sign-in';
import { SignUp } from './account/sign-up/sign-up';
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
        redirectTo: 'sign-in',
        pathMatch: 'full',
      },
      {
        path: 'sign-in',
        component: SignIn,
      },
      {
        path: 'sign-up',
        component: SignUp,
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
