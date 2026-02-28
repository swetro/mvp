import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-no-data-view',
  imports: [TranslatePipe],
  templateUrl: './no-data-view.html',
  styles: ``,
})
export class NoDataView {
  title = input<string>('shared.noDataView.title');
  icon = input<'calendar' | 'search'>('search');
}
