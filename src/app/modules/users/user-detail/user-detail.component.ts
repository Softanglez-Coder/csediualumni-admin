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
    <div class="max-w-3xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-4">
          <button class="btn btn-outline flex items-center gap-2" (click)="goBack()">
            <i class="fas fa-arrow-left"></i> Back
          </button>
          <h1 class="text-2xl font-bold text-[var(--text-color)]">{{ isEditing() ? 'Edit User' : 'User Details' }}</h1>
        </div>
        @if (!isEditing()) {
          <button class="btn btn-primary flex items-center gap-2" (click)="enableEditing()">
            <i class="fas fa-edit"></i> Edit User
          </button>
        }
      </div>
    
      @if (user()) {
        <div class="card p-6">
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Full Name</label>
                <input type="text" formControlName="name" [readonly]="!isEditing()" class="input-field" [class.bg-transparent]="!isEditing()" [class.border-transparent]="!isEditing()" [class.pl-0]="!isEditing()">
              </div>
              <div>
                <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Email Address</label>
                <input type="email" formControlName="email" [readonly]="!isEditing()" class="input-field" [class.bg-transparent]="!isEditing()" [class.border-transparent]="!isEditing()" [class.pl-0]="!isEditing()">
              </div>
              <div>
                <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Role</label>
                @if (isEditing()) {
                  <select formControlName="role" class="input-field">
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                }
                @if (!isEditing()) {
                  <div class="py-2 text-[var(--text-color)]">{{ user()?.role | titlecase }}</div>
                }
              </div>
              <div>
                <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Status</label>
                @if (isEditing()) {
                  <select formControlName="status" class="input-field">
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                }
                @if (!isEditing()) {
                  <div class="flex items-center gap-2 py-2">
                    <span class="w-2 h-2 rounded-full" 
                      [ngClass]="{
                        'bg-emerald-500': user()?.status === 'active',
                        'bg-amber-500': user()?.status === 'pending',
                        'bg-red-500': user()?.status === 'rejected'
                      }">
                    </span>
                    <span class="text-[var(--text-color)]">{{ user()?.status | titlecase }}</span>
                  </div>
                }
              </div>
              <div>
                <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Joined Date</label>
                <div class="py-2 text-[var(--text-color)]">{{ user()?.joinedDate | date }}</div>
              </div>
            </div>
            @if (isEditing()) {
              <div class="flex justify-end gap-4 pt-6 border-t border-[var(--border-color)]">
                <button type="button" class="btn btn-outline" (click)="cancelEditing()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="userForm.invalid || isSaving">
                  {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            }
          </form>
        </div>
      }
    </div>
  `,
  styles: []
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
