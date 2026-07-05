import { Component, OnChanges, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MATERIAL_ICONS } from '../../../../shared/icons/meterial-icons';
import { CreateSubjectRequest, SubjectResponse } from '../../models';

@Component({
  selector: 'app-subject-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subject-form.html',
})
export class SubjectForm implements OnChanges {
  private readonly fb = inject(FormBuilder);

  subject = input<SubjectResponse>();
  icons = MATERIAL_ICONS;
  save = output<CreateSubjectRequest>();
  cancel = output<void>();

  colorPalette = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#F59E0B', // Amber
    '#EAB308', // Yellow
    '#84CC16', // Lime
    '#22C55E', // Green
    '#14B8A6', // Teal
    '#06B6D4', // Cyan
    '#3B82F6', // Blue
    '#6366F1', // Indigo
    '#8B5CF6', // Violet
    '#A855F7', // Purple
    '#EC4899', // Pink
    '#6B7280', // Gray
  ];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],

    description: ['', [Validators.maxLength(500)]],

    icon: ['school', [Validators.maxLength(100)]],

    color: ['#2563EB', Validators.required],

    displayOrder: [0, Validators.min(0)],
  });

  selectColor(color: string): void {
    this.form.patchValue({
      color,
    });
  }

  ngOnChanges(): void {
    const sub = this.subject();
    if (!sub) return;

    this.form.patchValue({
      name: sub.name,
      description: sub.description || '',
      icon: sub.icon || '',
      color: sub.color,
      displayOrder: sub.displayOrder,
    });
  }

  selectIcon(icon: string) {
  this.form.patchValue({
    icon,
  });
}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue() as CreateSubjectRequest);
  }
}
