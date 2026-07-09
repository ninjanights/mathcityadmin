import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject, output, signal } from '@angular/core';

import { LessonService } from '../../../lessons/services';

@Component({
  selector: 'app-practice-question-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './practice-question-page.html',
})
export class PracticeQuestionPage implements OnInit {
  private readonly lessonService = inject(LessonService);

  @Input({ required: true }) lessonId = '';
  @Input() lessonTitle = '';
  close = output<void>();

  loading = signal(false);
  questions = signal<any[]>([]);

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.loading.set(true);

    this.lessonService.getPracticeQuestionsByLesson(this.lessonId).subscribe({
      next: (response) => {
        this.questions.set(response.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.questions.set([]);
        this.loading.set(false);
      },
    });
  }
}
