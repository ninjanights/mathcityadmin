import { Component, input, output } from '@angular/core';
import { TopicListResponse } from '../../models';

@Component({
  selector: 'app-topic-card',
  standalone: true,
  templateUrl: './topic-card.html',
})
export class TopicCard {
  topic = input.required<TopicListResponse>();
  chapterTitle = input<string>('Unknown chapter');

  edit = output<TopicListResponse>();
  delete = output<TopicListResponse>();
}