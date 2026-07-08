import { Component, OnChanges, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateTagRequest, TagResponse } from '../../models';

@Component({
  selector: 'app-tag-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tag-form.html',
})
export class TagForm implements OnChanges {
  private readonly fb = inject(FormBuilder);

  tag = input<TagResponse>();

  save = output<CreateTagRequest>();
  cancel = output<void>();

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  ngOnChanges(): void {
    const tag = this.tag();

    if (tag) {
      this.form.patchValue({
        name: tag.name,
      });
    } else {
      this.form.reset({
        name: '',
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.getRawValue() as CreateTagRequest);
  }
}