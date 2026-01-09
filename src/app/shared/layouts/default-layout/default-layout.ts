import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-default-layout',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './default-layout.html',
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
  `,
})
export class DefaultLayout {}
