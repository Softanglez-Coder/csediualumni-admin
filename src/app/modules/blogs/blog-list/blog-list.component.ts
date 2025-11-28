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
      <div class="page-header">
        <h1 class="title">Blogs Management</h1>
        <a routerLink="/blogs/new" class="btn btn-primary">
          <span>+</span> Create Post
        </a>
      </div>

      <div class="grid-container">
        <div class="card post-card" *ngFor="let post of posts()">
          <div class="post-header">
            <span class="status-badge" [ngClass]="post.status">{{ post.status | titlecase }}</span>
            <div class="actions">
              <a [routerLink]="['/blogs', post.id]" class="btn-icon">✏️</a>
              <button class="btn-icon danger" (click)="deletePost(post)">🗑️</button>
            </div>
          </div>
          <h3 class="post-title">{{ post.title }}</h3>
          <div class="post-meta">
            <span>By {{ post.author }}</span>
            <span>•</span>
            <span>{{ post.date | date }}</span>
          </div>
          <div class="tags">
            <span class="tag" *ngFor="let tag of post.tags">#{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-color);
      }
    }
    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .post-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      &.published { background-color: #d1fae5; color: #059669; }
      &.draft { background-color: #f3f4f6; color: #4b5563; }
    }
    .post-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-color);
      margin: 0;
    }
    .post-meta {
      font-size: 0.875rem;
      color: var(--text-secondary);
      display: flex;
      gap: 0.5rem;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .tag {
      background-color: var(--bg-color);
      color: var(--primary-color);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
    }
    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      opacity: 0.6;
      transition: opacity 0.2s;
      text-decoration: none;
      &:hover { opacity: 1; }
    }
  `]
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
