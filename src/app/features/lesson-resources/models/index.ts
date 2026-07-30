export enum ResourceType {
  Text = 1,
  Pdf = 2,
}

export interface LessonResourceListResponse {
  id: string;
  title: string;
  resourceType: ResourceType;
  description: string;
  displayOrder: number;
}

export interface CreateLessonResourceRequest {
  lessonId: string;
  title: string;
  resourceType: ResourceType;
  displayOrder: number;
  description: string;
}

export interface UpdateLessonResourceRequest {
  title: string;
  resourceType: ResourceType;
  displayOrder: number;
  description: string;
}
