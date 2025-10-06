import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'heartRate',
  standalone: true,
})
export class HeartRatePipe implements PipeTransform {
  transform(value: number): string {
    if (value == null || isNaN(value)) {
      return '';
    }

    return `${Math.round(value)} bpm`;
  }
}
