import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private translate = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);
  private availableLanguages = ['en', 'es'];
  private defaultLanguage = environment.defaultLanguage || 'en';

  constructor() {
    this.translate.addLangs(this.availableLanguages);
    this.translate.setFallbackLang(this.defaultLanguage);

    if (isPlatformBrowser(this.platformId)) {
      // const browserLang = this.defaultLanguage;
      const browserLang = this.getBrowserLanguage();
      this.translate.use(browserLang);
    } else {
      this.translate.use(this.defaultLanguage);
    }
  }

  private getBrowserLanguage(): string {
    const browserLang = this.translate.getBrowserLang();

    if (!browserLang) {
      return this.defaultLanguage;
    }

    // ej: 'es-CO' -> 'es'
    const langCode = browserLang.split('-')[0];
    return this.availableLanguages.includes(langCode) ? langCode : this.defaultLanguage;
  }
}
