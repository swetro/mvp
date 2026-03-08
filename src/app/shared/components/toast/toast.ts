import { Component, inject } from '@angular/core';
import { MessageService } from '../../../core/services/message.service';

const TYPE_CLASSES: Record<string, string> = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white',
  warning: 'bg-yellow-500 text-white',
};

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
})
export class Toast {
  protected messageService = inject(MessageService);
  protected toasts = this.messageService.toasts;

  getTypeClasses(type: string): string {
    return TYPE_CLASSES[type] ?? '';
  }
}
