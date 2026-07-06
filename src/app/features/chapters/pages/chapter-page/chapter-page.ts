import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChapterForm, ChapterHeader, ChapterList } from '../../components';
import { ChapterService } from '../../services';
import { ChapterListResponse, ChapterResponse, CreateChapterRequest } from '../../models';
import { SubjectService } from '../../../subjects/services';
import { SubjectListResponse } from '../../../subjects/models';

@Component({
  selector: 'app-chapter-page',
  standalone: true,
  imports: [CommonModule, ChapterHeader, ChapterList, ChapterForm],
  templateUrl: './chapter-page.html',
})
export class ChapterPage implements OnInit {
  private readonly chapterService = inject(ChapterService);
  private readonly subjectService = inject(SubjectService);

  chapters = signal<ChapterListResponse[]>([]);
  subjects = signal<SubjectListResponse[]>([]);
  loading = signal(false);

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
    this.loadSubjects();
    this.loadChapters();
  }

  loadSubjects(): void {
    this.subjectService.getSubjects().subscribe({
      next: (response) => {
        this.subjects.set(response.data);
      },
    });
  }

  loadChapters(search?: string): void {
    this.loading.set(true);
    this.chapterService.getChapters(search).subscribe({
      next: (response) => {
        this.chapters.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onSearch(query: string): void {
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
