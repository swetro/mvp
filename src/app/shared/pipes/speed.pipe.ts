import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'speed',
  standalone: true,
})
export class SpeedPipe implements PipeTransform {
  transform(value: number, measurementSystem = 'MetricSystem'): string {
    if (value == null || isNaN(value) || value === 0) {
      return measurementSystem === 'MetricSystem' ? '0.00 km/h' : '0.00 mph';
    }

    if (measurementSystem === 'MetricSystem') {
      const kmh = value * 3.6;
      return `${kmh.toFixed(2)} km/h`;
    } else {
      const mph = value * 2.23694;
      return `${mph.toFixed(2)} mph`;
    }
  }
}
