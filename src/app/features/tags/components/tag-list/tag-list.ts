import { Component, input, output } from '@angular/core';
import { TagListResponse } from '../../models';
import { TagCard } from '../tag-card/tag-card';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [TagCard],
  templateUrl: './tag-list.html',
})
export class TagList {
  tags = input.required<TagListResponse[]>();

  edit = output<TagListResponse>();
  delete = output<TagListResponse>();
}