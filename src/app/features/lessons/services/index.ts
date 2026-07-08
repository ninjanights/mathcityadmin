import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/api/api.service';
import { Endpoints } from '../../../core/api/endpoints';
import { ApiResponse } from '../../auth/models/api-response';

import {
  CreateLessonRequest,
  LessonListResponse,
  LessonResponse,
  MoveLessonRequest,
  PagedResult,
  UpdateLessonRequest,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private readonly apiService = inject(ApiService);

  getLessons(query?: {
    search?: string;
    topicId?: string;
    difficulty?: number;
    published?: boolean;
    tag?: string;
    page?: number;
    pageSize?: number;
  }): Observable<ApiResponse<PagedResult<LessonListResponse>>> {
    const params = new URLSearchParams();

    if (query?.search) {
      params.set('search', query.search);
    }

    if (query?.topicId) {
      params.set('topicId', query.topicId);
    }

    if (query?.difficulty !== undefined) {
      params.set('difficulty', query.difficulty.toString());
    }

    if (query?.published !== undefined) {
      params.set('published', query.published.toString());
    }

    if (query?.tag) {
      params.set('tag', query.tag);
    }

    if (query?.page) {
      params.set('page', query.page.toString());
    }

    if (query?.pageSize) {
      params.set('pageSize', query.pageSize.toString());
    }

    const url = params.toString()
      ? `${Endpoints.lessons.list}?${params.toString()}`
      : Endpoints.lessons.list;

    return this.apiService.get<ApiResponse<PagedResult<LessonListResponse>>>(url);
  }

  getLessonById(id: string): Observable<ApiResponse<LessonResponse>> {
    return this.apiService.get<ApiResponse<LessonResponse>>(Endpoints.lessons.getById(id));
  }

  createLesson(request: CreateLessonRequest): Observable<ApiResponse<LessonResponse>> {
    return this.apiService.post<ApiResponse<LessonResponse>>(Endpoints.lessons.create, request);
  }

  updateLesson(id: string, request: UpdateLessonRequest): Observable<ApiResponse<LessonResponse>> {
    return this.apiService.put<ApiResponse<LessonResponse>>(Endpoints.lessons.update(id), request);
  }

  moveLesson(id: string, request: MoveLessonRequest): Observable<void> {
    return this.apiService.patch<void>(Endpoints.lessons.move(id), request);
  }

  deleteLesson(id: string): Observable<void> {
    return this.apiService.delete<void>(Endpoints.lessons.delete(id));
  }

  getResourcesByLesson(lessonId: string): Observable<ApiResponse<any>> {
    return this.apiService.get<ApiResponse<any>>(Endpoints.lessons.resources(lessonId));
  }

  getPracticeQuestionsByLesson(lessonId: string): Observable<ApiResponse<any>> {
    return this.apiService.get<ApiResponse<any>>(Endpoints.lessons.practiceQuestions(lessonId));
  }

  getTagsByLesson(lessonId: string): Observable<ApiResponse<any>> {
    return this.apiService.get<ApiResponse<any>>(Endpoints.lessons.tags(lessonId));
  }

  addTagToLesson(lessonId: string, request: { tagId: string }): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(Endpoints.lessons.addTag(lessonId), request);
  }

  removeTagFromLesson(lessonId: string, tagId: string): Observable<void> {
    return this.apiService.delete<void>(Endpoints.lessons.removeTag(lessonId, tagId));
  }
}
