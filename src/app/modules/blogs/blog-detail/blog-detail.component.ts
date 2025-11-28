import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../core/services/blog.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center gap-4 mb-6">
        <button class="btn btn-outline flex items-center gap-2" (click)="goBack()">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        <h1 class="text-2xl font-bold text-[var(--text-color)]">{{ isNew() ? 'Create Post' : 'Edit Post' }}</h1>
      </div>

      <div class="card p-6">
        <form [formGroup]="postForm" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Title</label>
              <input type="text" formControlName="title" placeholder="Post title" class="input-field text-lg font-medium">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Status</label>
              <select formControlName="status" class="input-field w-auto">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Content</label>
              <textarea formControlName="content" rows="12" placeholder="Write your post content here..." class="input-field font-mono text-sm"></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-4 pt-6 border-t border-[var(--border-color)]">
            <button type="button" class="btn btn-outline" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="postForm.invalid || isSaving">
              {{ isSaving ? 'Saving...' : (isNew() ? 'Create Post' : 'Update Post') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
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
