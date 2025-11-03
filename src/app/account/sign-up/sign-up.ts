import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormValidationService } from '../../shared/services/form-validation.service';
import { MetaTagsService } from '../../shared/services/meta-tags.service';
import { AccountService } from '../../core/services/account.service';
import { Router } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe],
  templateUrl: './sign-up.html',
  styles: ``,
})
export class SignUp {
  private fb = inject(FormBuilder);
  private readonly formValidationService = inject(FormValidationService);
  private accountService = inject(AccountService);
  private metaTagsService = inject(MetaTagsService);
  private languageService = inject(LanguageService);
  private translate = inject(TranslateService);
  private readonly router = inject(Router);
  signUpForm!: FormGroup;
  currentLanguage = this.languageService.getCurrentLanguage();

  constructor() {
    this.buildForm();
    this.metaTagsService.updateMetaTags({
      title: this.translate.instant('signUp.title'),
      description: this.translate.instant('signUp.description'),
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.signUpForm.valid) {
      const formData = this.signUpForm.value;
      this.accountService.signUp(formData).subscribe({
        next: () => {
          this.router.navigate(['/', this.currentLanguage, 'account', 'verify-otp'], {
            queryParams: { email: formData.email },
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
