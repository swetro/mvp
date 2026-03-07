# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development server (http://localhost:4200)
ng serve

# Build
ng build

# Run tests (Karma/Jasmine)
ng test

# Run a single test file
ng test --include='**/path/to/file.spec.ts'

# Lint
ng lint

# Format
npm run format
```

## Architecture

This is an **Angular 21 SSR app** (Server-Side Rendering via `@angular/ssr` + Express). It uses **zoneless change detection** (`provideZonelessChangeDetection`) and **Angular Signals** throughout.

### Key architectural patterns

- **`httpResource`** (Angular's new resource API) is used for all GET requests. Services return `HttpResourceRef<T>` objects that components consume reactively via signals (`.value()`, `.isLoading()`, `.error()`). Mutations use the standard `HttpClient` methods.
- **API responses** are wrapped in `ApiResult<T>` (`{ data: T }`) and unwrapped in the `parse` option of `httpResource`.
- **Auth** is session/cookie-based. The `AuthInterceptor` forwards cookies during SSR. The `serverInterceptor` rewrites relative `/api` URLs to the absolute backend URL when running server-side.
- **i18n** uses `@ngx-translate` with JSON files in `public/i18n/`. All URLs are prefixed with the active language (`/:lang/...`). The `langGuard` detects the browser language and redirects if no language prefix is present. Supported languages: `en`, `es`.
- **Environments**: `environment.ts` (production), `environment.development.ts`, `environment.staging.ts`. The `apiUrl` is `/api/v1` in all envs (proxied via the server interceptor during SSR).

### Directory structure

```
src/
  app/
    core/           # Singleton services, interceptors, guards
      services/     # AuthService, AccountService, LanguageService, etc.
      interceptors/ # auth, lang, server
      guards/       # authGuard, langGuard
      models/       # DTOs scoped to core (auth, account)
    shared/         # Reusable across features
      components/   # Header, Footer, Spinner, NoDataView, etc.
      pipes/        # distance, pace, duration, elevation, heart-rate, etc.
      services/     # ChallengeService, ActivityService, DeviceService, FormValidationService
      models/       # Shared DTOs (ApiResult, PagedResult, challenge, participant, activity, device)
      enums/        # ActivityType, DeviceBrand
      constants/    # activity-type-icons, device-providers
      layouts/      # DefaultLayout (wraps all routes)
    pages/          # Static pages (PrivacyPolicy, TermsAndConditions, CookiePolicy)
    auth/           # SignIn, SignUp, VerifyOtp, OauthCallback
    account/        # Activities, Devices, EditProfile (guarded by authGuard)
    challenge/      # ChallengeLeaderboard, ChallengeParticipant
    home/           # Home page
  environments/     # environment.ts, environment.development.ts, environment.staging.ts
  server.ts         # Express SSR server entry point
public/
  i18n/             # en.json, es.json translation files
  images/           # Static images (device logos, activity icons)
```

### Routing

All routes live under `DefaultLayout` and are prefixed by an optional `/:lang` segment handled by `langGuard`. The `account/*` routes are protected by `authGuard`. Route slugs for challenges map to backend league/challenge IDs via `ChallengeConfigService`, which reads from `environment.challenges`.

### Naming conventions

- Components use PascalCase class names **without** the `Component` suffix (e.g., `class Home`, `class SignIn`, `class EditProfile`). Services keep the `Service` suffix, pipes keep the `Pipe` suffix.
- Component selectors use `app-` prefix in kebab-case.
- Directive selectors use `app` prefix in camelCase.

### Linting & formatting

ESLint + Prettier are integrated (prettier rules enforced via eslint). Prettier config: `printWidth: 100`, `singleQuote: true`, Angular HTML parser for `.html` files.
