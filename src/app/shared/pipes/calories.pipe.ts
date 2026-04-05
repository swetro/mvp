import { inject, Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

@Pipe({
  name: 'calories',
  standalone: true,
  pure: false,
})
export class CaloriesPipe implements PipeTransform {
  private readonly languageService = inject(LanguageService);

  transform(value: number): string {
    if (value == null || isNaN(value)) {
      return '';
    }

    return `${Math.round(value).toLocaleString(this.getLocale(), { maximumFractionDigits: 0 })} kcal`;
  }

  private getLocale(): string {
    const localeMap: Record<string, string> = { en: 'en-US', es: 'es-CO' };
    return localeMap[this.languageService.getCurrentLanguage()] ?? 'en-US';
  }
}
