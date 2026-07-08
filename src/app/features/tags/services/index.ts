import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { Endpoints } from '../../../core/api/endpoints';
import { ApiResponse } from '../../auth/models/api-response';
import { CreateTagRequest, TagListResponse, TagResponse, UpdateTagRequest } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private readonly apiService = inject(ApiService);

  getTags(search?: string): Observable<ApiResponse<TagListResponse[]>> {
    const url = search
      ? `${Endpoints.tags.list}?search=${encodeURIComponent(search)}`
      : Endpoints.tags.list;

    return this.apiService.get<ApiResponse<TagListResponse[]>>(url);
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
