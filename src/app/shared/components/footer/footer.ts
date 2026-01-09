import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styles: ``,
})
export class Footer {
  private languageService = inject(LanguageService);
  currentLanguage = this.languageService.getCurrentLanguage();
  currentYear: number = new Date().getFullYear();
}
