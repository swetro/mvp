import { Component, inject } from '@angular/core';
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
  private availableLanguages = ['en', 'es'];
  private defaultLanguage = environment.defaultLanguage;

  constructor() {
    this.translate.addLangs(this.availableLanguages);
    this.translate.setFallbackLang(this.defaultLanguage);

    // Language will be set dynamically based on route in the guard
    // No need to set initial language here as it will be handled by routing
  }
}
