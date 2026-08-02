import { Component, input, output } from '@angular/core';

import { LessonResourceListResponse, ResourceType } from '../../models';

@Component({
  selector: 'app-lesson-resource-list',
  standalone: true,
  templateUrl: './lesson-resource-list.html',
})
export class LessonResourceList {
  resources = input.required<LessonResourceListResponse[]>();
  view = output<LessonResourceListResponse>();
  edit = output<LessonResourceListResponse>();
  delete = output<LessonResourceListResponse>();

  resourceTypeLabel(value: LessonResourceListResponse['resourceType']): string {
    if (value === 'Text' || value === ResourceType.Text) return 'Text';
    if (value === 'Pdf' || value === ResourceType.Pdf) return 'PDF';
    return 'Resource';
  }
}
