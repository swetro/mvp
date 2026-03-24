import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { FormValidationService } from '../../shared/services/form-validation.service';
import { MetaTagsService } from '../../shared/services/meta-tags.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { Spinner } from '../../shared/components/spinner/spinner';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe, Spinner],
  templateUrl: './sign-up.html',
  styles: ``,
})
export class SignUp {
  private readonly fb = inject(FormBuilder);
  private readonly formValidationService = inject(FormValidationService);
  private readonly authService = inject(AuthService);
  private readonly metaTagsService = inject(MetaTagsService);
  private readonly languageService = inject(LanguageService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  signUpForm!: FormGroup;
  readonly isLoading = signal(false);
  readonly currentLanguage = this.languageService.getCurrentLanguage();

  readonly pageMetadata = {
    title: this.translate.instant('signUp.title'),
    description: this.translate.instant('signUp.description'),
  };

  constructor() {
    this.buildForm();
    effect(() => {
      this.metaTagsService.updateMetaTags(this.pageMetadata);
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.signUpForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      const formData = this.signUpForm.value;
      this.authService
        .signUp(formData)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: () => {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'];
            this.router.navigate(['/', this.currentLanguage, 'auth', 'verify-otp'], {
              queryParams: { email: formData.email, ...(returnUrl ? { returnUrl } : {}) },
            });
          },
          error: (error) => {
            this.formValidationService.showErrors(this.signUpForm, error);
          },
        });
    }
  }

  private buildForm(): void {
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }
}
