import { Injectable } from '@angular/core';
import { LoginResponse } from '../../features/auth/models/login-response';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'user';

  // Save login data
  setLogin(response: LoginResponse): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);

    localStorage.setItem(
      this.USER_KEY,
      JSON.stringify({
        userId: response.userId,
        fullName: response.fullName,
        email: response.email,
        roles: response.roles
      })
    );
  }

  // Access Token
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // User
  getUser() {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Logged in?
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  // Logout
  clear(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}