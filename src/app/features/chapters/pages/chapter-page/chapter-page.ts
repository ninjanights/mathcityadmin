import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChapterForm, ChapterHeader, ChapterList } from '../../components';
import { ChapterService } from '../../services';
import { ChapterListResponse, ChapterResponse, CreateChapterRequest } from '../../models';
import { SubjectService } from '../../../subjects/services';
import { SubjectListResponse } from '../../../subjects/models';
import { SubjectStore } from '../../../../shared/stores/subject.store';
import { ChapterStore } from '../../../../shared/stores/chapter.store';
import {
  HorizontalSelector,
  HorizontalSelectorItem,
} from '../../../../shared/components/horizontal-selector/horizontal-selector';

@Component({
  selector: 'app-chapter-page',
  standalone: true,
  imports: [CommonModule, ChapterHeader, ChapterList, ChapterForm, HorizontalSelector],
  templateUrl: './chapter-page.html',
})
export class ChapterPage implements OnInit {
  private readonly chapterService = inject(ChapterService);
  private readonly subjectService = inject(SubjectService);
  protected readonly subjectStore = inject(SubjectStore);
protected readonly chapterStore = inject(ChapterStore);

  subjects = this.subjectStore.subjects;
  chapters = this.chapterStore.chapters;

  loading = signal(false);
  search = signal('');
  page = signal(1);
  pageSize = 5;
  totalCount = signal(0);
  totalPages = signal(0);

  sortOrder = signal('title-asc');
  isCreating = signal(false);
  isEditing = signal(false);
  selectedChapter = signal<ChapterResponse | undefined>(undefined);
  subjectItems = computed(() =>
    this.subjects().map((subject) => ({
      id: subject.id,
      label: subject.name,
    })),
  );

  sortedChapters = computed(() => {
    const order = this.sortOrder();
    return [...this.chapters()].sort((a, b) => {
      if (order === 'title-asc') {
        return a.title.localeCompare(b.title);
      }

      if (order === 'title-desc') {
        return b.title.localeCompare(a.title);
      }

      return 0;
    });
  });

  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  ngOnInit(): void {
    if (this.subjectStore.subjects().length === 0) {
      this.loadSubjects();
    } else {
      if (!this.subjectStore.selectedSubject()) {
        this.subjectStore.selectedSubject.set(this.subjectStore.subjects()[0]);
      }

      this.loadChapters();
    }
  }

  loadSubjects(): void {
    this.subjectService.getSubjects({ pageSize: 100 }).subscribe({
      next: (response) => {
        const subjects = response.data?.items ?? [];
        this.subjectStore.setSubjects(subjects);

        if (subjects.length > 0) {
          this.subjectStore.selectedSubject.set(subjects[0]);
          this.loadChapters();
        }
      },
    });
  }

  loadChapters(search?: string): void {
    this.loading.set(true);

    this.chapterService
      .getChapters({
        page: this.page(),
        pageSize: this.pageSize,
        search,
        subjectSlug: this.subjectStore.selectedSubject()?.slug ?? undefined,
      })
      .subscribe({
        next: (response) => {
          console.log(response, '🥬s');
          this.chapterStore.setChapters(response.data.items);

          if (response.data.items.length === 0) {
            this.chapterStore.selectedChapter.set(null);
          }
          this.totalCount.set(response.data.totalCount);
          this.totalPages.set(response.data.totalPages);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  onSearch(query: string): void {
    this.search.set(query);
    this.page.set(1);
    this.loadChapters(query);
  }

  onSort(order: string): void {
    this.sortOrder.set(order);
  }

  onPageChange(newPage: number): void {
    this.page.set(newPage);
    this.loadChapters(this.search());
  }

  onCreate(): void {
    this.selectedChapter.set(undefined);
    this.isCreating.set(true);
    this.isEditing.set(false);
  }

  onEdit(chapter: ChapterListResponse): void {
    this.chapterService.getChapterById(chapter.id).subscribe({
      next: (response) => {
        this.selectedChapter.set(response.data);
        this.isEditing.set(true);
        this.isCreating.set(false);
      },
    });
  }

  onSubjectSelected(item: HorizontalSelectorItem): void {
  const subject = this.subjects().find(x => x.id === item.id);

  if (!subject) return;

  this.subjectStore.selectedSubject.set(subject);

  this.page.set(1);
  this.loadChapters(this.search());
}

  onDelete(chapter: ChapterListResponse): void {
    if (confirm(`Are you sure you want to delete ${chapter.title}?`)) {
      this.chapterService.deleteChapter(chapter.id).subscribe({
        next: () => {
          this.loadChapters();
        },
      });
    }
  }

  onSave(request: CreateChapterRequest): void {
    if (this.isEditing() && this.selectedChapter()) {
      const id = this.selectedChapter()!.id;
      const updateRequest = {
        title: request.title,
        description: request.description,
      };

      this.chapterService.updateChapter(id, updateRequest).subscribe({
        next: () => {
          this.onCancel();
          this.loadChapters();
        },
      });
      return;
    }

    this.chapterService.createChapter(request).subscribe({
      next: () => {
        this.onCancel();
        this.loadChapters();
      },
    });
  }

  onCancel(): void {
    this.isCreating.set(false);
    this.isEditing.set(false);
    this.selectedChapter.set(undefined);
  }

  onMove(chapter: ChapterListResponse, direction: 'Up' | 'Down'): void {
    this.chapterService.moveChapter(chapter.id, direction).subscribe({
      next: () => this.loadChapters(this.search()),
    });
  }
}
