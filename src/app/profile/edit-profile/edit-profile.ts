import { Component, effect, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  imports: [JsonPipe],
  templateUrl: './edit-profile.html',
  styles: ``,
})
export class EditProfile {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;
}
