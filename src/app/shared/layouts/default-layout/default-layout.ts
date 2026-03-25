import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Toast } from '../../components/toast/toast';
import { MetaTagsService } from '../../services/meta-tags.service';

@Component({
  selector: 'app-default-layout',
  imports: [RouterOutlet, Header, Footer, Toast],
  templateUrl: './default-layout.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DefaultLayout {
  constructor() {
    inject(MetaTagsService).initRouteListener();
  }
}
