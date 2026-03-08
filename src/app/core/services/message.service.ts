import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private translate = inject(TranslateService);

  toasts = signal<Toast[]>([]);
  private nextId = 0;

  showError(message?: string): void {
    this.addToast('error', message);
  }

  showSuccess(message?: string): void {
    this.addToast('success', message);
  }

  showInfo(message?: string): void {
    this.addToast('info', message);
  }

  showWarning(message?: string): void {
    this.addToast('warning', message);
  }

  remove(id: number): void {
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  private readonly fallbackKeys: Record<Toast['type'], string> = {
    success: 'forms.messages.saveSuccess',
    error: 'forms.messages.saveError',
    info: 'messages.genericInfo',
    warning: 'messages.genericWarning',
  };

  private addToast(type: Toast['type'], message?: string): void {
    const resolved = message?.trim() || this.translate.instant(this.fallbackKeys[type]);
    const id = this.nextId++;
    this.toasts.update((toasts) => [...toasts, { id, type, message: resolved }]);
    setTimeout(() => this.remove(id), 4000);
  }
}
