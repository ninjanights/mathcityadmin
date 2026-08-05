import { Component, input, output } from '@angular/core';
import { SubjectListResponse } from '../../models';
import { MATERIAL_ICONS } from '../../../../shared/icons/meterial-icons';

@Component({
  selector: 'app-subject-card',
  standalone: true,
  templateUrl: './subject-card.html'
})
export class SubjectCardComponent {
  subject = input.required<SubjectListResponse>();
  edit = output<SubjectListResponse>();
  delete = output<SubjectListResponse>();
  publish = output<SubjectListResponse>();
  moveUp = output<SubjectListResponse>();
  moveDown = output<SubjectListResponse>();

  private readonly validIconNames = new Set(MATERIAL_ICONS.map((icon) => icon.name));

  displayIcon(icon: string | undefined): string {
    return icon && this.validIconNames.has(icon) ? icon : 'school';
  }
}