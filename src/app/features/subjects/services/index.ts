import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { Endpoints } from '../../../core/api/endpoints';
import {
  CreateSubjectRequest,
  SubjectListResponse,
  SubjectResponse,
  UpdateSubjectRequest,
} from '../models';
import { ApiResponse } from '../../auth/models/api-response';
import { PagedResult } from '../../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private readonly apiService = inject(ApiService);

  getSubjects(query?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }): Observable<ApiResponse<PagedResult<SubjectListResponse>>> {
    const params = new URLSearchParams();

    if (query?.search) {
      params.set('search', query.search);
    }
    if (query?.page) {
      params.set('page', query.page.toString());
    }
    if (query?.pageSize) {
      params.set('pageSize', query.pageSize.toString());
    }

    const url = params.toString()
      ? `${Endpoints.subjects.list}?${params.toString()}`
      : Endpoints.subjects.list;

    return this.apiService.get<ApiResponse<PagedResult<SubjectListResponse>>>(url);
  }

  getSubjectById(id: string): Observable<ApiResponse<SubjectResponse>> {
    return this.apiService.get<ApiResponse<SubjectResponse>>(Endpoints.subjects.getById(id));
  }

  createSubject(request: CreateSubjectRequest): Observable<ApiResponse<SubjectResponse>> {
    return this.apiService.post<ApiResponse<SubjectResponse>>(Endpoints.subjects.create, request);
  }

  updateSubject(
    id: string,
    request: UpdateSubjectRequest,
  ): Observable<ApiResponse<SubjectResponse>> {
    return this.apiService.put<ApiResponse<SubjectResponse>>(
      Endpoints.subjects.update(id),
      request,
    );
  }

  deleteSubject(id: string): Observable<void> {
    return this.apiService.delete<void>(Endpoints.subjects.delete(id));
  }

  moveSubject(id: string, direction: 'Up' | 'Down'): Observable<void> {
    return this.apiService.patch<void>(Endpoints.subjects.move(id), { direction });
  }
}
