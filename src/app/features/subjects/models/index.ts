// Requests

export interface CreateSubjectRequest {
  name: string;
  description?: string;
  icon?: string;
  color: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface UpdateSubjectRequest {
  name: string;
  description?: string;
  icon?: string;
  color: string;
  isPublished: boolean;
}

// Responses

export interface SubjectListResponse {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color: string;
  description?: string;
  isPublished: boolean;
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
