import { Component, computed, effect, inject, signal } from '@angular/core';
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
import { finalize } from 'rxjs';
import { FormValidationService } from '../../shared/services/form-validation.service';
import { MetaTagsService } from '../../shared/services/meta-tags.service';
import { DatasetService } from '../../shared/services/dataset.service';
import { MeasurementSystem } from '../../shared/enums/measurement-system.enum';
import { Router } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { MessageService } from '../../core/services/message.service';
import { Spinner } from '../../shared/components/spinner/spinner';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, TranslatePipe, Spinner],
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
  private router = inject(Router);
  private languageService = inject(LanguageService);
  private messageService = inject(MessageService);
  currentUser = this.authService.currentUser;
  editProfileForm!: FormGroup;
  isLoading = signal(false);
  measurementSystem = signal('');
  isMetric = computed(() => this.measurementSystem() === MeasurementSystem.MetricSystem);
  isImperial = computed(() => this.measurementSystem() === MeasurementSystem.ImperialSystem);

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
      title: this.translate.instant('editProfile.title'),
      description: this.translate.instant('editProfile.description'),
    });

    effect(() => {
      const user = this.currentUser();
      if (user) {
        const [year, monthPart, dayPart] = user.birthDate
          ? user.birthDate.split('T')[0].split('-')
          : ['', '', ''];

        const month = monthPart ? Number(monthPart).toString() : '';
        const day = dayPart ? Number(dayPart).toString() : '';

        this.editProfileForm.patchValue(
          {
            firstName: user.firstName,
            lastName: user.lastName,
            birthDay: day,
            birthMonth: month,
            birthYear: year ?? '',
            gender: user.gender ?? '',
            measurementSystem: user.measurementSystem ?? '',
            countryCode: user.countryCode ?? '',
            defaultLanguageCode: user.defaultLanguageCode ?? '',
          },
          { emitEvent: false },
        );

        this.measurementSystem.set(user.measurementSystem ?? '');
        this.updateHeightWeightValidators(user.measurementSystem ?? '');

        if (user.measurementSystem === MeasurementSystem.ImperialSystem) {
          const imperial = EditProfile.metricToImperial(
            user.weightInKilograms ?? 0,
            user.heightInCentimeters ?? 0,
          );
          this.editProfileForm.patchValue(imperial, { emitEvent: false });
        } else {
          this.editProfileForm.patchValue(
            { heightCm: user.heightInCentimeters, weightKg: user.weightInKilograms },
            { emitEvent: false },
          );
        }
      }
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.editProfileForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      const formData = this.editProfileForm.getRawValue();
      let weightInKilograms: number | undefined;
      let heightInCentimeters: number | undefined;

      if (formData.measurementSystem === MeasurementSystem.MetricSystem) {
        weightInKilograms = formData.weightKg ?? undefined;
        heightInCentimeters = formData.heightCm ?? undefined;
      } else {
        const metric = EditProfile.imperialToMetric(
          parseFloat(formData.weightLbs),
          parseInt(formData.heightFeet, 10),
          parseInt(formData.heightInches, 10),
        );
        weightInKilograms = metric.weightKg ?? undefined;
        heightInCentimeters = metric.heightCm ?? undefined;
      }

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: `${formData.birthYear}-${String(formData.birthMonth).padStart(2, '0')}-${String(formData.birthDay).padStart(2, '0')}T00:00:00`,
        gender: formData.gender,
        measurementSystem: formData.measurementSystem,
        weightInKilograms,
        heightInCentimeters,
        countryCode: formData.countryCode,
        defaultLanguageCode: formData.defaultLanguageCode,
      };

      this.accountService
        .updateProfile(payload)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: () => {
            this.messageService.showSuccess(this.translate.instant('forms.messages.saveSuccess'));
            const newLang = formData.defaultLanguageCode;
            if (newLang && newLang !== this.languageService.getCurrentLanguage()) {
              this.languageService.setLanguage(newLang);
              this.router.navigate(['/', newLang, 'account', 'profile'], { replaceUrl: true });
            } else {
              this.authService.refreshUserProfile();
            }
          },
          error: (error) => {
            this.formValidationService.showErrors(this.editProfileForm, error);
            this.messageService.showError(error.error?.message);
          },
        });
    }
  }

  private buildForm(): void {
    this.editProfileForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.maxLength(30)]],
        lastName: ['', [Validators.required, Validators.maxLength(30)]],
        birthDay: ['', [Validators.required]],
        birthMonth: ['', [Validators.required]],
        birthYear: ['', [Validators.required]],
        birthDate: [''], // Hidden field for generic apiErrors
        weightInKilograms: [''], // Hidden field for API errors
        heightInCentimeters: [''], // Hidden field for API errors
        gender: ['', [Validators.required]],
        countryCode: ['', [Validators.required]],
        defaultLanguageCode: ['', [Validators.required]],
        measurementSystem: ['', [Validators.required]],
        heightCm: [null],
        heightFeet: [''],
        heightInches: [''],
        weightKg: [null],
        weightLbs: [null],
      },
      { validators: this.dateValidator },
    );
  }

  private readonly hiddenControlMap: Record<string, string> = {
    weightKg: 'weightInKilograms',
    weightLbs: 'weightInKilograms',
    heightCm: 'heightInCentimeters',
  };

  onIntegerInput(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.value.includes('.')) {
      const integer = Math.trunc(parseFloat(input.value));
      const newValue = isNaN(integer) ? null : integer;
      input.value = newValue !== null ? newValue.toString() : '';
      this.editProfileForm.get(controlName)!.setValue(newValue, { emitEvent: false });
    }
    const hiddenControl = this.hiddenControlMap[controlName];
    if (hiddenControl) {
      this.editProfileForm.get(hiddenControl)!.setErrors(null);
    }
  }

  clearApiError(controlName: string): void {
    this.editProfileForm.get(controlName)!.setErrors(null);
  }

  onMeasurementSystemChange(event: Event): void {
    const newSystem = (event.target as HTMLSelectElement).value as MeasurementSystem;
    this.measurementSystem.set(newSystem);
    this.updateHeightWeightValidators(newSystem);
    this.convertMeasurements(newSystem);
  }

  private updateHeightWeightValidators(system: MeasurementSystem | string): void {
    const metricControls = ['heightCm', 'weightKg'];
    const imperialControls = ['heightFeet', 'heightInches', 'weightLbs'];

    const toRequired =
      system === MeasurementSystem.MetricSystem ? metricControls : imperialControls;
    const toClear = system === MeasurementSystem.MetricSystem ? imperialControls : metricControls;

    toRequired.forEach((name) => {
      const control = this.editProfileForm.get(name)!;
      control.setValidators(Validators.required);
      control.updateValueAndValidity({ emitEvent: false });
    });

    toClear.forEach((name) => {
      const control = this.editProfileForm.get(name)!;
      control.clearValidators();
      control.updateValueAndValidity({ emitEvent: false });
    });
  }

  private convertMeasurements(newSystem: MeasurementSystem): void {
    if (newSystem === MeasurementSystem.MetricSystem) {
      const metric = EditProfile.imperialToMetric(
        parseFloat(this.editProfileForm.get('weightLbs')?.value),
        parseInt(this.editProfileForm.get('heightFeet')?.value, 10),
        parseInt(this.editProfileForm.get('heightInches')?.value, 10),
      );
      this.editProfileForm.patchValue(metric, { emitEvent: false });
    } else if (newSystem === MeasurementSystem.ImperialSystem) {
      const imperial = EditProfile.metricToImperial(
        parseFloat(this.editProfileForm.get('weightKg')?.value),
        parseInt(this.editProfileForm.get('heightCm')?.value, 10),
      );
      this.editProfileForm.patchValue(imperial, { emitEvent: false });
    }
  }

  private static imperialToMetric(
    weightLbs: number,
    heightFeet: number,
    heightInches: number,
  ): { weightKg: number | null; heightCm: number | null } {
    const weightKg = !isNaN(weightLbs) ? Math.round(weightLbs / 2.20462) : null;
    const totalInches =
      !isNaN(heightFeet) && !isNaN(heightInches) ? heightFeet * 12 + heightInches : null;
    const heightCm = totalInches !== null ? Math.round(totalInches * 2.54) : null;
    return { weightKg, heightCm };
  }

  private static metricToImperial(
    weightKg: number,
    heightCm: number,
  ): { weightLbs: number | null; heightFeet: string; heightInches: string } {
    const weightLbs = !isNaN(weightKg) ? Math.round(weightKg * 2.20462) : null;
    const totalInches = !isNaN(heightCm) ? heightCm / 2.54 : null;
    const heightFeet = totalInches !== null ? Math.floor(totalInches / 12).toString() : '';
    const heightInches = totalInches !== null ? Math.round(totalInches % 12).toString() : '';
    return { weightLbs, heightFeet, heightInches };
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
