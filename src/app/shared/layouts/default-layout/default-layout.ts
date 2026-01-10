import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-default-layout',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './default-layout.html',
  styles: ``,
})
export class DefaultLayout {}
