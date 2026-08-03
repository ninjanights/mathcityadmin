import { PagedResult } from '../../chapters/models';
export enum ResourceType {
  Text = 1,
  Pdf = 2,
}

export interface LessonResourceListResponse {
  id: string;

  title: string;

  resourceType: ResourceType | 'Text' | 'Pdf';

  description?: string;

  displayOrder: number;
}

export interface LessonResourceResponse {
  id: string;
  lessonId: string;
  title: string;
  url: string;
  description?: string;
  resourceType:   ResourceType;
  displayOrder: number;
}

export interface CreateLessonResourceRequest {
  lessonId: string;
  title: string;
  resourceType: ResourceType;
  description: string;
}

export interface UpdateLessonResourceRequest {
  title: string;

  description: string;

  resourceType: ResourceType;
}

export interface MoveLessonResourceRequest {
  direction: 'Up' | 'Down';
}

export interface LessonResourceQuery {
  lessonSlug?: string;

  search?: string;

  resourceType?: ResourceType;

  page?: number;

  pageSize?: number;
}

export type LessonResourcePagedResult = PagedResult<LessonResourceListResponse>;
