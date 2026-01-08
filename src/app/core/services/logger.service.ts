import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  /**
   * Logs an error to the console
   * @param error - The error to log
   * @param context - Optional context information
   */
  logError(error: unknown, context?: string): void {
    const timestamp = new Date().toISOString();
    const prefix = context ? `[${context}]` : '[Error]';

    console.error(`${prefix} ${timestamp}:`, error);
  }

  /**
   * Logs a warning message
   * @param message - The warning message
   * @param data - Optional data to log
   */
  logWarning(message: string, data?: unknown): void {
    const timestamp = new Date().toISOString();
    console.warn(`[Warning] ${timestamp}: ${message}`, data);
  }

  /**
   * Logs an informational message
   * @param message - The info message
   * @param data - Optional data to log
   */
  logInfo(message: string, data?: unknown): void {
    const timestamp = new Date().toISOString();
    console.info(`[Info] ${timestamp}: ${message}`, data);
  }
}
