import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameInitials',
  standalone: true,
})
export class NameInitialsPipe implements PipeTransform {
  transform(value: string): string {
    if (!value || !value.trim()) {
      return '';
    }

    const parts = value.trim().split(/\s+/);
    const firstInitial = parts[0]?.charAt(0).toUpperCase() ?? '';
    const lastInitial = parts.length > 1 ? (parts[1]?.charAt(0).toUpperCase() ?? '') : '';

    return `${firstInitial}${lastInitial}`;
  }
}
