import { Component, input, inject } from '@angular/core';
import { ActivityDto } from '../../models/activity/activity.dto';
import { DistancePipe } from '../../pipes/distance.pipe';
import { DurationPipe } from '../../pipes/duration.pipe';
import { PacePipe } from '../../pipes/pace.pipe';
import { ElevationPipe } from '../../pipes/elevation.pipe';
import { HeartRatePipe } from '../../pipes/heart-rate.pipe';
import { CaloriesPipe } from '../../pipes/calories.pipe';
import { DatePipe } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-activities-table',
  imports: [
    DistancePipe,
    DurationPipe,
    PacePipe,
    ElevationPipe,
    HeartRatePipe,
    CaloriesPipe,
    DatePipe,
    TranslatePipe,
  ],
  templateUrl: './activities-table.html',
  styles: ``,
})
export class ActivitiesTable {
  activitiesData = input.required<ActivityDto[]>();
  translateService = inject(TranslateService);

  // Icon paths
  durationIcon = './images/activity/duration.svg';
  distanceIcon = './images/activity/distance.svg';
  elevationIcon = './images/activity/elevation.svg';
  paceIcon = './images/activity/pace.svg';
  heartRateIcon = './images/activity/heart.svg';
  caloriesIcon = './images/activity/calories.svg';
  deviceIcon = './images/activity/device.svg';

  private activityTypes: Record<string, ActivityType> = {
    Running: {
      color: '#10b981', // green
      icon: './images/run.svg',
      newIcon: './images/run.svg',
    },
    Cycling: {
      color: '#3b82f6', // blue
      icon: './images/run.svg',
      newIcon: './images/run.svg',
    },
    Walking: {
      color: '#f59e0b', // amber
      icon: './images/run.svg',
      newIcon: './images/run.svg',
    },
    Swimming: {
      color: '#06b6d4', // cyan
      icon: './images/run.svg',
      newIcon: './images/run.svg',
    },
    TreadmillRunning: {
      color: '#8b5cf6', // purple
      icon: './images/run.svg',
      newIcon: './images/run.svg',
    },
    Other: {
      color: '#6b7280', // gray
      icon: './images/run.svg',
      newIcon: './images/run.svg',
    },
  };

  get dateFormat(): string {
    const lang = this.translateService.getCurrentLang();
    return lang === 'es' ? 'dd MMM yyyy, HH:mm' : 'MMM dd yyyy, h:mm a';
  }

  getActivityTypeColor(type: string): string {
    return this.activityTypes[type]?.color || this.activityTypes['Other'].color;
  }

  getActivityTypeIcon(type: string): string {
    return this.activityTypes[type]?.newIcon || this.activityTypes['Other'].newIcon;
  }
}

interface ActivityType {
  color: string;
  icon: string;
  newIcon: string;
}
//7 Feb 2026 10:03:26 AM
