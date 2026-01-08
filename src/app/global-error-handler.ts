import { ErrorHandler, Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { LoggerService } from './core/services/logger.service';
import { MessageService } from './core/services/message.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  private translate = inject(TranslateService);
  private logger = inject(LoggerService);
  private messageService = inject(MessageService);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 401:
          this.messageService.showError(this.getMessage('error.401'));
          this.logger.logError(error, 'HTTP 401');
          break;
        case 403:
          this.messageService.showError(this.getMessage('error.403'));
          this.logger.logError(error, 'HTTP 403');
          break;
        case 404:
          this.messageService.showError(this.getMessage('error.404'));
          this.logger.logError(error, 'HTTP 404');
          break;
        case 500:
          this.messageService.showError(this.getMessage('error.500'));
          this.logger.logError(error, 'HTTP 500');
          break;
        default:
          this.messageService.showError(this.getMessage('error.default'));
          this.logger.logError(error, 'HTTP Error');
          break;
      }
    } else {
      this.messageService.showError(this.getMessage('error.default'));
      this.logger.logError(error, 'Application Error');
    }
  }

  private getMessage(key: string) {
    let message = '';
    if (!key) return message;

    this.translate.get(key).subscribe((res) => {
      message = res;
    });

    return message;
  }
}
