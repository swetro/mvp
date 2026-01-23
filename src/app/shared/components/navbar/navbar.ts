import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './navbar.html',
  styles: ``,
})
export class Navbar {
  private languageService = inject(LanguageService);
  currentLanguage = this.languageService.getCurrentLanguage();
}
