import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pace',
  standalone: true,
})
export class PacePipe implements PipeTransform {
  transform(value: number, measurementSystem = 'MetricSystem'): string {
    if (!value) {
      return measurementSystem === 'MetricSystem' ? '0:00/km' : '0:00/mi';
    }

    if (measurementSystem !== 'MetricSystem') {
      const kilometersPerMile = 1.60934;
      value *= kilometersPerMile;
    }

    let minutes = Math.floor(value);
    let seconds = Math.round((value - minutes) * 60);

    if (seconds === 60) {
      seconds = 0;
      minutes += 1;
    }

    const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const unit = measurementSystem === 'MetricSystem' ? 'km' : 'mi';

    return `${minutes}:${secondsString}/${unit}`;
  }
}
