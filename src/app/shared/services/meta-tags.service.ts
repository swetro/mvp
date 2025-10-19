import { inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
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

@Injectable({
  providedIn: 'root',
})
export class MetaTagsService {
  titleService = inject(Title);
  MetaService = inject(Meta);

  updateMetaTags(metadata: Partial<PageMetadata>) {
    const metaInfo = { ...defaultMetadata, ...metadata };
    const tags = this.generateMetaDefinitions(metaInfo);
    tags.forEach((tag) => this.MetaService.updateTag(tag));
    this.titleService.setTitle(metaInfo.title);
  }

  private generateMetaDefinitions(metadata: PageMetadata): MetaDefinition[] {
    return [
      { name: 'description', content: metadata.description },
      { property: 'og:title', content: metadata.title },
      { property: 'og:description', content: metadata.description },
      { property: 'og:image', content: metadata.image },
      { property: 'og:url', content: metadata.url },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: environment.appName },
    ];
  }
}
