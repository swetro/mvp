import { Component, effect, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AccountService } from '../../core/services/account.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormValidationService } from '../../shared/services/form-validation.service';
import { MetaTagsService } from '../../shared/services/meta-tags.service';
import { DatasetService } from '../../shared/services/dataset.service';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './edit-profile.html',
  styles: ``,
})
export class EditProfile {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private accountService = inject(AccountService);
  private readonly formValidationService = inject(FormValidationService);
  private metaTagsService = inject(MetaTagsService);
  private translate = inject(TranslateService);
  private datasetService = inject(DatasetService);

  currentUser = this.authService.currentUser;
  profileForm!: FormGroup;
  isLoading = signal(false);

  days = Array.from({ length: 31 }, (_, i) => {
    const dayNumber = i + 1;
    return {
      value: dayNumber.toString(), // "1", "2", ... "31"
      label: dayNumber.toString().padStart(2, '0'), // "01", "02", ... "31"
    };
  });
  editProfileDatasetData = this.datasetService.getEditProfileDataset();

  constructor() {
    this.buildForm();
    this.metaTagsService.updateMetaTags({
      title: this.translate.instant('editProfile.body.title'),
      description: this.translate.instant('editProfile.body.description'),
    });

    effect(() => {
      const user = this.currentUser();
      if (user) {
        const datePart = user.birthDate ? user.birthDate.split('T')[0] : '';
        const [year, monthPart, dayPart] = datePart.split('-');

        const month = Number(monthPart).toString();
        const day = Number(dayPart).toString();

        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          countryCode: user.countryCode,
          gender: user.gender,
          birthDay: day,
          birthMonth: month,
          birthYear: year,
          defaultLanguageCode: user.defaultLanguageCode,
        });
      }
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.profileForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      const formData = this.profileForm.getRawValue();
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        countryCode: formData.countryCode,
        gender: formData.gender,
        birthDate: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}T00:00:00`,
        defaultLanguageCode: formData.defaultLanguageCode,
      };

      this.accountService.updateProfile(payload).subscribe({
        next: () => {
          this.authService.refreshUserProfile();
          this.isLoading.set(false);
        },
        error: (error) => {
          this.formValidationService.showErrors(this.profileForm, error);
          this.isLoading.set(false);
        },
      });
    }
  }

  private buildForm(): void {
    this.profileForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.maxLength(30)]],
        lastName: ['', [Validators.required, Validators.maxLength(30)]],
        countryCode: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        birthDay: ['', [Validators.required]],
        birthMonth: ['', [Validators.required]],
        birthYear: ['', [Validators.required]],
        birthDate: [''], // Hidden field for generic apiErrors,
        defaultLanguageCode: ['', [Validators.required]],
      },
      { validators: this.dateValidator },
    );
  }

  private dateValidator = (control: AbstractControl): ValidationErrors | null => {
    const day = control.get('birthDay')?.value;
    const month = control.get('birthMonth')?.value;
    const year = control.get('birthYear')?.value;

    if (!day || !month || !year) return null;

    const d = new Date(Number(year), Number(month) - 1, Number(day));
    if (
      d.getFullYear() === Number(year) &&
      d.getMonth() === Number(month) - 1 &&
      d.getDate() === Number(day)
    ) {
      return null;
    }
    return { invalidDate: true };
  };
}
