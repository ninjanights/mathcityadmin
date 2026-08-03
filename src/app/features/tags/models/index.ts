import { PagedResult } from "../../../shared/models";

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

export interface TagQuery {
  search?: string;
  page?: number;
  pageSize?: number;
}

export type TagPagedResult = PagedResult<TagListResponse>;