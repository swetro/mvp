import { ActivityDto } from './activity/activity.dto';

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
  numberOfActivities: number;
  durationInSeconds: number;
  distanceInMeters: number;
  steps: number;
  averageSpeedInMetersPerSecond: number;
  averagePaceInMinutesPerKilometer: number;
  elevationGainInMeters: number;
  elevationLossInMeters: number;
  averageHeartRateInBeatsPerMinute: number;
  calories: number;
  pointsFromActivities: number;
  pointsFromChallenges: number;
  totalPoints: number;
  progress: number;
  activities: ActivityDto[];
}
