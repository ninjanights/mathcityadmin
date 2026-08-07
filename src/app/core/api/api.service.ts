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

  post<T>(
    endpoint: string,
    body: unknown,
    options: object = {}
  ): Observable<T> {
    return this.http.post<T>(
      `${this.baseUrl}${endpoint}`,
      body,
      {
        withCredentials: true,
        ...options,
      }
    );
  }

  get<T>(
    endpoint: string,
    options: object = {}
  ): Observable<T> {
    return this.http.get<T>(
      `${this.baseUrl}${endpoint}`,
      {
        withCredentials: true,
        ...options,
      }
    );
  }

  put<T>(
    endpoint: string,
    body: unknown,
    options: object = {}
  ): Observable<T> {
    return this.http.put<T>(
      `${this.baseUrl}${endpoint}`,
      body,
      {
        withCredentials: true,
        ...options,
      }
    );
  }

  delete<T>(
    endpoint: string,
    options: object = {}
  ): Observable<T> {
    return this.http.delete<T>(
      `${this.baseUrl}${endpoint}`,
      {
        withCredentials: true,
        ...options,
      }
    );
  }

  patch<T>(
    endpoint: string,
    body: unknown,
    options: object = {}
  ): Observable<T> {
    return this.http.patch<T>(
      `${this.baseUrl}${endpoint}`,
      body,
      {
        withCredentials: true,
        ...options,
      }
    );
  }
}