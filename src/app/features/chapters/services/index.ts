import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { Endpoints } from '../../../core/api/endpoints';
import { ApiResponse } from '../../auth/models/api-response';
import {
  ChapterListResponse,
  ChapterResponse,
  CreateChapterRequest,
  UpdateChapterRequest,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ChapterService {
  private readonly apiService = inject(ApiService);

  getChapters(search?: string): Observable<ApiResponse<ChapterListResponse[]>> {
    const url = search
      ? `${Endpoints.chapters.list}?search=${encodeURIComponent(search)}`
      : Endpoints.chapters.list;
    return this.apiService.get<ApiResponse<ChapterListResponse[]>>(url);
  }

  getChapterById(id: string): Observable<ApiResponse<ChapterResponse>> {
    return this.apiService.get<ApiResponse<ChapterResponse>>(Endpoints.chapters.getById(id));
  }

  createChapter(request: CreateChapterRequest): Observable<ApiResponse<ChapterResponse>> {
    return this.apiService.post<ApiResponse<ChapterResponse>>(Endpoints.chapters.create, request);
  }

  updateChapter(
    id: string,
    request: UpdateChapterRequest,
  ): Observable<ApiResponse<ChapterResponse>> {
    return this.apiService.put<ApiResponse<ChapterResponse>>(
      Endpoints.chapters.update(id),
      request,
    );
  }

  deleteChapter(id: string): Observable<void> {
    return this.apiService.delete<void>(Endpoints.chapters.delete(id));
  }
}
