import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormValidationService } from '../../shared/services/form-validation.service';
import { MetaTagsService } from '../../shared/services/meta-tags.service';
import { AccountService } from '../../core/services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe],
  templateUrl: './login.html',
  styles: ``,
})
export class Login {
  private fb = inject(FormBuilder);
  private readonly formValidationService = inject(FormValidationService);
  private accountService = inject(AccountService);
  private metaTagsService = inject(MetaTagsService);
  private translate = inject(TranslateService);
  private readonly router = inject(Router);
  loginForm!: FormGroup;

  constructor() {
    this.buildForm();
    this.metaTagsService.updateMetaTags({
      title: `${this.translate.instant('login.title')}`,
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.accountService.login(loginData).subscribe({
        next: () => {
          this.router.navigate(['/verify-otp']);
        },
        error: (error) => {
          this.formValidationService.showErrors(this.loginForm, error);
        },
      });
    }
  }

  private buildForm(): void {
    this.loginForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
      },
      { updateOn: 'blur' },
    );
  }
}
