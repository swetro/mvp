import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../core/services/language.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [TranslateModule, RouterLink],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {
  private languageService = inject(LanguageService);
  currentLanguage = this.languageService.getCurrentLanguage();
}
