export interface JoinChallengeDto {
  challengeId: number;
  gender?: string;
  birthDate?: string | null;
  countryAlpha3Code?: string;
}
