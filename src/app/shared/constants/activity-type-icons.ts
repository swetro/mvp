import { ActivityType } from '../enums/activity-type.enum';
import { ActivityTypeIcon } from '../models/activity/activity-type-icon.model';

export const ACTIVITY_TYPE_ICONS: ActivityTypeIcon[] = [
  {
    type: ActivityType.Other,
    src: '/images/activity/other.svg',
  },
  {
    type: ActivityType.Running,
    src: '/images/activity/running.svg',
  },
  {
    type: ActivityType.Swimming,
    src: '/images/activity/swimming.svg',
  },
  {
    type: ActivityType.Cycling,
    src: '/images/activity/cycling.svg',
  },
  {
    type: ActivityType.TreadmillRunning,
    src: '/images/activity/treadmill.svg',
  },
  {
    type: ActivityType.Walking,
    src: '/images/activity/walking.svg',
  },
  {
    type: ActivityType.IndoorCycling,
    src: '/images/activity/indoor-cycling.svg',
  },
  {
    type: ActivityType.Multisport,
    src: '/images/activity/other.svg',
  },
];
