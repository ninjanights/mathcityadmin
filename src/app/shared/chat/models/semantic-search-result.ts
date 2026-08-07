export interface SemanticSearchResult {
  lessonId: string;

  sourceId?: string;

  lessonTitle: string;

  chunkTitle: string;

  content: string;

  chunkType: number;

  chunkIndex: number;

  score: number;
}