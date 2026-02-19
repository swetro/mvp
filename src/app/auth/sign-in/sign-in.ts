import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormValidationService } from '../../shared/services/form-validation.service';
import { MetaTagsService } from '../../shared/services/meta-tags.service';
import { Router } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe],
  templateUrl: './sign-in.html',
  styles: ``,
})
export class SignIn {
  private fb = inject(FormBuilder);
  private readonly formValidationService = inject(FormValidationService);
  private authService = inject(AuthService);
  private metaTagsService = inject(MetaTagsService);
  private languageService = inject(LanguageService);
  private translate = inject(TranslateService);
  private readonly router = inject(Router);
  signInForm!: FormGroup;
  isLoading = signal(false);
  currentLanguage = this.languageService.getCurrentLanguage();

  constructor() {
    this.buildForm();
    this.metaTagsService.updateMetaTags({
      title: this.translate.instant('signIn.title'),
      description: this.translate.instant('signIn.description'),
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.signInForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      const formData = this.signInForm.value;
      this.authService.signIn(formData).subscribe({
        next: () => {
          this.router.navigate(['/', this.currentLanguage, 'auth', 'verify-otp'], {
            queryParams: { email: formData.email },
          });
          this.isLoading.set(false);
        },
        error: (error) => {
          this.formValidationService.showErrors(this.signInForm, error);
          this.isLoading.set(false);
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
