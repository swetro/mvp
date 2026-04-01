export interface GoogleLoginResultDto {
  // Unconfirmed-email path
  success?: boolean;
  message?: string;
  code?: string;
  details?: string;
  // Authenticated path
  accessToken?: string;
  refreshToken?: string;
  accessTokenLifeTimeInMinutes?: number;
  refreshTokenLifeTimeInMinutes?: number;
}
