export interface ActivityVolumeStatsDto {
  year: number;
  month?: number;
  weekOfYear?: number;
  activityType: string;
  totalNumberActivities: number;
  totalDurationInSeconds: number;
  totalDistanceInMeters: number;
  totalActiveKilocalories: number;
  totalElevationGainInMeters: number;
}
