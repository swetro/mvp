import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './header.html',
  styles: ``,
})
export class Header {
  private languageService = inject(LanguageService);
  private authService = inject(AuthService);
  private router = inject(Router);
  currentLanguage = this.languageService.getCurrentLanguage();

  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate([`/${this.currentLanguage}`]);
    });
  }
}
