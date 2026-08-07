import { SemanticSearchResult } from "./semantic-search-result";


export interface ChatResponse {
  answer: string;

  sessionId: string;

  sources: SemanticSearchResult[];
}