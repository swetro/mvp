import { inject, Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

@Pipe({
  name: 'localizedDecimal',
  standalone: true,
  pure: false,
})
export class LocalizedDecimalPipe implements PipeTransform {
  private readonly languageService = inject(LanguageService);

  transform(value: number, maxFractionDigits = 1): string {
    if (value == null || isNaN(value)) {
      return '';
    }

    const locale = this.getLocale();
    return value.toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxFractionDigits,
    });
  }

  private getLocale(): string {
    const localeMap: Record<string, string> = { en: 'en-US', es: 'es-CO' };
    return localeMap[this.languageService.getCurrentLanguage()] ?? 'en-US';
  }
}
