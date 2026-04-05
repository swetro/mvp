import { inject, Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

@Pipe({
  name: 'distance',
  standalone: true,
  pure: false,
})
export class DistancePipe implements PipeTransform {
  private readonly languageService = inject(LanguageService);

  transform(value: number, measurementSystem = 'MetricSystem'): string {
    if (value == null || isNaN(value)) {
      return '';
    }

    let convertedValue: number;
    let unitLabel: string;

    if (measurementSystem === 'MetricSystem') {
      convertedValue = value / 1000;
      unitLabel = 'km';
    } else {
      convertedValue = value / 1609.34;
      unitLabel = 'mi';
    }

    return `${convertedValue.toLocaleString(this.getLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unitLabel}`;
  }

  private getLocale(): string {
    const localeMap: Record<string, string> = { en: 'en-US', es: 'es-CO' };
    return localeMap[this.languageService.getCurrentLanguage()] ?? 'en-US';
  }
}
