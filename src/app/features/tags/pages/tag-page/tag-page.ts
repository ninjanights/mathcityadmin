
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagForm, TagHeader, TagList } from '../../components';
import { TagService } from '../../services';
import {
  CreateTagRequest,
  TagListResponse,
  TagPagedResult,
  TagQuery,
  TagResponse,
  UpdateTagRequest } from './../../models/index';

@Component({
  selector: 'app-tag-page',
  standalone: true,
  imports: [CommonModule, TagHeader, TagList, TagForm],
  templateUrl: './tag-page.html',
})
export class TagPage implements OnInit {
  private readonly tagService = inject(TagService);

  tags = signal<TagListResponse[]>([]);
  loading = signal(false);
page = signal(1);
pageSize = signal(10);
totalCount = signal(0);
search = signal('');
  totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()));
  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, index) => index + 1));
  sortOrder = signal('title-asc');
  isCreating = signal(false);
  isEditing = signal(false);
  selectedTag = signal<TagResponse | undefined>(undefined);

  sortedTags = computed(() => {
    const order = this.sortOrder();

    return [...this.tags()].sort((a, b) => {
      if (order === 'title-asc') {
        return a.name.localeCompare(b.name);
      }

      if (order === 'title-desc') {
        return b.name.localeCompare(a.name);
      }

      return 0;
    });
  });

  ngOnInit(): void {
    this.loadTags();
  }
loadTags(): void {
  this.loading.set(true);

  const query: TagQuery = {
    search: this.search(),
    page: this.page(),
    pageSize: this.pageSize(),
  };

  this.tagService.getTags(query).subscribe({
    next: (response) => {
      this.tags.set(response.data.items);
      this.totalCount.set(response.data.totalCount);
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
  this.loadTags();
}

  onSort(order: string): void {
    this.sortOrder.set(order);
  }

  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages()) return;
    this.page.set(newPage);
    this.loadTags();
  }

  onCreate(): void {
    this.selectedTag.set(undefined);
    this.isCreating.set(true);
    this.isEditing.set(false);
  }

  onEdit(tag: TagListResponse): void {
    this.tagService.getTagById(tag.id).subscribe({
      next: (response) => {
        this.selectedTag.set(response.data);
        this.isEditing.set(true);
        this.isCreating.set(false);
      },
    });
  }

  onDelete(tag: TagListResponse): void {
    if (confirm(`Are you sure you want to delete ${tag.name}?`)) {
      this.tagService.deleteTag(tag.id).subscribe({
        next: () => {
          this.loadTags();
        },
      });
    }
  }

  onSave(request: CreateTagRequest): void {
    if (this.isEditing() && this.selectedTag()) {
      this.tagService.updateTag(this.selectedTag()!.id, request).subscribe({
        next: () => {
          this.onCancel();
          this.loadTags();
        },
      });

      return;
    }

    this.tagService.createTag(request).subscribe({
      next: () => {
        this.onCancel();
        this.loadTags();
      },
    });
  }

  onCancel(): void {
    this.isCreating.set(false);
    this.isEditing.set(false);
    this.selectedTag.set(undefined);
  }
}
