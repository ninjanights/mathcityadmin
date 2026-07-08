import { Component, OnChanges, computed, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ChapterListResponse } from '../../../chapters/models';
import { CreateTopicRequest, TopicResponse } from '../../models';

@Component({
  selector: 'app-topic-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './topic-form.html',
})
export class TopicForm implements OnChanges {
  private readonly fb = inject(FormBuilder);

  positions = input<number[]>([]);
  topic = input<TopicResponse>();
  chapters = input<ChapterListResponse[]>([]);

  save = output<CreateTopicRequest>();
  cancel = output<void>();

  visibleCount = 5;
  startIndex = signal(0);

  visibleChapters = computed(() =>
    this.chapters().slice(
      this.startIndex(),
      this.startIndex() + this.visibleCount,
    ),
  );

  selectedChapterId = signal('');

  form = this.fb.group({
    chapterId: ['', Validators.required],
    title: ['', [Validators.required, Validators.maxLength(200)]],
    displayOrder: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnChanges(): void {
    const topic = this.topic();

    if (topic) {
      this.selectedChapterId.set(topic.chapterId);

      this.form.patchValue({
        chapterId: topic.chapterId,
        title: topic.title,
        displayOrder: topic.displayOrder,
      });

      const idx = this.chapters().findIndex(
        (c) => c.id === topic.chapterId,
      );

      if (idx >= 0) {
        this.startIndex.set(
          Math.floor(idx / this.visibleCount) * this.visibleCount,
        );
      }
    } else {
      this.startIndex.set(0);

      const firstChapter = this.chapters()[0];

      this.selectedChapterId.set(firstChapter?.id ?? '');

      this.form.patchValue({
        chapterId: firstChapter?.id ?? '',
        title: '',
        displayOrder: this.positions().length + 1,
      });
    }
  }

  previousChapters(): void {
    if (!this.topic() && this.startIndex() > 0) {
      this.startIndex.update((v) =>
        Math.max(0, v - this.visibleCount),
      );
    }
  }

  nextChapters(): void {
    if (
      !this.topic() &&
      this.startIndex() + this.visibleCount < this.chapters().length
    ) {
      this.startIndex.update((v) =>
        Math.min(
          v + this.visibleCount,
          Math.max(0, this.chapters().length - this.visibleCount),
        ),
      );
    }
  }

  selectChapter(chapter: ChapterListResponse): void {
    if (!this.topic()) {
      this.selectedChapterId.set(chapter.id);
      this.form.controls.chapterId.setValue(chapter.id);
    }
  }

  selectedChapter = computed(() =>
    this.chapters().find((c) => c.id === this.selectedChapterId()),
  );

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.getRawValue() as CreateTopicRequest);
  }
}