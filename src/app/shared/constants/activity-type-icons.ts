import { ActivityType } from '../enums/activity-type.enum';
import { ActivityTypeIcon } from '../models/activity/activity-type-icon.model';

export const ACTIVITY_TYPE_ICONS: ActivityTypeIcon[] = [
  {
    type: ActivityType.Other,
    src: '/images/activity/other.svg',
    srcWhite: '/images/activity/other-white.svg',
  },
  {
    type: ActivityType.Running,
    src: '/images/activity/running.svg',
    srcWhite: '/images/activity/running-white.svg',
    ogImage: '/images/open-graph/running.webp',
  },
  {
    type: ActivityType.Swimming,
    src: '/images/activity/swimming.svg',
  },
  {
    type: ActivityType.Cycling,
    src: '/images/activity/cycling.svg',
    srcWhite: '/images/activity/cycling-white.svg',
    ogImage: '/images/open-graph/cycling.webp',
  },
  {
    type: ActivityType.TreadmillRunning,
    src: '/images/activity/treadmill.svg',
    ogImage: '/images/open-graph/treadmillrunning.webp',
  },
  {
    type: ActivityType.Walking,
    src: '/images/activity/walking.svg',
    srcWhite: '/images/activity/walking-white.svg',
    ogImage: '/images/open-graph/walking.webp',
  },
  {
    type: ActivityType.IndoorCycling,
    src: '/images/activity/indoor-cycling.svg',
  },
  {
    type: ActivityType.Multisport,
    src: '/images/activity/other.svg',
    srcWhite: '/images/activity/other-white.svg',
    ogImage: '/images/open-graph/multisport.webp',
  },
];
