export interface LoginResponse {
  fullName: string;
  email: string;
  roles: string[];

  accessToken: string;
  refreshToken: string;

  expiresAt: string;
}
export interface RefreshTokenRequest {
    accessToken: string;
    refreshToken: string;
}