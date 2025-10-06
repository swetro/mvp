import { ActivityDto } from './activity.dto';

export interface ParticipantDto {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  profilePictureUrl: string;
  age: number;
  ageCategory: string;
  country: string;
  countryAlpha2Code: string;
  countryAlpha3Code: string;
  status: string;
  isLeader: boolean;
  isCompleted: boolean;
  position: number;
  positionByAgeCategory: number;
  totalNumberActivities: number;
  totalDurationInSeconds: number;
  totalDistanceInMeters: number;
  totalSteps: number;
  totalAverageSpeedInMetersPerSecond: number;
  totalAveragePaceInMinutesPerKilometer: number;
  totalElevationGainInMeters: number;
  totalElevationLossInMeters: number;
  totalAverageHeartRateInBeatsPerMinute: number;
  totalKilocalories: number;
  pointsFromActivities: number;
  pointsFromChallenges: number;
  totalPoints: number;
  progress: number;
  activities: ActivityDto[];
}
