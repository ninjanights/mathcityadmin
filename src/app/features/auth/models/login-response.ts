export interface LoginResponse {
  userId: string;
  fullName: string;
  email: string;
  role: string;

  accessToken: string;
  refreshToken: string;

  expiresAt: string;
}