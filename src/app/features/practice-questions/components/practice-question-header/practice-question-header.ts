import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-practice-question-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './practice-question-header.html',
})
export class PracticeQuestionHeader {
  create = output<void>();
  search = output<string>();
  sort = output<string>();

  query = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  setSort(direction: 'asc' | 'desc'): void {
    this.sortDirection = direction;
    this.sort.emit(`question-${direction}`);
  }
}