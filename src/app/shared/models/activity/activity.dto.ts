import { ActivityType } from '../../enums/activity-type.enum';

export interface ActivityDto {
  id: string;
  type: ActivityType;
  name: string;
  startTime: Date;
  endTime: Date;
  startTimeUtc: Date;
  endTimeUtc: Date;
  durationInSeconds: number;
  distanceInMeters: number;
  steps: number;
  averageSpeedInMetersPerSecond: number;
  averagePaceInMinutesPerKilometer: number;
  totalElevationGainInMeters: number;
  totalElevationLossInMeters: number;
  averageHeartRateInBeatsPerMinute: number;
  activeKilocalories: number;
  points: number;
  deviceName: string;
}
