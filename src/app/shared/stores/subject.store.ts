import { Injectable, signal } from '@angular/core';
import { SubjectListResponse } from '../../features/subjects/models';
@Injectable({
  providedIn: 'root',
})
export class SubjectStore {
  readonly subjects = signal<SubjectListResponse[]>([]);

  readonly selectedSubject = signal<SubjectListResponse | null>(null);

  setSubjects(subjects: SubjectListResponse[]) {
    this.subjects.set(subjects);
  }

  selectSubject(subject: SubjectListResponse | null) {
    this.selectedSubject.set(subject);
  }

  clear() {
    this.subjects.set([]);
    this.selectedSubject.set(null);
  }
}