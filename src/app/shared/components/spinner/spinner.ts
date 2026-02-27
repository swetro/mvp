import { Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  imports: [],
  templateUrl: './spinner.html',
  styles: ``,
})
export class Spinner {
  sizeClasses = input<string>('w-8 h-8');
  colorClasses = input<string>('text-blue-600');
}
