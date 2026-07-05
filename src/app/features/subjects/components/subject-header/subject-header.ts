import { Component, output } from '@angular/core';
import { SubjectSearch } from '../subject-search/subject-search';

@Component({
  selector: 'app-subject-header',
  standalone: true,
  imports: [SubjectSearch],
  templateUrl: './subject-header.html',
})
export class SubjectHeader {
  create = output<void>();
  search = output<string>();
  sort = output<string>();
  sortDirection: 'asc' | 'desc' = 'asc';

  setSort(direction: 'asc' | 'desc'): void {
    this.sortDirection = direction;
    this.sort.emit(direction);
  }

  onSearch(value: string) {
    this.search.emit(value);
  }
}
