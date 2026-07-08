import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { Endpoints } from '../../../core/api/endpoints';
import { ApiResponse } from '../../auth/models/api-response';
import {
  CreateTopicRequest,
  MoveTopicRequest,
  TopicListResponse,
  TopicResponse,
  UpdateTopicRequest,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private readonly apiService = inject(ApiService);

  getTopics(search?: string): Observable<ApiResponse<TopicListResponse[]>> {
    const url = search
      ? `${Endpoints.topics.list}?search=${encodeURIComponent(search)}`
      : Endpoints.topics.list;

    return this.apiService.get<ApiResponse<TopicListResponse[]>>(url);
  }

  getTopicById(id: string): Observable<ApiResponse<TopicResponse>> {
    return this.apiService.get<ApiResponse<TopicResponse>>(Endpoints.topics.getById(id));
  }

  createTopic(request: CreateTopicRequest): Observable<ApiResponse<TopicResponse>> {
    return this.apiService.post<ApiResponse<TopicResponse>>(Endpoints.topics.create, request);
  }

  updateTopic(id: string, request: UpdateTopicRequest): Observable<ApiResponse<TopicResponse>> {
    return this.apiService.put<ApiResponse<TopicResponse>>(Endpoints.topics.update(id), request);
  }

  moveTopic(id: string, request: MoveTopicRequest): Observable<void> {
    return this.apiService.patch<void>(Endpoints.topics.move(id), request);
  }

  deleteTopic(id: string): Observable<void> {
    return this.apiService.delete<void>(Endpoints.topics.delete(id));
  }

  getLessonsByTopic(id: string): Observable<ApiResponse<any>> {
    return this.apiService.get<ApiResponse<any>>(Endpoints.topics.lessons(id));
  }
}
