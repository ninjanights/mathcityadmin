import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { SubjectService } from '../../services';
import { CreateSubjectRequest, SubjectListResponse, SubjectResponse } from '../../models';
import { SubjectForm, SubjectHeader } from '../../components';
import { SubjectList } from '../../components/subject-list/subject-list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subject-page',
  standalone: true,
  templateUrl: './subject-page.html',
  imports: [SubjectHeader, SubjectList, SubjectForm, CommonModule],
  styleUrl: './subject-page.css',
})
export class SubjectPage implements OnInit {
  private readonly subjectService = inject(SubjectService);

  subjects = signal<SubjectListResponse[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

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

  ngOnInit() {
    this.loadSubjects();
  }

  loadSubjects(search?: string) {
    this.loading.set(true);
    this.subjectService.getSubjects(search).subscribe({
      next: (response) => {
        this.subjects.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onSearch(query: string) {
    this.loadSubjects(query);
  }

  onSort(order: string) {
    this.sortOrder.set(order);
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

  positions = computed(() => {
    const count = this.subjects().length;

    return Array.from(
      {
        length: this.isEditing() ? count : count + 1,
      },
      (_, i) => i + 1,
    );
  });

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
            this.loadSubjects();
          },
        });
      },
    });
  }

  onDelete(subject: SubjectListResponse) {
    if (confirm(`Are you sure you want to delete ${subject.name}?`)) {
      this.subjectService.deleteSubject(subject.id).subscribe({
        next: () => {
          this.loadSubjects();
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
          this.loadSubjects();
        },
      });
    } else {
      this.subjectService.createSubject(request).subscribe({
        next: () => {
          this.onCancel();
          this.loadSubjects();
        },
      });
    }
  }

  onCancel() {
    this.isCreating.set(false);
    this.isEditing.set(false);
    this.selectedSubject.set(undefined);
  }
}
