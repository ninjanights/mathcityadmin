import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/api/api.service';
import { Endpoints } from '../../../core/api/endpoints';
import { ApiResponse } from '../../auth/models/api-response';
import {
  CreateLessonResourceRequest,
  LessonResourceListResponse,
  UpdateLessonResourceRequest,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class LessonResourceService {
  private readonly apiService = inject(ApiService);

  getByLesson(lessonId: string): Observable<ApiResponse<LessonResourceListResponse[]>> {
    return this.apiService.get<ApiResponse<LessonResourceListResponse[]>>(
      Endpoints.lessons.resources(lessonId),
    );
  }

  create(
    request: CreateLessonResourceRequest,
    file: File,
  ): Observable<ApiResponse<LessonResourceListResponse>> {
    const formData = new FormData();

    formData.append('lessonId', request.lessonId);
    formData.append('title', request.title);
    formData.append('resourceType', request.resourceType.toString());
    formData.append('displayOrder', request.displayOrder.toString());
    formData.append('file', file);

    return this.apiService.post<ApiResponse<LessonResourceListResponse>>(
      Endpoints.lessonResources.create,
      formData,
    );
  }

  update(id: string, request: UpdateLessonResourceRequest): Observable<ApiResponse<LessonResourceListResponse>> {
    const formData = new FormData();

    formData.append('title', request.title);
    formData.append('resourceType', request.resourceType.toString());
    formData.append('displayOrder', request.displayOrder.toString());

    return this.apiService.put<ApiResponse<LessonResourceListResponse>>(
      Endpoints.lessonResources.update(id),
      formData,
    );
  }

  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(Endpoints.lessonResources.delete(id));
  }
}
