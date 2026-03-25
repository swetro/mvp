import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { FormValidationService } from '../../shared/services/form-validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';
import { Spinner } from '../../shared/components/spinner/spinner';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe, Spinner],
  templateUrl: './sign-in.html',
  styles: ``,
})
export class SignIn {
  private readonly fb = inject(FormBuilder);
  private readonly formValidationService = inject(FormValidationService);
  private readonly authService = inject(AuthService);
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  signInForm!: FormGroup;
  readonly isLoading = signal(false);
  readonly currentLanguage = this.languageService.getCurrentLanguage();

  constructor() {
    this.buildForm();
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

  private buildForm(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
}
