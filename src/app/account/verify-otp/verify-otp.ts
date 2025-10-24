import { Component, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../core/services/account.service';
import { FormValidationService } from '../../shared/services/form-validation.service';

@Component({
  selector: 'app-verify-otp',
  imports: [ReactiveFormsModule],
  templateUrl: './verify-otp.html',
  styles: ``,
})
export class VerifyOtp {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private formValidationService = inject(FormValidationService);
  private router = inject(Router);
  email = input.required<string>();
  otpForm!: FormGroup;

  constructor() {
    this.buildForm();
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.otpForm.valid) {
      const code = Object.values(this.otpForm.value).join('');
      this.accountService.verifyOtp({ email: this.email(), code }).subscribe({
        next: (result) => {
          // Handle successful OTP verification
          console.log('OTP verified successfully:', result);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.formValidationService.showErrors(this.otpForm, error);
        },
      });
    }
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value.length === 1 && index < 5) {
      const nextInput = document.querySelector(
        `input[name="digit${index + 1}"]`,
      ) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }

    if (value.length > 1) {
      this.handlePaste(value, index);
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otpForm.get(`digit${index}`)?.value && index > 0) {
      const prevInput = document.querySelector(
        `input[name="digit${index - 1}"]`,
      ) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text');
    if (paste && /^\d{6}$/.test(paste)) {
      this.handlePaste(paste, 0);
    }
  }

  private handlePaste(value: string, startIndex: number) {
    for (let i = 0; i < value.length && startIndex + i < 6; i++) {
      this.otpForm.get(`digit${startIndex + i}`)?.setValue(value[i]);
    }
    const nextIndex = Math.min(startIndex + value.length, 5);
    const nextInput = document.querySelector(`input[name="digit${nextIndex}"]`) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }

  private buildForm(): void {
    this.otpForm = this.fb.group({
      digit0: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit1: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit2: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit3: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit4: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      digit5: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    });
  }
}
