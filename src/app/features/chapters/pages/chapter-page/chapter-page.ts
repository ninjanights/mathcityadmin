import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChapterForm, ChapterHeader, ChapterList } from '../../components';
import { ChapterService } from '../../services';
import { ChapterListResponse, ChapterResponse, CreateChapterRequest } from '../../models';
import { SubjectService } from '../../../subjects/services';
import { SubjectListResponse } from '../../../subjects/models';
import { SubjectStore } from '../../../../shared/stores/subject.store';
import { ChapterStore } from '../../../../shared/stores/chapter.store';

@Component({
  selector: 'app-chapter-page',
  standalone: true,
  imports: [CommonModule, ChapterHeader, ChapterList, ChapterForm],
  templateUrl: './chapter-page.html',
})
export class ChapterPage implements OnInit {
  private readonly chapterService = inject(ChapterService);
  private readonly subjectService = inject(SubjectService);
  private readonly subjectStore = inject(SubjectStore);
  private readonly chapterStore = inject(ChapterStore);

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

  createPositions = computed(() =>
    Array.from({ length: this.chapters().length + 1 }, (_, i) => i + 1),
  );

  editPositions = computed(() => Array.from({ length: this.chapters().length }, (_, i) => i + 1));

  loadSubjects(): void {
    this.subjectService.getSubjects().subscribe({
      next: (response) => {
        this.subjectStore.setSubjects(response.data);

        if (response.data.length > 0) {
          this.subjectStore.selectedSubject.set(response.data[0]);
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
        next: (response) => {this.chapterStore.setChapters(response.data.items);

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

  onSubjectChange(subject: SubjectListResponse) {
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
        displayOrder: request.displayOrder,
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
}
