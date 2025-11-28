import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../core/services/blog.service';

@Component({
    selector: 'app-blog-detail',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <button class="btn btn-outline" (click)="goBack()">← Back</button>
          <h1 class="title">{{ isNew() ? 'Create Post' : 'Edit Post' }}</h1>
        </div>
      </div>

      <div class="card detail-card">
        <form [formGroup]="postForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Title</label>
              <input type="text" formControlName="title" placeholder="Post title">
            </div>
            
            <div class="form-group">
              <label>Status</label>
              <select formControlName="status">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            
            <div class="form-group full-width">
              <label>Content</label>
              <textarea formControlName="content" rows="10" placeholder="Write your post content here..."></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="postForm.invalid || isSaving">
              {{ isSaving ? 'Saving...' : (isNew() ? 'Create Post' : 'Update Post') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .page-container {
      max-width: 800px;
      margin: 0 auto;
    }
    .page-header {
      margin-bottom: 2rem;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-color);
    }
    .detail-card {
      padding: 2rem;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .full-width {
      grid-column: 1 / -1;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      
      label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-secondary);
      }
      
      input, select, textarea {
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        background-color: var(--bg-color);
        color: var(--text-color);
        font-size: 1rem;
        font-family: inherit;
        
        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
    }
  `]
})
export class BlogDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private blogService = inject(BlogService);
    private fb = inject(FormBuilder);

    isNew = signal(true);
    postId: number | null = null;
    isSaving = false;

    postForm = this.fb.group({
        title: ['', Validators.required],
        status: ['draft', Validators.required],
        content: ['', Validators.required]
    });

    ngOnInit() {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam && idParam !== 'new') {
            this.isNew.set(false);
            this.postId = Number(idParam);
            this.loadPost(this.postId);
        }
    }

    loadPost(id: number) {
        this.blogService.getPostById(id).subscribe(post => {
            this.postForm.patchValue(post);
        });
    }

    onSubmit() {
        if (this.postForm.valid) {
            this.isSaving = true;
            const postData = this.postForm.value as any;

            if (this.isNew()) {
                this.blogService.createPost(postData).subscribe({
                    next: () => this.goBack(),
                    error: () => this.isSaving = false
                });
            } else {
                this.blogService.updatePost(this.postId!, postData).subscribe({
                    next: () => this.goBack(),
                    error: () => this.isSaving = false
                });
            }
        }
    }

    goBack() {
        this.router.navigate(['/blogs']);
    }
}
