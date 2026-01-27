import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './header.html',
  styles: ``,
})
export class Header {
  private languageService = inject(LanguageService);
  currentLanguage = this.languageService.getCurrentLanguage();
}
