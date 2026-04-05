import { inject, Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

@Pipe({
  name: 'speed',
  standalone: true,
  pure: false,
})
export class SpeedPipe implements PipeTransform {
  private readonly languageService = inject(LanguageService);

  transform(value: number, measurementSystem = 'MetricSystem'): string {
    if (value == null || isNaN(value) || value === 0) {
      const zero = (0).toLocaleString(this.getLocale(), {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return measurementSystem === 'MetricSystem' ? `${zero} km/h` : `${zero} mph`;
    }

    const locale = this.getLocale();
    const opts: Intl.NumberFormatOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

    if (measurementSystem === 'MetricSystem') {
      return `${(value * 3.6).toLocaleString(locale, opts)} km/h`;
    } else {
      return `${(value * 2.23694).toLocaleString(locale, opts)} mph`;
    }
  }

  private getLocale(): string {
    const localeMap: Record<string, string> = { en: 'en-US', es: 'es-CO' };
    return localeMap[this.languageService.getCurrentLanguage()] ?? 'en-US';
  }
}
