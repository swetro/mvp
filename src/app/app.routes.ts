import { Routes } from '@angular/router';
import { PageNotFound } from './shared/components/page-not-found/page-not-found';
import { DefaultLayout } from './shared/layouts/default-layout/default-layout';
import { Home } from './home/home';
import { ChallengeResult } from './challenge/challenge-result/challenge-result';
import { ChallengeParticipant } from './challenge/challenge-participant/challenge-participant';
import { SignIn } from './account/sign-in/sign-in';
import { SignUp } from './account/sign-up/sign-up';
import { VerifyOtp } from './account/verify-otp/verify-otp';
import { langGuard } from './core/guards/lang.guard';
import { authGuard } from './core/guards/auth.guard';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';
import { TermsAndConditions } from './pages/terms-and-conditions/terms-and-conditions';
import { CookiePolicy } from './pages/cookie-policy/cookie-policy';

const mainRoutes: Routes = [
  { path: '', component: Home },
  { path: 'results', component: ChallengeResult, pathMatch: 'full' },
  { path: 'results/:participantId', component: ChallengeParticipant, canActivate: [authGuard] },
  {
    path: 'account',
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      { path: 'sign-in', component: SignIn },
      { path: 'sign-up', component: SignUp },
      { path: 'verify-otp', component: VerifyOtp },
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
