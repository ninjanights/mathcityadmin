import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicForm, TopicHeader, TopicList } from '../../components';

import { TopicService } from '../../services';
import { CreateTopicRequest, TopicListResponse, TopicResponse } from '../../models';
import { ChapterService } from '../../../chapters/services';
import { ChapterListResponse } from '../../../chapters/models';

import { TopicStore } from '../../../../shared/stores/topic.store';
import { SubjectStore } from '../../../../shared/stores/subject.store';
import { ChapterStore } from '../../../../shared/stores/chapter.store';
import { SubjectService } from '../../../subjects/services';


@Component({
  selector: 'app-topic-page',
  standalone: true,
  imports: [CommonModule, TopicHeader, TopicList, TopicForm],
  templateUrl: './topic-page.html',
})
export class TopicPage implements OnInit {
  private readonly topicService = inject(TopicService);
  private readonly chapterService = inject(ChapterService);
  private readonly subjectService = inject(SubjectService);
private readonly subjectStore = inject(SubjectStore);
private readonly chapterStore = inject(ChapterStore);
private readonly topicStore = inject(TopicStore);

page = signal(1);
pageSize = 5;

totalCount = signal(0);
totalPages = signal(0);

search = signal('');
topics = this.topicStore.topics;
  loading = signal(false);
subjects = this.subjectStore.subjects;
chapters = this.chapterStore.chapters;
  sortOrder = signal('title-asc');
  isCreating = signal(false);
  isEditing = signal(false);
  selectedTopic = signal<TopicResponse | undefined>(undefined);

 sortedTopics = computed(() => {
  const order = this.sortOrder();

  return [...this.topics()].sort((a, b) => {
    if (order === 'title-asc') {
      return a.title.localeCompare(b.title);
    }

    if (order === 'title-desc') {
      return b.title.localeCompare(a.title);
    }

    return 0;
  });
});

pageNumbers = computed(() =>
  Array.from({ length: this.totalPages() }, (_, i) => i + 1),
);

ngOnInit() {
  if (this.subjectStore.subjects().length === 0) {
    this.loadSubjects();
  } else if (this.chapterStore.chapters().length === 0) {
    this.loadChapters();
  } else {
    this.loadTopics();
  }
}


  loadChapters(): void {
  this.chapterService.getChapters({
    page: 1,
    pageSize: 100,
    subjectSlug: this.subjectStore.selectedSubject()?.slug
  }).subscribe({
    next: (response) => {

      this.chapterStore.setChapters(response.data.items);

      if (response.data.items.length > 0) {
        this.chapterStore.selectedChapter.set(response.data.items[0]);

        this.loadTopics();
      }
    }
  });
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

  loadTopics(search?: string): void {
  this.loading.set(true);

  this.topicService.getTopics({
    page: this.page(),
    pageSize: this.pageSize,
    search,
    chapterId: this.chapterStore.selectedChapter()?.id
  }).subscribe({

    next: (response) => {
console.log('NEXT ❤️‍🔥');

console.log(response);
     this.topicStore.setTopics(response.data.items);

console.log('Store topics: 🥬', this.topicStore.topics());
   this.loading.set(false);
if (response.data.items.length > 0) {
  this.topicStore.selectedTopic.set(response.data.items[0]);
}

      this.totalCount.set(response.data.totalCount);
      this.totalPages.set(response.data.totalPages);

      this.loading.set(false);
    },
    error: (err) => {
        console.log('ERROR');
    console.error(err);
      this.loading.set(false);
    }
  });
}

 onSearch(query: string) {
  this.search.set(query);
  this.page.set(1);
  this.loadTopics(query);
}

  onSort(order: string): void {
    this.sortOrder.set(order);
  }

  onPageChange(newPage: number): void {
    this.page.set(newPage);
    this.loadTopics(this.search());
  }

  onCreate(): void {
    this.selectedTopic.set(undefined);
    this.isCreating.set(true);
    this.isEditing.set(false);
  }

  onEdit(topic: TopicListResponse): void {
    this.topicService.getTopicById(topic.id).subscribe({
      next: (response) => {
        this.selectedTopic.set(response.data);
        this.isEditing.set(true);
        this.isCreating.set(false);
      },
    });
  }

  onChapterChange(chapter: ChapterListResponse) {
  this.chapterStore.selectedChapter.set(chapter);
  this.page.set(1);
  this.loadTopics();
}

  onDelete(topic: TopicListResponse): void {
    if (confirm(`Are you sure you want to delete ${topic.title}?`)) {
      this.topicService.deleteTopic(topic.id).subscribe({
        next: () => {
          this.loadTopics();
        },
      });
    }
  }

  onSave(request: CreateTopicRequest): void {
    if (this.isEditing() && this.selectedTopic()) {
      const id = this.selectedTopic()!.id;

      const updateRequest = {
        title: request.title,
      };

      this.topicService.updateTopic(id, updateRequest).subscribe({
        next: () => {
          this.onCancel();
          this.loadTopics();
        },
      });

      return;
    }

    this.topicService.createTopic(request).subscribe({
      next: () => {
        this.onCancel();
        this.loadTopics();
      },
    });
  }

  onCancel(): void {
    this.isCreating.set(false);
    this.isEditing.set(false);
    this.selectedTopic.set(undefined);
  }

  onMove(topic: TopicListResponse, direction: 'Up' | 'Down'): void {
    this.topicService.moveTopic(topic.id, direction).subscribe({
      next: () => this.loadTopics(this.search()),
    });
  }
}
