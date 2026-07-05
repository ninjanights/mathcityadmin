// Requests

export interface CreateSubjectRequest {
  name: string;
  description?: string;
  icon?: string;
  color: string;
  displayOrder: number;
}

export interface UpdateSubjectRequest {
  name: string;
  description?: string;
  icon?: string;
  color: string;
  displayOrder: number;
  isPublished: boolean;
}

// Responses

export interface SubjectListResponse {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color: string;
}

export interface SubjectResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  displayOrder: number;
  isPublished: boolean;
}
