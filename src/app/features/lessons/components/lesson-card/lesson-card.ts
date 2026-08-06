import { Component, input, output } from '@angular/core';

import { DatePipe } from '@angular/common';
import { LessonListResponse } from '../../models';

@Component({
  selector: 'app-lesson-card',
  standalone: true,
   imports: [DatePipe],
  templateUrl: './lesson-card.html',
})
export class LessonCard {
  lesson = input.required<LessonListResponse>();

  topicTitle = input<string>('Unknown topic');

  edit = output<LessonListResponse>();
  delete = output<LessonListResponse>();
generateEmbedding = output<LessonListResponse>();
  lessonTags = output<LessonListResponse>();
  lessonResources = output<LessonListResponse>();
  practiceQuestions = output<LessonListResponse>();
  moveUp = output<LessonListResponse>();
  moveDown = output<LessonListResponse>();

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
