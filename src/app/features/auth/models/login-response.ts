export interface LoginResponse {
  userId: string;
  fullName: string;
  email: string;
  roles: string[];

  accessToken: string;
  refreshToken: string;

  expiresAt: string;
}