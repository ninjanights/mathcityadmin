export enum ResourceType {
  Image = 1,
  Pdf = 3,
  Video = 2,
  Zip = 5,
}

export interface LessonResourceListResponse {
  id: string;
  title: string;
  resourceType: ResourceType;
    description : String;
  displayOrder: number;
}

export interface CreateLessonResourceRequest {
  lessonId: string;
  title: string;
  resourceType: ResourceType;
  displayOrder: number;
  description : String;
}

export interface UpdateLessonResourceRequest {
  title: string;
  resourceType: ResourceType;
  displayOrder: number;
    description : String;
}
