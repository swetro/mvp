import { ChallengeStatus } from '../enums/challenge-status.enum';
import { ActivityType } from '../enums/activity-type.enum';

export interface ChallengeDto {
  id: number;
  leagueName: string;
  leagueSlug: string;
  status: ChallengeStatus;
  type: string;
  entryFee: number;
  currency: string;
  numberOfParticipants: number;
  startTime: string;
  endTime: string;
  goal: ChallengeGoal;
  content: ChallengeContent;
  currentUser?: ChallengeCurrentUserDto | null;
}

export interface ChallengeGoal {
  activityType: ActivityType;
  variable: string;
  condition: string;
  value: number;
  unit: string;
  valueInUnit: number;
}

export interface ChallengeContent {
  languageCode: string;
  title: string;
  description: string;
  goalDescription: string;
  ruleList: string[];
}

export interface ChallengeCurrentUserDto {
  isParticipating: boolean;
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
  calories: number;
  progress: number;
}
