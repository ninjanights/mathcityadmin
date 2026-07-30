import { Injectable, signal } from '@angular/core';
import { ChapterListResponse } from '../../features/chapters/models';

@Injectable({
  providedIn: 'root',
})
export class ChapterStore {
  readonly chapters = signal<ChapterListResponse[]>([]);

  readonly selectedChapter = signal<ChapterListResponse | null>(null);

  setChapters(chapters: ChapterListResponse[]) {
    this.chapters.set(chapters);
  }

  selectChapter(chapter: ChapterListResponse | null) {
    this.selectedChapter.set(chapter);
  }

  clear() {
    this.chapters.set([]);
    this.selectedChapter.set(null);
  }
}