import { Component, input, output } from '@angular/core';

import { LessonListResponse } from '../../models';
import { TopicListResponse } from '../../../topics/models';

import { LessonCard } from '../lesson-card/lesson-card';

@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [LessonCard],
  templateUrl: './lesson-list.html',
})
export class LessonList {
  lessons = input.required<LessonListResponse[]>();
  topics = input<TopicListResponse[]>([]);

  edit = output<LessonListResponse>();
  delete = output<LessonListResponse>();

  lessonTags = output<LessonListResponse>();

  lessonResources = output<LessonListResponse>();

  practiceQuestions = output<LessonListResponse>();

  topicTitle(topicId: string): string {
    return this.topics().find((topic) => topic.id === topicId)?.title ?? 'Unknown topic';
  }
}
