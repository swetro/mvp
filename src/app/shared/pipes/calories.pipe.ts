import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calories',
  standalone: true,
})
export class CaloriesPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null || isNaN(value)) {
      return '';
    }

    const roundedValue = Math.round(value);
    return `${roundedValue.toLocaleString()} kcal`;
  }
}
