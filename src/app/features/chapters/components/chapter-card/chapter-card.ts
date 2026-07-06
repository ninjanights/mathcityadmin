import { Component, input, output } from '@angular/core';
import { ChapterListResponse } from '../../models';

@Component({
  selector: 'app-chapter-card',
  standalone: true,
  templateUrl: './chapter-card.html',
})
export class ChapterCard {
  chapter = input.required<ChapterListResponse>();
  subjectName = input<string>('Unknown subject');
  subjectColor = input<string>('#6B7280');

  edit = output<ChapterListResponse>();
  delete = output<ChapterListResponse>();
}
