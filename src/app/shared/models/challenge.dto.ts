export interface ChallengeDto {
  id: number;
  leagueName: string;
  leagueSlug: string;
  status: string;
  type: string;
  entryFee: number;
  currency: string;
  numberOfParticipants: number;
  startTime: string;
  endTime: string;
  goal: ChallengeGoal;
  content: ChallengeContent;
}

export interface ChallengeGoal {
  activityType: string;
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
