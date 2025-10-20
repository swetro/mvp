import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-default-layout',
  imports: [RouterOutlet, Navbar],
  templateUrl: './default-layout.html',
  styles: ``,
})
export class DefaultLayout {}
