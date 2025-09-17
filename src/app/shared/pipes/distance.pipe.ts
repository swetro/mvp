import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance',
  standalone: true,
})
export class DistancePipe implements PipeTransform {
  transform(value: number, measurementSystem = 'MetricSystem'): string {
    if (value == null || isNaN(value)) {
      return '';
    }

    let convertedValue: number;
    let unitLabel: string;

    if (measurementSystem === 'MetricSystem') {
      convertedValue = value / 1000;
      unitLabel = 'km';
    } else {
      convertedValue = value / 1609.34;
      unitLabel = 'mi';
    }

    return `${convertedValue.toFixed(2)} ${unitLabel}`;
  }
}
