import { Component, computed, inject, input, output, OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { LessonTagService } from '../../services';
import { TagService } from '../../../tags/services';

import { LessonTagResponse, CreateLessonTagRequest } from '../../models';

import { TagListResponse } from '../../../tags/models';

@Component({
  selector: 'app-lesson-tag-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lesson-tag-page.html',
})
export class LessonTagPage implements OnInit {
  private lessonTagService = inject(LessonTagService);
  private tagService = inject(TagService);
  lessonId = input.required<string>();
  lessonTitle = input('');
  close = output<void>();
  lessonTags = signal<LessonTagResponse[]>([]);
  availableTags = signal<TagListResponse[]>([]);
  selectedTagId = signal('');
  attachedTagIds = computed(() => new Set(this.lessonTags().map((tag) => tag.tagId)));
  selectableTags = computed(() =>
    this.availableTags().filter((tag) => !this.attachedTagIds().has(tag.id)),
  );

  ngOnInit(): void {
    this.loadLessonTags();
    this.loadTags();
  }

  loadLessonTags() {
    this.lessonTagService.getLessonTags(this.lessonId()).subscribe({
      next: (res) => {
        this.lessonTags.set(res.data);
      },
    });
  }

  loadTags() {
    this.tagService.getTags().subscribe({
      next: (res) => {
        this.availableTags.set(res.data);
      },
    });
  }

  selectTag(tagId: string) {
    this.selectedTagId.set(tagId);
  }

  addSelectedTag() {
    const tagId = this.selectedTagId();

    if (!tagId) {
      return;
    }

    this.addTag(tagId);
  }

  addTag(tagId: string) {
    const request: CreateLessonTagRequest = {
      tagId,
    };

    this.lessonTagService.addLessonTag(this.lessonId(), request).subscribe({
      next: () => {
        this.selectedTagId.set('');
        this.loadLessonTags();
      },
    });
  }

  removeTag(tagId: string) {
    this.lessonTagService.deleteLessonTag(this.lessonId(), tagId).subscribe({
      next: () => {
        this.loadLessonTags();
      },
    });
  }
}
