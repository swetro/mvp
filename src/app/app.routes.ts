import { Routes } from '@angular/router';
import { PageNotFound } from './shared/components/page-not-found/page-not-found';
import { DefaultLayout } from './shared/layouts/default-layout/default-layout';
import { Home } from './home/home';
import { ChallengeIndex } from './challenges/challenge-index/challenge-index';
import { ChallengeLeaderboard } from './challenges/challenge-leaderboard/challenge-leaderboard';
import { ChallengeParticipant } from './challenges/challenge-participant/challenge-participant';
import { ChallengeDetails } from './challenges/challenge-details/challenge-details';
import { SignIn } from './auth/sign-in/sign-in';
import { SignUp } from './auth/sign-up/sign-up';
import { VerifyOtp } from './auth/verify-otp/verify-otp';
import { langGuard } from './core/guards/lang.guard';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';
import { TermsAndConditions } from './pages/terms-and-conditions/terms-and-conditions';
import { CookiePolicy } from './pages/cookie-policy/cookie-policy';
import { authGuard } from './core/guards/auth.guard';
import { Activities } from './account/activities/activities';
import { Devices } from './account/devices/devices';
import { EditProfile } from './account/edit-profile/edit-profile';
import { OauthCallback } from './auth/oauth-callback/oauth-callback';

const mainRoutes: Routes = [
  { path: '', component: Home },
  { path: 'challenges', component: ChallengeIndex },
  { path: 'challenges/:challengeId', component: ChallengeLeaderboard, pathMatch: 'full' },
  { path: 'challenges/:challengeId/details', component: ChallengeDetails },
  {
    path: 'challenges/:challengeId/:participantId',
    component: ChallengeParticipant,
  },
  {
    path: 'auth',
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      { path: 'sign-in', component: SignIn },
      { path: 'sign-up', component: SignUp },
      { path: 'verify-otp', component: VerifyOtp },
      { path: 'oauth-callback/:provider', component: OauthCallback },
    ],
  },
  {
    path: 'account',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: EditProfile },
      { path: 'activities', component: Activities },
      { path: 'devices', component: Devices },
    ],
  },
  { path: 'privacy-policy', component: PrivacyPolicy },
  { path: 'terms', component: TermsAndConditions },
  { path: 'cookies', component: CookiePolicy },
];

export const routes: Routes = [
  {
    path: '',
    canActivate: [langGuard], // 2) canMatch en vez de canActivate
    component: DefaultLayout,
    children: mainRoutes,
  },
  {
    path: ':lang',
    canActivate: [langGuard],
    component: DefaultLayout,
    children: [...mainRoutes, { path: '**', component: PageNotFound }],
  },
  { path: '**', component: PageNotFound },
];
