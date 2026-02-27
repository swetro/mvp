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
    },
    'es-CO': {
      default: 'dd MMM yyyy, HH:mm',
      short: 'dd MMM yyyy',
      long: 'dd MMMM yyyy, HH:mm:ss',
      dateOnly: 'dd MMM yyyy',
      timeOnly: 'HH:mm',
    },
  };

  transform(value: string | number | Date, format?: string, timezone?: string): string | null {
    const locale = this.getLocaleFromLanguage();
    const localizedFormat = this.getLocalizedFormat(locale, format);
    const datePipe = new DatePipe(locale);
    return datePipe.transform(value, localizedFormat, timezone, locale);
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
