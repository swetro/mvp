import { inject, Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

@Pipe({
  name: 'elevation',
  standalone: true,
  pure: false,
})
export class ElevationPipe implements PipeTransform {
  private readonly languageService = inject(LanguageService);

  transform(value: number, measurementSystem = 'MetricSystem'): string {
    if (value == null || isNaN(value)) {
      return '';
    }

    const locale = this.getLocale();

    if (measurementSystem === 'MetricSystem') {
      if (value >= 1000) {
        return `${(value / 1000).toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;
      } else {
        return `${value.toLocaleString(locale, { maximumFractionDigits: 1 })} m`;
      }
    } else {
      const metersInOneMile = 1609.34;
      const metersInOneFoot = 0.3048;
      if (value >= metersInOneMile) {
        return `${(value / metersInOneMile).toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mi`;
      } else {
        return `${(value / metersInOneFoot).toLocaleString(locale, { maximumFractionDigits: 0 })} ft`;
      }
    }
  }

  private getLocale(): string {
    const localeMap: Record<string, string> = { en: 'en-US', es: 'es-CO' };
    return localeMap[this.languageService.getCurrentLanguage()] ?? 'en-US';
  }
}
