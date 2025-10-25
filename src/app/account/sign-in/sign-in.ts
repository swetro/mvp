import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormValidationService } from '../../shared/services/form-validation.service';
import { MetaTagsService } from '../../shared/services/meta-tags.service';
import { AccountService } from '../../core/services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe],
  templateUrl: './sign-in.html',
  styles: ``,
})
export class SignIn {
  private fb = inject(FormBuilder);
  private readonly formValidationService = inject(FormValidationService);
  private accountService = inject(AccountService);
  private metaTagsService = inject(MetaTagsService);
  private translate = inject(TranslateService);
  private readonly router = inject(Router);
  signInForm!: FormGroup;

  constructor() {
    this.buildForm();
    this.metaTagsService.updateMetaTags({
      title: this.translate.instant('signIn.title'),
      description: this.translate.instant('signIn.description'),
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.signInForm.valid) {
      const formData = this.signInForm.value;
      this.accountService.login(formData).subscribe({
        next: () => {
          this.router.navigate(['/account/verify-otp'], {
            queryParams: { email: formData.email },
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
