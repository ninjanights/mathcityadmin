import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/api/api.service';
import { Endpoints } from '../../../core/api/endpoints';
import { ApiResponse } from '../../auth/models/api-response';

import {
  CreateLessonResourceRequest,
  UpdateLessonResourceRequest,
  LessonResourceListResponse,
  LessonResourceResponse,
  LessonResourceQuery,
  LessonResourcePagedResult,
  MoveLessonResourceRequest,
} from '../models';


@Injectable({
  providedIn: 'root',
})
export class LessonResourceService {
  private readonly apiService = inject(ApiService);

  getLessonResources(
    query?: LessonResourceQuery
  ): Observable<ApiResponse<LessonResourcePagedResult>> {
    const params = new URLSearchParams();
    if (query?.lessonSlug) {
      params.set('lessonSlug', query.lessonSlug);
    }
    if (query?.search) {
      params.set('search', query.search);
    }
    if (query?.resourceType !== undefined) {
      params.set(
        'resourceType',
        query.resourceType.toString()
      );
    }
    if (query?.page) {
      params.set(
        'page',
        query.page.toString()
      );
    }
    if (query?.pageSize) {
      params.set(
        'pageSize',
        query.pageSize.toString()
      );
    }
    const url = params.toString()
      ? `${Endpoints.lessonResources.list}?${params.toString()}`
      : Endpoints.lessonResources.list;


    return this.apiService.get<
      ApiResponse<LessonResourcePagedResult>
    >(url);
  }



  getLessonResourceById(
    id: string
  ): Observable<ApiResponse<LessonResourceResponse>> {

    return this.apiService.get<ApiResponse<LessonResourceResponse>>(
      Endpoints.lessonResources.getById(id)
    );
  }



  createLessonResource(
    request: CreateLessonResourceRequest,
    file?: File
  ): Observable<ApiResponse<LessonResourceResponse>> {


    const formData = new FormData();


    formData.append(
      'lessonId',
      request.lessonId
    );


    formData.append(
      'title',
      request.title
    );


    formData.append(
      'resourceType',
      request.resourceType.toString()
    );


    formData.append(
      'description',
      request.description
    );


    if (file) {
      formData.append(
        'file',
        file
      );
    }


    return this.apiService.post<
      ApiResponse<LessonResourceResponse>
    >(
      Endpoints.lessonResources.create,
      formData
    );
  }



  updateLessonResource(
  id: string,
  request: UpdateLessonResourceRequest
): Observable<ApiResponse<LessonResourceResponse>> {

  const formData = new FormData();

  formData.append(
    'title',
    request.title
  );

  formData.append(
    'resourceType',
    request.resourceType.toString()
  );

  formData.append(
    'description',
    request.description
  );


  return this.apiService.put<
    ApiResponse<LessonResourceResponse>
  >(
    Endpoints.lessonResources.update(id),
    formData
  );
}

moveLessonResource(
  id: string,
  request: MoveLessonResourceRequest
): Observable<void> {

  return this.apiService.patch<void>(
    Endpoints.lessonResources.move(id),
    request
  );
}



  deleteLessonResource(
    id: string
  ): Observable<void> {

    return this.apiService.delete<void>(
      Endpoints.lessonResources.delete(id)
    );
  }


}