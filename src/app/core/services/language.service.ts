import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translate = inject(TranslateService);
  private defaultLanguage = environment.defaultLanguage || 'en';

  getBrowserLanguage(): string {
    const browserLang = this.translate.getBrowserLang();

    if (!browserLang) {
      return this.translate.getFallbackLang() || this.defaultLanguage;
    }

    // ej: 'es-CO' -> 'es'
    const langCode = browserLang.split('-')[0];
    return this.translate.getLangs().includes(langCode) ? langCode : this.defaultLanguage;
  }

  getCurrentLanguage(): string {
    return this.translate.getCurrentLang();
  }

  isSupportedLanguage(lang: string): boolean {
    return this.translate.getLangs().includes(lang);
  }

  setLanguage(lang: string): void {
    if (this.isSupportedLanguage(lang)) {
      this.translate.use(lang);
      this.setHtmlLangAttribute(lang);
    }
  }

  private setHtmlLangAttribute(lang: string): void {
    if (lang && typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', lang);
    }
  }
}
