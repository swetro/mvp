import { Pipe, PipeTransform, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';

@Pipe({
  name: 'localizedDate',
  standalone: true,
  pure: false,
})
export class LocalizedDatePipe implements PipeTransform {
  private languageService = inject(LanguageService);
  private readonly formatMap: Record<string, Record<string, string>> = {
    'en-US': {
      default: 'MMM dd yyyy, HH:mm',
      short: 'MMM dd yyyy',
      long: 'MMMM dd yyyy, HH:mm:ss',
      dateOnly: 'MMM dd yyyy',
      timeOnly: 'HH:mm',
      dayMonth: 'dd MMM',
    },
    'es-CO': {
      default: 'dd MMM yyyy, HH:mm',
      short: 'dd MMM yyyy',
      long: 'dd MMMM yyyy, HH:mm:ss',
      dateOnly: 'dd MMM yyyy',
      timeOnly: 'HH:mm',
      dayMonth: 'dd MMM',
    },
  };

  transform(value: string | number | Date, format?: string, timezone?: string): string | null {
    const locale = this.getLocaleFromLanguage();
    const localizedFormat = this.getLocalizedFormat(locale, format);
    const datePipe = new DatePipe(locale);
    const tz = timezone !== undefined ? timezone : this.extractTimezone(value);
    return datePipe.transform(value, localizedFormat, tz, locale);
  }

  private extractTimezone(value: string | number | Date): string {
    if (typeof value === 'string') {
      const match = value.match(/([+-]\d{2}:\d{2}|Z)$/);
      if (match) return match[1] === 'Z' ? 'UTC' : match[1];
    }
    return 'UTC';
  }

  private getLocaleFromLanguage(): string {
    const lang = this.languageService.getCurrentLanguage();
    const localeMap: Record<string, string> = {
      en: 'en-US',
      es: 'es-CO',
    };
    return localeMap[lang] || 'en-US';
  }

  private getLocalizedFormat(lang: string, format?: string): string {
    const langFormats = this.formatMap[lang] || this.formatMap['en'];

    if (!format) {
      return langFormats['default'];
    }
    if (langFormats[format]) {
      return langFormats[format];
    }

    return format;
  }
}
