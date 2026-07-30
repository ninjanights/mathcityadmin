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

import { PagedResult } from '../../../shared/models';
import { TopicQuery } from '../../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private readonly apiService = inject(ApiService);

 getTopics(
  query: TopicQuery
): Observable<ApiResponse<PagedResult<TopicListResponse>>> {

  const params = new URLSearchParams();

  if (query.page)
    params.append('page', query.page.toString());

  if (query.pageSize)
    params.append('pageSize', query.pageSize.toString());

  if (query.search)
    params.append('search', query.search);

  if (query.chapterId)
    params.append('chapterId', query.chapterId);

  const url = `${Endpoints.topics.list}?${params.toString()}`;

  return this.apiService.get<
    ApiResponse<PagedResult<TopicListResponse>>
  >(url);
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
