import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countryFlag',
  standalone: true,
})
export class CountryFlagPipe implements PipeTransform {
  transform(code: string): string {
    if (!code) {
      return '';
    }
    return `https://flagcdn.com/w20/${code.toLowerCase()}.webp`;
  }
}
