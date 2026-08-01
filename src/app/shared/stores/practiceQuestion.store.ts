import { PracticeQuestionListResponse, PracticeQuestionResponse } from './../../features/practice-questions/models/index';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PracticeQuestionStore {
  practiceQuestions = signal<PracticeQuestionListResponse[]>([]);
  selectedPracticeQuestion = signal<PracticeQuestionResponse | null>(null);

  setPracticeQuestions(practiceQuestions: PracticeQuestionListResponse[]) {
    this.practiceQuestions.set(practiceQuestions);
  }

  setSelectedPracticeQuestion(practiceQuestion: PracticeQuestionResponse | null): void {
    this.selectedPracticeQuestion.set(practiceQuestion);
  }

  clear() {
    this.practiceQuestions.set([]);
    this.selectedPracticeQuestion.set(null);
  }
}
