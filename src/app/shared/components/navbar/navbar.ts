import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './navbar.html',
  styles: ``,
})
export class Navbar {}
