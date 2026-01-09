import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MetaTagsService } from '../../services/meta-tags.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-page-not-found',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './page-not-found.html',
  styles: ``,
})
export class PageNotFound {
  private metaTagsService = inject(MetaTagsService);
  private languageService = inject(LanguageService);
  private translate = inject(TranslateService);
  currentLanguage = this.languageService.getCurrentLanguage();

  constructor() {
    this.metaTagsService.updateMetaTags({
      title: this.translate.instant('pageNotFound.title'),
      description: this.translate.instant('pageNotFound.description'),
    });
  }
}
