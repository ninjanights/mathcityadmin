import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { Endpoints } from '../../../core/api/endpoints';
import { ApiResponse } from '../../auth/models/api-response';
import { CreateTagRequest, TagListResponse, TagResponse, UpdateTagRequest } from '../models';
import { PagedResult } from '../../../shared/models';

export interface TagQuery {
  search?: string;
  page?: number;
  pageSize?: number;
}

export type TagPagedResult = PagedResult<TagListResponse>;
@Injectable({
  providedIn: 'root',
})
export class TagService {
  private readonly apiService = inject(ApiService);

  getTags(query?: TagQuery): Observable<ApiResponse<TagPagedResult>> {
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
      ? `${Endpoints.tags.list}?${params.toString()}`
      : Endpoints.tags.list;

    return this.apiService.get<ApiResponse<TagPagedResult>>(url);
  }

  getTagById(id: string): Observable<ApiResponse<TagResponse>> {
    return this.apiService.get<ApiResponse<TagResponse>>(Endpoints.tags.getById(id));
  }

  createTag(request: CreateTagRequest): Observable<ApiResponse<TagResponse>> {
    return this.apiService.post<ApiResponse<TagResponse>>(Endpoints.tags.create, request);
  }

  updateTag(id: string, request: UpdateTagRequest): Observable<ApiResponse<TagResponse>> {
    return this.apiService.put<ApiResponse<TagResponse>>(Endpoints.tags.update(id), request);
  }

  deleteTag(id: string): Observable<void> {
    return this.apiService.delete<void>(Endpoints.tags.delete(id));
  }
}
