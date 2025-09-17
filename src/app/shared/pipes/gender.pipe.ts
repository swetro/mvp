import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender',
  standalone: true,
})
export class GenderPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }
    const lowerValue = value.toLowerCase();
    if (lowerValue === 'male') {
      return 'M';
    }
    if (lowerValue === 'female') {
      return 'F';
    }
    return '';
  }
}
