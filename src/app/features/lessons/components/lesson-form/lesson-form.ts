import {
  Component,
  OnChanges,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TopicListResponse } from '../../../topics/models';
import {
  CreateLessonRequest,
  LessonResponse,
} from '../../models';

@Component({
  selector: 'app-lesson-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './lesson-form.html',
})
export class LessonForm implements OnChanges {
  private readonly fb = inject(FormBuilder);

  lesson = input<LessonResponse>();
  topics = input<TopicListResponse[]>([]);
  positions = input<number[]>([]);

  save = output<CreateLessonRequest>();
  cancel = output<void>();

  visibleCount = 5;
  startIndex = signal(0);

  selectedTopicId = signal('');

  visibleTopics = computed(() =>
    this.topics().slice(
      this.startIndex(),
      this.startIndex() + this.visibleCount,
    ),
  );

  selectedTopic = computed(() =>
    this.topics().find((x) => x.id === this.selectedTopicId()),
  );

  form = this.fb.group({
    topicId: ['', Validators.required],

    title: ['', [Validators.required, Validators.maxLength(200)]],

    summary: ['', Validators.maxLength(1000)],

    markdownContent: ['', Validators.required],

    difficulty: [0, Validators.required],

    readingTimeMinutes: [5, [Validators.required, Validators.min(1)]],

    thumbnailUrl: [''],

    isPublished: [true],

    displayOrder: [1, Validators.required],
  });

  ngOnChanges(): void {
    const lesson = this.lesson();

    if (lesson) {
      this.selectedTopicId.set(lesson.topicId);

      this.form.patchValue({
        topicId: lesson.topicId,
        title: lesson.title,
        summary: lesson.summary,
        markdownContent: lesson.markdownContent,
        difficulty: lesson.difficulty,
        readingTimeMinutes: lesson.readingTimeMinutes,
        thumbnailUrl: lesson.thumbnailUrl,
        isPublished: lesson.isPublished,
        displayOrder: lesson.displayOrder,
      });

      const index = this.topics().findIndex(
        (x) => x.id === lesson.topicId,
      );

      if (index >= 0) {
        this.startIndex.set(
          Math.floor(index / this.visibleCount) * this.visibleCount,
        );
      }
    } else {
      const first = this.topics()[0];

      this.selectedTopicId.set(first?.id ?? '');

      this.startIndex.set(0);

      this.form.patchValue({
        topicId: first?.id ?? '',
        title: '',
        summary: '',
        markdownContent: '',
        difficulty: 0,
        readingTimeMinutes: 5,
        thumbnailUrl: '',
        isPublished: true,
        displayOrder: this.positions().length + 1,
      });
    }
  }

  previousTopics() {
    if (!this.lesson() && this.startIndex() > 0) {
      this.startIndex.update((x) =>
        Math.max(0, x - this.visibleCount),
      );
    }
  }

  nextTopics() {
    if (
      !this.lesson() &&
      this.startIndex() + this.visibleCount <
        this.topics().length
    ) {
      this.startIndex.update((x) =>
        Math.min(
          x + this.visibleCount,
          Math.max(
            0,
            this.topics().length - this.visibleCount,
          ),
        ),
      );
    }
  }

  selectTopic(topic: TopicListResponse) {
    if (!this.lesson()) {
      this.selectedTopicId.set(topic.id);
      this.form.controls.topicId.setValue(topic.id);
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(
      this.form.getRawValue() as CreateLessonRequest,
    );
  }
}