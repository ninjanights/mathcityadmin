import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/api/api.service';
import { Endpoints } from '../../../core/api/endpoints';
import { ApiResponse } from '../../auth/models/api-response';

import {
  CreatePracticeQuestionRequest,
  UpdatePracticeQuestionRequest,
  PracticeQuestionListResponse,
  PracticeQuestionResponse,
  StudentPracticeQuestionResponse,
  PracticeQuestionSubmissionResponse,
  SubmitPracticeQuestionsRequest,
  PracticeQuestionQuery,
  PracticeQuestionPagedResult,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class PracticeQuestionService {
  private readonly apiService = inject(ApiService);

  getPracticeQuestions(
    query?: PracticeQuestionQuery
  ): Observable<ApiResponse<PracticeQuestionPagedResult>> {

    const params = new URLSearchParams();

    if (query?.lessonSlug) {
      params.set('lessonSlug', query.lessonSlug);
    }

    if (query?.search) {
      params.set('search', query.search);
    }

    if (query?.difficulty !== undefined) {
      params.set('difficulty', query.difficulty.toString());
    }

    if (query?.page) {
      params.set('page', query.page.toString());
    }

    if (query?.pageSize) {
      params.set('pageSize', query.pageSize.toString());
    }

    const url = params.toString()
      ? `${Endpoints.practiceQuestions.list}?${params.toString()}`
      : Endpoints.practiceQuestions.list;

    return this.apiService.get<ApiResponse<PracticeQuestionPagedResult>>(url);
  }

  getPracticeQuestionById(
    id: string
  ): Observable<ApiResponse<PracticeQuestionResponse>> {
    return this.apiService.get<ApiResponse<PracticeQuestionResponse>>(
      Endpoints.practiceQuestions.getById(id)
    );
  }

  createPracticeQuestion(
    request: CreatePracticeQuestionRequest
  ): Observable<ApiResponse<PracticeQuestionResponse>> {
    return this.apiService.post<ApiResponse<PracticeQuestionResponse>>(
      Endpoints.practiceQuestions.create,
      request
    );
  }

  updatePracticeQuestion(
    id: string,
    request: UpdatePracticeQuestionRequest
  ): Observable<ApiResponse<PracticeQuestionResponse>> {
    return this.apiService.put<ApiResponse<PracticeQuestionResponse>>(
      Endpoints.practiceQuestions.update(id),
      request
    );
  }

  movePracticeQuestion(
    id: string,
    direction: 'Up' | 'Down'
  ): Observable<void> {
    return this.apiService.patch<void>(
      Endpoints.practiceQuestions.move(id),
      { direction }
    );
  }

  deletePracticeQuestion(id: string): Observable<void> {
    return this.apiService.delete<void>(
      Endpoints.practiceQuestions.delete(id)
    );
  }

  submitQuestions(
    request: SubmitPracticeQuestionsRequest
  ): Observable<ApiResponse<PracticeQuestionSubmissionResponse>> {
    return this.apiService.post<ApiResponse<PracticeQuestionSubmissionResponse>>(
      Endpoints.practiceQuestions.submit,
      request
    );
  }

  getPracticeQuestionsByLesson(
    lessonId: string
  ): Observable<ApiResponse<StudentPracticeQuestionResponse[]>> {
    return this.apiService.get<ApiResponse<StudentPracticeQuestionResponse[]>>(
      Endpoints.practiceQuestions.byLesson(lessonId)
    );
  }
}