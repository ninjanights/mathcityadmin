import { Injectable, signal } from '@angular/core';
import { LessonListResponse, LessonResponse } from '../../features/lessons/models';

@Injectable({
  providedIn: 'root',
})
export class LessonStore {
  lessons = signal<LessonListResponse[]>([]);
  selectedLesson = signal<LessonResponse | null>(null);

  setLessons(lessons: LessonListResponse[]) {
    this.lessons.set(lessons);
  }

  setSelectedLesson(lesson: LessonResponse | null): void {
    this.selectedLesson.set(lesson);
  }

  clear() {
    this.lessons.set([]);
    this.selectedLesson.set(null);
  }
}
