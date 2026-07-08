import { Component, input, output } from '@angular/core';
import { TopicListResponse } from '../../models';
import { ChapterListResponse } from '../../../chapters/models';
import { TopicCard } from '../topic-card/topic-card';

@Component({
  selector: 'app-topic-list',
  standalone: true,
  imports: [TopicCard],
  templateUrl: './topic-list.html',
})
export class TopicList {
  topics = input.required<TopicListResponse[]>();
  chapters = input<ChapterListResponse[]>([]);

  edit = output<TopicListResponse>();
  delete = output<TopicListResponse>();

  chapterTitle(chapterId: string): string {
    return (
      this.chapters().find((chapter) => chapter.id === chapterId)?.title ??
      'Unknown chapter'
    );
  }
}