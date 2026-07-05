import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectCardComponent } from '../subject-card/subject-card';

import { SubjectListResponse } from '../../models';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [
    CommonModule,
    SubjectCardComponent
],
  templateUrl: './subject-list.html',
})
export class SubjectList {
  subjects = input.required<SubjectListResponse[]>();
  loading = input<boolean>(false);

  edit = output<SubjectListResponse>();
  delete = output<SubjectListResponse>();
  publish = output<SubjectListResponse>();
}

