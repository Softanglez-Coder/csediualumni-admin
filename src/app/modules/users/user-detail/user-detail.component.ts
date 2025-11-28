import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from '../../../core/services/user.service';

@Component({
    selector: 'app-user-detail',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <button class="btn btn-outline" (click)="goBack()">← Back</button>
          <h1 class="title">{{ isEditing() ? 'Edit User' : 'User Details' }}</h1>
        </div>
        <button class="btn btn-primary" *ngIf="!isEditing()" (click)="enableEditing()">
          Edit User
        </button>
      </div>

      <div class="card detail-card" *ngIf="user()">
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" formControlName="name" [readonly]="!isEditing()">
            </div>
            
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" formControlName="email" [readonly]="!isEditing()">
            </div>
            
            <div class="form-group">
              <label>Role</label>
              <select formControlName="role" *ngIf="isEditing()">
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </select>
              <input type="text" [value]="user()?.role | titlecase" readonly *ngIf="!isEditing()">
            </div>
            
            <div class="form-group">
              <label>Status</label>
              <select formControlName="status" *ngIf="isEditing()">
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <div class="status-display" *ngIf="!isEditing()">
                <span class="status-dot" [ngClass]="user()?.status"></span>
                {{ user()?.status | titlecase }}
              </div>
            </div>

            <div class="form-group">
              <label>Joined Date</label>
              <input type="text" [value]="user()?.joinedDate | date" readonly>
            </div>
          </div>

          <div class="form-actions" *ngIf="isEditing()">
            <button type="button" class="btn btn-outline" (click)="cancelEditing()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="userForm.invalid || isSaving">
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
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
      display: flex;
      justify-content: space-between;
      align-items: center;
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
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      
      label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-secondary);
      }
      
      input, select {
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        background-color: var(--bg-color);
        color: var(--text-color);
        font-size: 1rem;
        
        &:read-only {
          border-color: transparent;
          background-color: transparent;
          padding-left: 0;
          pointer-events: none;
        }
        
        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }
    }
    .status-display {
      display: flex;
      align-items: center;
      padding: 0.75rem 0;
      font-size: 1rem;
      color: var(--text-color);
    }
    .status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 0.5rem;
      &.active { background-color: var(--secondary-color); }
      &.pending { background-color: var(--accent-color); }
      &.rejected { background-color: var(--danger-color); }
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
export class UserDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private userService = inject(UserService);
    private fb = inject(FormBuilder);

    user = signal<User | null>(null);
    isEditing = signal(false);
    isSaving = false;

    userForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        role: ['', Validators.required],
        status: ['', Validators.required]
    });

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.loadUser(id);
        }
    }

    loadUser(id: number) {
        this.userService.getUserById(id).subscribe(user => {
            this.user.set(user);
            this.userForm.patchValue(user);
        });
    }

    enableEditing() {
        this.isEditing.set(true);
    }

    cancelEditing() {
        this.isEditing.set(false);
        if (this.user()) {
            this.userForm.patchValue(this.user()!);
        }
    }

    onSubmit() {
        if (this.userForm.valid && this.user()) {
            this.isSaving = true;
            const updatedData = this.userForm.value;

            this.userService.updateUser(this.user()!.id, updatedData as Partial<User>).subscribe({
                next: (updatedUser) => {
                    this.user.set(updatedUser);
                    this.isEditing.set(false);
                    this.isSaving = false;
                },
                error: () => {
                    this.isSaving = false;
                }
            });
        }
    }

    goBack() {
        this.router.navigate(['/users']);
    }
}
