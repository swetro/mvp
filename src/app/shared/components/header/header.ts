import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { NameInitialsPipe } from '../../pipes/name-initials.pipe';

@Component({
  selector: 'app-header',
  imports: [RouterLink, TranslatePipe, NameInitialsPipe],
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

  isMobileMenuOpen = false;
  isUserMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    if (this.isUserMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  closeUserMenu() {
    this.isUserMenuOpen = false;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.isMobileMenuOpen = false;
      this.isUserMenuOpen = false;
      this.router.navigate([`/${this.currentLanguage}`]);
    });
  }
}
