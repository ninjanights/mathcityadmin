import { Component, OnChanges, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubjectListResponse } from '../../../subjects/models';
import { ChapterResponse, CreateChapterRequest } from '../../models';

@Component({
  selector: 'app-chapter-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './chapter-form.html',
})
export class ChapterForm implements OnChanges {
  private readonly fb = inject(FormBuilder);

  chapter = input<ChapterResponse>();
  subjects = input<SubjectListResponse[]>([]);

  save = output<CreateChapterRequest>();
  cancel = output<void>();

  form = this.fb.group({
    subjectId: ['', Validators.required],
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    displayOrder: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnChanges(): void {
    const chapter = this.chapter();

    if (chapter) {
      this.form.patchValue({
        subjectId: chapter.subjectId,
        title: chapter.title,
        description: chapter.description ?? '',
        displayOrder: chapter.displayOrder,
      });
    } else {
      this.form.reset({
        subjectId: '',
        title: '',
        description: '',
        displayOrder: 0,
      });
    }
  }

  selectedSubject(): SubjectListResponse | undefined {
    const subjectId = this.form.controls.subjectId.value;
    return this.subjects().find((subject) => subject.id === subjectId);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.getRawValue() as CreateChapterRequest);
  }
}
