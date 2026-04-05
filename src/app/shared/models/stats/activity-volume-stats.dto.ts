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

  moMChangeNumberActivities?: number;
  moMChangeDurationInSeconds?: number;
  moMChangeDistanceInMeters?: number;
  moMChangeElevationGainInMeters?: number;
  moMChangeActiveKilocalories?: number;

  yoYChangeNumberActivities?: number;
  yoYChangeDurationInSeconds?: number;
  yoYChangeDistanceInMeters?: number;
  yoYChangeElevationGainInMeters?: number;
  yoYChangeActiveKilocalories?: number;
}
