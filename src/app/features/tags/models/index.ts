export interface TagListResponse {
  id: string;
  name: string;
  slug: string;
}

export interface TagResponse {
  id: string;
  name: string;
  slug: string;
}

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name: string;
}