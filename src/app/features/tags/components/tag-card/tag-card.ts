import { Component, input, output } from '@angular/core';
import { TagListResponse } from '../../models';

@Component({
  selector: 'app-tag-card',
  standalone: true,
  templateUrl: './tag-card.html',
})
export class TagCard {
  tag = input.required<TagListResponse>();

  edit = output<TagListResponse>();
  delete = output<TagListResponse>();
}