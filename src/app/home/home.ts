import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MetaTagsService } from '../shared/services/meta-tags.service';
import { LanguageService } from '../core/services/language.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [TranslateModule, RouterLink],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {
  private translateService = inject(TranslateService);
  private metaTagsService = inject(MetaTagsService);
  private languageService = inject(LanguageService);

  currentLanguage = this.languageService.getCurrentLanguage();

  constructor() {
    this.metaTagsService.updateMetaTags({
      title: this.translateService.instant('home.title'),
      description: this.translateService.instant('home.description'),
      image: 'https://example.com/image.jpg',
    });
  }
}
