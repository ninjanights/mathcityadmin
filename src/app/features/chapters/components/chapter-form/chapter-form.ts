import { Component, OnChanges, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubjectListResponse } from '../../../subjects/models';
import { ChapterResponse, CreateChapterRequest } from '../../models';
import { signal } from '@angular/core';
import { computed } from '@angular/core';

@Component({
  selector: 'app-chapter-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './chapter-form.html',
})
export class ChapterForm implements OnChanges {
  private readonly fb = inject(FormBuilder);
  positions = input<number[]>([]);
  chapter = input<ChapterResponse>();
  subjects = input<SubjectListResponse[]>([]);
  save = output<CreateChapterRequest>();
  cancel = output<void>();
  visibleCount = 5;
  startIndex = signal(0);
  visibleSubjects = computed(() =>
    this.subjects().slice(this.startIndex(), this.startIndex() + this.visibleCount),
  );
  selectedSubjectId = signal<string>('');

  form = this.fb.group({
    subjectId: ['', Validators.required],
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(1000)]],
    displayOrder: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnChanges(): void {
    const chapter = this.chapter();
    

    if (chapter) {
      this.selectedSubjectId.set(chapter.subjectId);
      this.form.patchValue({
        subjectId: chapter.subjectId,
        title: chapter.title,
        description: chapter.description ?? '',
        displayOrder: chapter.displayOrder,
      });

      const idx = this.subjects().findIndex((s) => s.id === chapter.subjectId);

      if (idx >= 0) {
        this.startIndex.set(Math.floor(idx / this.visibleCount) * this.visibleCount);
      }
    } else {
      this.startIndex.set(0);
      const firstSubject = this.subjects()[0];
      this.selectedSubjectId.set(firstSubject?.id ?? '');
      this.form.patchValue({
        subjectId: firstSubject?.id ?? '',
        title: '',
        description: '',
        displayOrder: this.positions().length + 1,
      });
    }
  }

  previousSubjects() {
    if (!this.chapter && this.startIndex() > 0) {
      this.startIndex.update((v) => Math.max(0, v - this.visibleCount));
    }
  }

  nextSubjects() {
    if (!this.chapter && this.startIndex() + this.visibleCount < this.subjects().length) {
      this.startIndex.update((v) =>
        Math.min(v + this.visibleCount, Math.max(0, this.subjects().length - this.visibleCount)),
      );
    }
  }

  selectSubject(subject: SubjectListResponse): void {
    if(!this.chapter){
    this.selectedSubjectId.set(subject.id);

    this.form.controls.subjectId.setValue(subject.id);}
  }

  selectedSubject = computed(() => this.subjects().find((s) => s.id === this.selectedSubjectId()));

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.getRawValue() as CreateChapterRequest);
  }
}
