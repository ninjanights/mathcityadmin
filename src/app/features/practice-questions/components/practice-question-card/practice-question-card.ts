import { Component, input, output } from '@angular/core';

import { PracticeQuestionListResponse } from '../../models';

@Component({
  selector: 'app-practice-question-card',
  standalone: true,
  templateUrl: './practice-question-card.html',
})
export class PracticeQuestionCard {
  question = input.required<PracticeQuestionListResponse>();

  edit = output<PracticeQuestionListResponse>();
  delete = output<PracticeQuestionListResponse>();

  moveUp = output<PracticeQuestionListResponse>();
  moveDown = output<PracticeQuestionListResponse>();

  difficultyLabel(level?: number): string {
    switch (level) {
      case 1:
        return 'Beginner';
      case 2:
        return 'Intermediate';
      case 3:
        return 'Advanced';
      default:
        return 'Unknown';
    }
  }
}