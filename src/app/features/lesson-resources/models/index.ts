export enum ResourceType {
  Image = 0,
  Pdf = 1,
  Video = 2,
  Zip = 3,
}

export interface LessonResourceListResponse {
  id: string;
  title: string;
  resourceType: ResourceType;
  displayOrder: number;
}

export interface CreateLessonResourceRequest {
  lessonId: string;
  title: string;
  resourceType: ResourceType;
  displayOrder: number;
}

export interface UpdateLessonResourceRequest {
  title: string;
  resourceType: ResourceType;
  displayOrder: number;
}
