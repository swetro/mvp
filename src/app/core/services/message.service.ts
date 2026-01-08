import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  /**
   * Displays an error message
   * @param message - The error message to display
   */
  showError(message: string): void {
    console.log(`[Error Message] ${message}`);
  }

  /**
   * Displays a success message
   * @param message - The success message to display
   */
  showSuccess(message: string): void {
    console.log(`[Success Message] ${message}`);
  }

  /**
   * Displays an informational message
   * @param message - The info message to display
   */
  showInfo(message: string): void {
    console.log(`[Info Message] ${message}`);
  }

  /**
   * Displays a warning message
   * @param message - The warning message to display
   */
  showWarning(message: string): void {
    console.log(`[Warning Message] ${message}`);
  }
}
