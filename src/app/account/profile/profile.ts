import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [JsonPipe],
  templateUrl: './profile.html',
  styles: ``,
})
export class Profile {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;
}
