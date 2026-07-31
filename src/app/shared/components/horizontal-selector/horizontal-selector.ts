import { Component, input, output, computed, signal } from '@angular/core';

export interface HorizontalSelectorItem {
  id: string;
  label: string;
}

@Component({
  selector: 'app-horizontal-selector',
  standalone: true,
  templateUrl: './horizontal-selector.html',
})
export class HorizontalSelector {
  items = input<HorizontalSelectorItem[]>([]);
  selectedId = input<string | null>(null);
  chunkSize = input(5);

  selected = output<HorizontalSelectorItem>();

  private page = signal(0);

  visibleItems = computed(() => {
    const start = this.page() * this.chunkSize();

    return this.items().slice(start, start + this.chunkSize());
  });

  totalPages = computed(() => Math.ceil(this.items().length / this.chunkSize()));

  canGoPrevious = computed(() => this.page() > 0);

  canGoNext = computed(() => this.page() < this.totalPages() - 1);

  previous(): void {
    if (this.canGoPrevious()) {
      this.page.update((x) => x - 1);
    }
  }

  next(): void {
    if (this.canGoNext()) {
      this.page.update((x) => x + 1);
    }
  }

  select(item: HorizontalSelectorItem): void {
    this.selected.emit(item);
  }
}
