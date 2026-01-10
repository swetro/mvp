import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './footer.html',
  styles: ``,
})
export class Footer {
  private languageService = inject(LanguageService);
  currentLanguage = this.languageService.getCurrentLanguage();
  currentYear: number = new Date().getFullYear();
}
