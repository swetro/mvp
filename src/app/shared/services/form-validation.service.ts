import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiValidationError } from '../models/api-validation-error.dto';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  showErrors(form: FormGroup, error: unknown) {
    // Check if the error is an HttpErrorResponse
    if (!(error instanceof HttpErrorResponse)) {
      throw error;
    }

    // Check if the error status is 400
    if (error.status !== 400) {
      throw error;
    }

    // Check if the error has a message
    if (error.error.message) {
      form.setErrors({ 'error-message': error.error.message });
    }

    // Check if the error has validation errors
    const validationErrors = error.error.validationErrors as ApiValidationError;
    if (validationErrors) {
      for (const [key, value] of Object.entries(validationErrors)) {
        // Make sure the control name is in lowercase
        const controlName = key.charAt(0).toLowerCase() + key.slice(1);
        const formControl = form.get(controlName);
        if (formControl) {
          value.forEach((errorMessage) => {
            formControl.setErrors({ apiErrors: errorMessage });
          });
          formControl.markAsTouched();
        }
      }
    }
  }
}
