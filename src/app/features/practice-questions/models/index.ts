import { PagedResult } from "../../chapters/models";
export interface PracticeQuestionListResponse {
  id: string;
  question: string;
  difficulty?: number;
  displayOrder: number;
}

export interface PracticeQuestionResponse {
  id: string;
  lessonId: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: number;
  explanation: string;
  difficulty: number;
  displayOrder: number;
}

export interface StudentPracticeQuestionResponse {
  id: string;
  lessonId: string;

  question: string;

  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;

  difficulty: number;
  displayOrder: number;
}

export interface CreatePracticeQuestionRequest {
  lessonId: string;

  question: string;

  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;

  correctAnswer: number;
  explanation: string;

  difficulty: number;
}

export interface UpdatePracticeQuestionRequest extends CreatePracticeQuestionRequest {}

export interface MovePracticeQuestionRequest {
  direction: 'Up' | 'Down';
}

export interface SubmitPracticeQuestionAnswer {
  questionId: string;
  selectedAnswer: number;
}

export interface SubmitPracticeQuestionsRequest {
  answers: SubmitPracticeQuestionAnswer[];
}

export interface PracticeQuestionSubmissionResponse {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
}

export interface PracticeQuestionQuery {
  lessonSlug?: string;

  search?: string;
  difficulty?: number;

  page?: number;
  pageSize?: number;
}

export type PracticeQuestionPagedResult = PagedResult<PracticeQuestionListResponse>;
