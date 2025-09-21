import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'completedChallenge',
  standalone: true,
})
export class CompletedChallengePipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? '🏅' : '';
  }
}
