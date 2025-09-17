import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null || isNaN(value)) {
      return '';
    }

    let days = value / 86400;
    let hours = (value % 86400) / 3600;
    let mins = (value % 3600) / 60;
    let secs = value % 60;

    days = Math.trunc(days);
    hours = Math.trunc(hours);
    mins = Math.trunc(mins);
    secs = Math.trunc(secs);

    if (!days && !hours && !mins && !secs) {
      return '0';
    }
    if (days) {
      if (hours) {
        if (mins) {
          return `${days}d ${hours}h ${mins}m`;
        } else {
          return `${days}d ${hours}h`;
        }
      } else {
        if (mins) {
          return `${days}d ${mins}m`;
        } else {
          return secs ? `${days}d ${secs}s` : `${days}d`;
        }
      }
    } else {
      if (hours) {
        if (mins) {
          return `${hours}h ${mins}m`;
        } else {
          return secs ? `${hours}h ${secs}s` : `${hours}h`;
        }
      } else {
        if (mins) {
          return secs ? `${mins}m ${secs}s` : `${mins}m`;
        } else {
          return secs ? `${secs}s` : '';
        }
      }
    }
  }
}
