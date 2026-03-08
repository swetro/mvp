import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Toast } from '../../components/toast/toast';

@Component({
  selector: 'app-default-layout',
  imports: [RouterOutlet, Header, Footer, Toast],
  templateUrl: './default-layout.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DefaultLayout {}
