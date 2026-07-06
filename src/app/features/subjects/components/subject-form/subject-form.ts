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
  positions = input<number[]>([]);
  subject = input<SubjectResponse>();
  icons = MATERIAL_ICONS;
  save = output<CreateSubjectRequest>();
  cancel = output<void>();

  readonly colorPalette = [
    { hex: '#EF4444', name: 'Red' },
    { hex: '#F97316', name: 'Orange' },
    { hex: '#F59E0B', name: 'Amber' },
    { hex: '#EAB308', name: 'Yellow' },
    { hex: '#84CC16', name: 'Lime' },
    { hex: '#22C55E', name: 'Green' },
    { hex: '#14B8A6', name: 'Teal' },
    { hex: '#06B6D4', name: 'Cyan' },
    { hex: '#3B82F6', name: 'Blue' },
    { hex: '#6366F1', name: 'Indigo' },
    { hex: '#8B5CF6', name: 'Violet' },
    { hex: '#A855F7', name: 'Purple' },
    { hex: '#EC4899', name: 'Pink' },
    { hex: '#6B7280', name: 'Gray' },
  ];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    icon: ['school', [Validators.maxLength(100)]],
    color: ['#6B7280', Validators.required],
    displayOrder: [1, [Validators.required, Validators.min(1)]],
    isPublished: [false, Validators.required],
  });

  selectColor(color: string): void {
    this.form.patchValue({
      color,
    });
  }

  ngOnChanges() {
    const sub = this.subject();

    if (sub) {
      this.form.patchValue({
        name: sub.name,
        description: sub.description ?? '',
        icon: sub.icon,
        color: sub.color,
        displayOrder: sub.displayOrder,
        isPublished: sub.isPublished,
      });
    } else {
      this.form.patchValue({
        displayOrder: this.positions().length,
        color: "#6B7280",
        isPublished: false,
      });
    }
  }


  getSelectedColor() {
    const hex = this.form.controls.color.value;
    return this.colorPalette.find((color) => color.hex === hex) ?? null;
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
