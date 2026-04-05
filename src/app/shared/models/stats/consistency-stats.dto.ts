export interface ConsistencyStatsDto {
  currentActiveWeeksStreak: number;
  longestActiveWeeksStreak: number;
  weeksWithGoalMet: number;
  totalWeeksInYear: number;
  weeklyGoalCompletionRate: number;
}
