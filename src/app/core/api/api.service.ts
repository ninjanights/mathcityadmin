import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = AppConfig.apiUrl;

  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }

  patch<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body);
  }
}
