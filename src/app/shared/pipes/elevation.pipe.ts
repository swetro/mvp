import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'elevation',
  standalone: true,
})
export class ElevationPipe implements PipeTransform {
  transform(value: number, measurementSystem = 'MetricSystem'): string {
    if (value == null || isNaN(value)) {
      return '';
    }

    if (measurementSystem === 'MetricSystem') {
      if (value >= 1000) {
        const elevationInKilometers = (value / 1000).toFixed(1);
        return `${elevationInKilometers} km`;
      } else {
        const elevationInMeters = value % 1 === 0 ? value.toString() : value.toFixed(1);
        return `${elevationInMeters} m`;
      }
    } else {
      const metersInOneMile = 1609.34;
      const metersInOneFoot = 0.3048;
      if (value >= metersInOneMile) {
        const elevationInMiles = (value / metersInOneMile).toFixed(1);
        return `${elevationInMiles} mi`;
      } else {
        const elevationInFeet = (value / metersInOneFoot).toFixed(0);
        return `${elevationInFeet} ft`;
      }
    }
  }
}
