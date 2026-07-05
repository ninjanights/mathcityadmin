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

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private readonly apiService = inject(ApiService);

  getSubjects(search?: string): Observable<ApiResponse<SubjectListResponse[]>> {
    const url = search ? `${Endpoints.subjects.list}?search=${search}`
     : Endpoints.subjects.list;
    return this.apiService.get<ApiResponse<SubjectListResponse[]>>(url);
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
}
