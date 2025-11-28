import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService, BlogPost } from '../../../core/services/blog.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-[var(--text-color)]">Blogs Management</h1>
        <a routerLink="/blogs/new" class="btn btn-primary flex items-center gap-2">
          <i class="fas fa-plus"></i> Create Post
        </a>
      </div>
    
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (post of posts(); track post) {
          <div class="card hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
            <div class="flex justify-between items-start mb-4">
              <span class="px-2 py-1 rounded-full text-xs font-bold uppercase" 
                [ngClass]="{
                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': post.status === 'published',
                  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300': post.status === 'draft'
                }">
                {{ post.status | titlecase }}
              </span>
              <div class="flex gap-2">
                <a [routerLink]="['/blogs', post.id]" class="btn-icon text-blue-500 hover:text-blue-600">
                  <i class="fas fa-edit"></i>
                </a>
                <button class="btn-icon text-red-500 hover:text-red-600" (click)="deletePost(post)">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-[var(--text-color)] mb-3 line-clamp-2">{{ post.title }}</h3>
            <div class="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-4">
              <span class="font-medium text-[var(--text-color)]">By {{ post.author }}</span>
              <span>•</span>
              <span>{{ post.date | date }}</span>
            </div>
            <div class="flex flex-wrap gap-2 mt-auto">
              @for (tag of post.tags; track tag) {
                <span class="px-2 py-1 bg-[var(--bg-color)] text-[var(--primary-color)] rounded text-xs font-medium">#{{ tag }}</span>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class BlogListComponent implements OnInit {
  private blogService = inject(BlogService);
  posts = signal<BlogPost[]>([]);

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.blogService.getPosts().subscribe(data => {
      this.posts.set(data);
    });
  }

  deletePost(post: BlogPost) {
    if (confirm(`Delete post "${post.title}"?`)) {
      this.posts.update(list => list.filter(p => p.id !== post.id));
    }
  }
}
