import { Component, input, output } from '@angular/core';

import { LessonListResponse } from '../../models';

@Component({
  selector: 'app-lesson-card',
  standalone: true,
  templateUrl: './lesson-card.html',
})
export class LessonCard {
  lesson = input.required<LessonListResponse>();

  topicTitle = input<string>('Unknown topic');

  edit = output<LessonListResponse>();
  delete = output<LessonListResponse>();

  lessonTags = output<LessonListResponse>();

  lessonResources = output<LessonListResponse>();

  practiceQuestions = output<LessonListResponse>();

  difficultyLabel(level: number): string {
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
