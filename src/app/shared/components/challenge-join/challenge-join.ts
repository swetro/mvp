import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ChallengeService } from '../../services/challenge.service';
import { MessageService } from '../../../core/services/message.service';
import { DatasetService } from '../../services/dataset.service';
import { FormValidationService } from '../../services/form-validation.service';
import { Spinner } from '../spinner/spinner';
import { JoinChallengeDto } from '../../models/challenge/join-challenge.dto';

type ModalState =
  | 'loading'
  | 'error'
  | 'notAvailable'
  | 'ended'
  | 'alreadyJoined'
  | 'profileIncomplete'
  | 'confirm';

@Component({
  selector: 'app-challenge-join',
  imports: [TranslatePipe, Spinner, ReactiveFormsModule],
  templateUrl: './challenge-join.html',
  styles: ``,
})
export class ChallengeJoin {
  private readonly challengeService = inject(ChallengeService);
  private readonly messageService = inject(MessageService);
  private readonly datasetService = inject(DatasetService);
  private readonly fb = inject(FormBuilder);
  private readonly formValidationService = inject(FormValidationService);
  profileForm!: FormGroup;

  readonly challengeId = input.required<number>();
  readonly closed = output<void>();
  readonly joined = output<void>();
  readonly isLoading = signal(false);

  readonly requirements = this.challengeService.getJoinRequirements(this.challengeId);
  readonly editProfileDatasetData = this.datasetService.getEditProfileDataset();
  readonly days = Array.from({ length: 31 }, (_, i) => {
    const dayNumber = i + 1;
    return {
      value: dayNumber.toString(), // "1", "2", ... "31"
      label: dayNumber.toString().padStart(2, '0'), // "01", "02", ... "31"
    };
  });

  readonly modalState = computed((): ModalState => {
    if (this.requirements.error()) return 'error';
    if (this.requirements.isLoading()) return 'loading';
    const reqs = this.requirements.value();
    if (!reqs) return 'loading';

    const met = (name: string) => reqs.find((r) => r.requirement === name)?.isMet ?? true;

    if (!met('ChallengeExists') || !met('ProfileExists') || !met('ChallengeIsActive'))
      return 'notAvailable';
    if (!met('ChallengeNotEnded')) return 'ended';
    if (!met('UserNotAlreadyJoined')) return 'alreadyJoined';
    if (!met('ProfileHasGender') || !met('ProfileHasBirthDate') || !met('ProfileHasCountry'))
      return 'profileIncomplete';
    return 'confirm';
  });

  readonly needsGender = computed(
    () =>
      !(
        this.requirements.value()?.find((r) => r.requirement === 'ProfileHasGender')?.isMet ?? true
      ),
  );
  readonly needsBirthDate = computed(
    () =>
      !(
        this.requirements.value()?.find((r) => r.requirement === 'ProfileHasBirthDate')?.isMet ??
        true
      ),
  );
  readonly needsCountry = computed(
    () =>
      !(
        this.requirements.value()?.find((r) => r.requirement === 'ProfileHasCountry')?.isMet ?? true
      ),
  );

  constructor() {
    this.buildForm();

    effect(() => {
      const setValidator = (name: string, required: boolean) => {
        const ctrl = this.profileForm.get(name)!;
        if (required) {
          ctrl.setValidators(Validators.required);
        } else {
          ctrl.clearValidators();
        }
        ctrl.updateValueAndValidity({ emitEvent: false });
      };

      setValidator('birthDay', this.needsBirthDate());
      setValidator('birthMonth', this.needsBirthDate());
      setValidator('birthYear', this.needsBirthDate());
      setValidator('gender', this.needsGender());
      setValidator('countryCode', this.needsCountry());
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid || this.isLoading()) return;

    const payload: JoinChallengeDto = { challengeId: this.challengeId() };

    if (this.modalState() === 'profileIncomplete') {
      const {
        birthDay,
        birthMonth,
        birthYear,
        birthDate: _,
        ...formFields
      } = this.profileForm.value;
      Object.assign(payload, {
        ...formFields,
        birthDate: this.needsBirthDate()
          ? `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`
          : null,
      });
    }

    this.submitForm(payload);
  }

  onCancel(): void {
    this.closed.emit();
  }

  private submitForm(payload: JoinChallengeDto): void {
    this.isLoading.set(true);
    this.challengeService
      .joinChallenge(payload)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (result) => {
          const message = result.message;
          if (message) {
            this.messageService.showSuccess(message);
          }
          this.joined.emit();
          this.closed.emit();
        },
        error: (error) => {
          this.formValidationService.showErrors(this.profileForm, error);
        },
      });
  }

  private buildForm(): void {
    this.profileForm = this.fb.group(
      {
        birthDay: ['', [Validators.required]],
        birthMonth: ['', [Validators.required]],
        birthYear: ['', [Validators.required]],
        birthDate: [''], // Hidden field for generic apiErrors
        gender: ['', [Validators.required]],
        countryCode: ['', [Validators.required]],
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
