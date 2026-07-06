import { Component, input, output } from '@angular/core';
import { SubjectListResponse } from '../../models';

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
}