import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/api/api.service';
import { Endpoints } from '../../../core/api/endpoints';
import { ApiResponse } from '../../auth/models/api-response';

import {
  CreateLessonTagRequest,
  LessonTagResponse,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class LessonTagService {
  private readonly apiService = inject(ApiService);



  




  getLessonTags(
    lessonId: string,
  ): Observable<ApiResponse<LessonTagResponse[]>> {
    return this.apiService.get<ApiResponse<LessonTagResponse[]>>(
      Endpoints.lessons.tags(lessonId),
    );
  }

  addLessonTag(
    lessonId: string,
    request: CreateLessonTagRequest,
  ): Observable<ApiResponse<LessonTagResponse>> {
    return this.apiService.post<ApiResponse<LessonTagResponse>>(
      Endpoints.lessons.addTag(lessonId),
      request,
    );
  }

  deleteLessonTag(
    lessonId: string,
    tagId: string,
  ): Observable<void> {
    return this.apiService.delete<void>(
      Endpoints.lessons.removeTag(lessonId, tagId),
    );
  }

}