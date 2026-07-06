import { Component, input, output } from '@angular/core';
import { ChapterListResponse } from '../../models';
import { SubjectListResponse } from '../../../subjects/models';
import { ChapterCard } from '../chapter-card/chapter-card';

@Component({
  selector: 'app-chapter-list',
  standalone: true,
  imports: [ChapterCard],
  templateUrl: './chapter-list.html',
})
export class ChapterList {
  chapters = input.required<ChapterListResponse[]>();
  subjects = input<SubjectListResponse[]>([]);

  edit = output<ChapterListResponse>();
  delete = output<ChapterListResponse>();

  subjectName(subjectId: string): string {
    return this.subjects().find((subject) => subject.id === subjectId)?.name ?? 'Unknown subject';
  }

  subjectColor(subjectId: string): string {
    return this.subjects().find((subject) => subject.id === subjectId)?.color ?? '#6B7280';
  }
}
