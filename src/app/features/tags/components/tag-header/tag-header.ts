import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tag-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tag-header.html',
})
export class TagHeader {
  create = output<void>();
  search = output<string>();
  sort = output<string>();

  query = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  setSort(direction: 'asc' | 'desc'): void {
    this.sortDirection = direction;
    this.sort.emit(`title-${direction}`);
  }
}