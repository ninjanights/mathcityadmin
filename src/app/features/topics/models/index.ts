export interface TopicListResponse {
  id: string;
  chapterId: string;
  title: string;
  displayOrder: number;
}

export interface TopicResponse {
  id: string;
  chapterId: string;
  title: string;
  displayOrder: number;
}

export interface CreateTopicRequest {
  chapterId: string;
  title: string;
  displayOrder: number;
}

export interface UpdateTopicRequest {
  title: string;
  displayOrder: number;
}

export interface MoveTopicRequest {
  position: number;
}