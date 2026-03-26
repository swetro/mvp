import { inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PageMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
}

const defaultMetadata: PageMetadata = {
  title: environment.appName,
  description: environment.appDescription,
  image: environment.appImageUrl,
  url: environment.appUrl,
};

const SUPPORTED_LANGS = ['en', 'es'];

@Injectable({
  providedIn: 'root',
})
export class MetaTagsService {
  titleService = inject(Title);
  MetaService = inject(Meta);
  private router = inject(Router);
  private translate = inject(TranslateService);

  updateMetaTags(metadata: Partial<PageMetadata>) {
    const metaInfo = { ...defaultMetadata, ...metadata };
    const tags = this.generateMetaDefinitions(metaInfo);
    tags.forEach((tag) => this.MetaService.updateTag(tag));
    this.titleService.setTitle(metaInfo.title);
  }

  initRouteListener(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const key = this.urlToMetaKey(e.urlAfterRedirects);
        const title = this.translate.instant(`${key}.title`);
        if (title !== `${key}.title`) {
          this.updateMetaTags({
            title,
            description: this.translate.instant(`${key}.description`),
          });
        }
      });
  }

  private urlToMetaKey(url: string): string {
    const cleanUrl = url.split('?')[0].split('#')[0];
    const langPattern = new RegExp(`^\\/(${SUPPORTED_LANGS.join('|')})(\\/$|$|\\/)`);
    const withoutLang = cleanUrl.replace(langPattern, '/');
    const path = withoutLang.replace(/^\/|\/$/g, '');

    if (!path) return 'meta.home';

    const segments = path
      .split('/')
      .map((segment) => segment.replace(/-([a-z])/g, (_, char) => char.toUpperCase()));

    return `meta.${segments.join('.')}`;
  }

  private generateMetaDefinitions(metadata: PageMetadata): MetaDefinition[] {
    const imageUrl = metadata.image.startsWith('/')
      ? `${environment.appUrl}${metadata.image}`
      : metadata.image;

    return [
      { name: 'description', content: metadata.description },
      { property: 'og:title', content: metadata.title },
      { property: 'og:description', content: metadata.description },
      { property: 'og:image', content: imageUrl },
      { property: 'og:url', content: metadata.url },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: environment.appName },
    ];
  }
}
