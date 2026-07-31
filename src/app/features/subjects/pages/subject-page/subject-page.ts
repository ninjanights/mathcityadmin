import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { SubjectService } from '../../services';
import { CreateSubjectRequest, SubjectListResponse, SubjectResponse } from '../../models';
import { SubjectForm, SubjectHeader } from '../../components';
import { SubjectList } from '../../components/subject-list/subject-list';
import { CommonModule } from '@angular/common';
import { SubjectStore } from '../../../../shared/stores/subject.store';

@Component({
  selector: 'app-subject-page',
  standalone: true,
  templateUrl: './subject-page.html',
  imports: [SubjectHeader, SubjectList, SubjectForm, CommonModule],
  styleUrl: './subject-page.css',
})
export class SubjectPage implements OnInit {
  private readonly subjectService = inject(SubjectService);
  private readonly subjectStore = inject(SubjectStore);

  subjects = this.subjectStore.subjects;

  loading = signal(false);
  error = signal<string | null>(null);

  page = signal(1);
  pageSize = 5;
  totalCount = signal(0);
  totalPages = signal(0);
  search = signal('');

  sortOrder = signal<string>('name-asc');
  isCreating = signal(false);
  isEditing = signal(false);
  selectedSubject = signal<SubjectResponse | undefined>(undefined);

  sortedSubjects = computed(() => {
    const list = this.subjects();
    const order = this.sortOrder();
    return [...list].sort((a, b) => {
      if (order === 'name-asc') {
        return a.name.localeCompare(b.name);
      } else if (order === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });
  });

  pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1),
  );

  ngOnInit() {
    this.loadSubjects();
  }

  loadSubjects(search?: string) {
    this.loading.set(true);
    this.subjectService.getSubjects({
      search,
      page: this.page(),
      pageSize: this.pageSize,
    }).subscribe({
      next: (response) => {
        const items = response.data?.items ?? [];
        this.subjectStore.setSubjects(items);
        this.totalCount.set(response.data?.totalCount ?? 0);
        this.totalPages.set(response.data?.totalPages ?? 0);

        if (items.length > 0 && !this.subjectStore.selectedSubject()) {
          this.subjectStore.selectedSubject.set(items[0]);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onSearch(query: string) {
    this.search.set(query);
    this.page.set(1);
    this.loadSubjects(query);
  }

  onSort(order: string) {
    this.sortOrder.set(order);
  }

  onPageChange(newPage: number) {
    this.page.set(newPage);
    this.loadSubjects(this.search());
  }

  onCreate() {
    this.selectedSubject.set(undefined);
    this.isCreating.set(true);
    this.isEditing.set(false);
  }

  onEdit(subject: SubjectListResponse) {
    this.subjectService.getSubjectById(subject.id).subscribe({
      next: (response) => {
        this.selectedSubject.set(response.data);
        this.isEditing.set(true);
        this.isCreating.set(false);
      },
    });
  }

  onPublish(subject: SubjectListResponse) {
    this.subjectService.getSubjectById(subject.id).subscribe({
      next: (response) => {
        const fullSubject = response.data;
        const updateRequest = {
          name: fullSubject.name,
          description: fullSubject.description,
          icon: fullSubject.icon,
          color: fullSubject.color,
          isPublished: !fullSubject.isPublished,
        };
        this.subjectService.updateSubject(subject.id, updateRequest).subscribe({
          next: () => {
            this.loadSubjects(this.search());
          },
        });
      },
    });
  }

  onDelete(subject: SubjectListResponse) {
    if (confirm(`Are you sure you want to delete ${subject.name}?`)) {
      this.subjectService.deleteSubject(subject.id).subscribe({
        next: () => {
          this.loadSubjects(this.search());
        },
      });
    }
  }

  onSave(request: CreateSubjectRequest) {
    if (this.isEditing() && this.selectedSubject()) {
      const id = this.selectedSubject()!.id;
      const updateRequest = {
        ...request,
        isPublished: this.selectedSubject()!.isPublished,
      };
      this.subjectService.updateSubject(id, updateRequest).subscribe({
        next: () => {
          this.onCancel();
          this.loadSubjects(this.search());
        },
      });
    } else {
      this.subjectService.createSubject(request).subscribe({
        next: () => {
          this.onCancel();
          this.loadSubjects(this.search());
        },
      });
    }
  }

  onCancel() {
    this.isCreating.set(false);
    this.isEditing.set(false);
    this.selectedSubject.set(undefined);
  }

  onMove(subject: SubjectListResponse, direction: 'Up' | 'Down') {
    this.subjectService.moveSubject(subject.id, direction).subscribe({
      next: () => this.loadSubjects(this.search()),
    });
  }
}
