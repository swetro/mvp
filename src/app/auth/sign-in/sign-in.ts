import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { FormValidationService } from '../../shared/services/form-validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from '../../core/services/message.service';
import { Spinner } from '../../shared/components/spinner/spinner';
import { environment } from '../../../environments/environment';

// Authentication (ID tokens) — NOT authorization (access tokens).
// google.accounts.id.renderButton() triggers a popup that returns a signed JWT
// (ID token) which must be verified server-side using google-auth-library.
interface GoogleSignInConfig {
  client_id: string;
  callback: (response: { credential: string }) => void;
  auto_select?: boolean;
}

interface GoogleSignInWindow extends Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: GoogleSignInConfig) => void;
        renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
      };
    };
  };
}

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe, Spinner],
  templateUrl: './sign-in.html',
  styles: ``,
})
export class SignIn implements AfterViewInit {
  @ViewChild('googleButtonContainer') googleButtonContainer!: ElementRef<HTMLDivElement>;

  private readonly fb = inject(FormBuilder);
  private readonly formValidationService = inject(FormValidationService);
  private readonly authService = inject(AuthService);
  private readonly languageService = inject(LanguageService);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);

  signInForm!: FormGroup;
  readonly isLoading = signal(false);
  readonly isGoogleLoading = signal(false);
  readonly currentLanguage = this.languageService.getCurrentLanguage();

  constructor() {
    this.buildForm();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Initialize GSI and render an invisible button — this is the only reliable
    // way to trigger a Google Sign-In popup that returns an ID token on button click.
    const gsiWindow = window as GoogleSignInWindow;
    gsiWindow.google?.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: { credential: string }) => {
        // response.credential is a signed ID token (JWT) — verified server-side
        this.handleGoogleCredential(response.credential);
      },
      auto_select: false,
    });

    gsiWindow.google?.accounts.id.renderButton(this.googleButtonContainer.nativeElement, {
      type: 'standard',
      size: 'large',
      width: 400,
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.signInForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      const formData = this.signInForm.value;
      this.authService
        .signIn(formData)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: () => {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'];
            this.router.navigate(['/', this.currentLanguage, 'auth', 'verify-otp'], {
              queryParams: { email: formData.email, ...(returnUrl ? { returnUrl } : {}) },
            });
          },
          error: (error) => {
            this.formValidationService.showErrors(this.signInForm, error);
          },
        });
    }
  }

  onGoogleSignIn(): void {
    if (this.isGoogleLoading()) return;
    // Proxy the click to the hidden Google button rendered by GSI
    this.googleButtonContainer.nativeElement
      .querySelector('div[role="button"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }

  private handleGoogleCredential(idToken: string): void {
    this.isGoogleLoading.set(true);
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    this.authService
      .loginWithGoogle(idToken, this.currentLanguage)
      .pipe(finalize(() => this.isGoogleLoading.set(false)))
      .subscribe({
        next: (result) => {
          if (result?.code) {
            this.router.navigate(['/', this.currentLanguage, 'auth', 'verify-otp'], {
              queryParams: { email: result.details, ...(returnUrl ? { returnUrl } : {}) },
            });
            return;
          }
          this.authService.onLoginSuccess();
          this.router.navigate(returnUrl ? [returnUrl] : ['/', this.currentLanguage, 'challenges']);
        },
        error: (error) => {
          this.messageService.showError(
            error?.error?.message || this.translate.instant('error.default'),
          );
        },
      });
  }

  private buildForm(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
}
