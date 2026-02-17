export interface AuthenticationResultDto {
  accessToken: string;
  refreshToken: string;
  accessTokenLifeTimeInMinutes: number;
  refreshTokenLifeTimeInMinutes: number;
}
