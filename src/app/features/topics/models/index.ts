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
}

export interface UpdateTopicRequest {
  title: string;
}

export interface MoveTopicRequest {
  position: number;
}