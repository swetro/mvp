import { Component, computed, effect, inject, input, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormValidationService } from '../../shared/services/form-validation.service';
import { MetaTagsService } from '../../shared/services/meta-tags.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-verify-otp',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './verify-otp.html',
  styles: ``,
})
export class VerifyOtp implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private languageService = inject(LanguageService);
  private formValidationService = inject(FormValidationService);
  private router = inject(Router);
  private metaTagsService = inject(MetaTagsService);
  private translate = inject(TranslateService);

  email = input.required<string>();
  initialDuration = 6; // seconds
  remainingTime = signal(this.initialDuration);
  isRunning = signal(false);
  isLoading = signal(false);
  otpForm!: FormGroup;
  currentLanguage = this.languageService.getCurrentLanguage();

  formattedTime = computed(() => {
    const minutes = Math.floor(this.remainingTime() / 60);
    const seconds = this.remainingTime() % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  ngOnInit() {
    if (!this.email()) {
      this.router.navigate(['/', this.currentLanguage, 'auth', 'sign-in']);
    }
  }

  constructor() {
    this.metaTagsService.updateMetaTags({
      title: this.translate.instant('verifyOtp.title'),
      description: this.translate.instant('verifyOtp.description'),
    });
    this.buildForm();
    this.isRunning.set(true);

    effect(() => {
      let intervalId: NodeJS.Timeout | string | number | undefined;
      if (this.isRunning()) {
        intervalId = setInterval(() => {
          this.remainingTime.update((current) => {
            if (current > 0) {
              return current - 1;
            } else {
              this.isRunning.set(false); // Stop the timer when it reaches zero
              return 0;
            }
          });
        }, 1000);
      }

      // Cleanup function: This runs when the effect reruns or the component is destroyed
      return () => clearInterval(intervalId);
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.otpForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      const otp = Object.values(this.otpForm.value).join('');
      const verifyOtpDto = { email: this.email(), code: otp };

      this.authService.verifyOtp(verifyOtpDto).subscribe({
        next: () => {
          this.authService.refreshUserProfile();
          this.router.navigate(['/', this.currentLanguage, 'account', 'profile']);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.formValidationService.showErrors(this.otpForm, error);
          this.isLoading.set(false);
        },
      });
    }
  }

  resendOtp() {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.authService.resendOtp(this.email()).subscribe({
      next: () => {
        this.otpForm.reset();
        this.remainingTime.set(this.initialDuration);
        this.isRunning.set(true);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.formValidationService.showErrors(this.otpForm, error);
        this.isLoading.set(false);
      },
    });
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
