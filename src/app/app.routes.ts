import { Routes } from '@angular/router';
import { PageNotFound } from './shared/components/page-not-found/page-not-found';
import { DefaultLayout } from './shared/layouts/default-layout/default-layout';
import { Home } from './home/home';
import { ChallengeLeaderboard } from './challenge/challenge-leaderboard/challenge-leaderboard';
import { ChallengeParticipant } from './challenge/challenge-participant/challenge-participant';
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
import { Profile } from './account/profile/profile';

const mainRoutes: Routes = [
  { path: '', component: Home },
  { path: 'leaderboard/:slug', component: ChallengeLeaderboard, pathMatch: 'full' },
  {
    path: 'leaderboard/:slug/:participantId',
    component: ChallengeParticipant,
  },
  {
    path: 'auth',
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      { path: 'sign-in', component: SignIn },
      { path: 'sign-up', component: SignUp },
      { path: 'verify-otp', component: VerifyOtp },
    ],
  },
  {
    path: 'account',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: Profile },
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
