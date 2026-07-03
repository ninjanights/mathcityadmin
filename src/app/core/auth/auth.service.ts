import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';

import { LoginRequest } from '../../features/auth/models/login-request';
import { LoginResponse } from '../../features/auth/models/login-response';
import { ApiResponse } from '../../features/auth/models/api-response';
import { Endpoints } from '../api/endpoints';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>(Endpoints.auth.login, request);
  }
}
