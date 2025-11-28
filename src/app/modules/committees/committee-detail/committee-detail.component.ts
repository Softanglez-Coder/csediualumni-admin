import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommitteeService } from '../../../core/services/committee.service';

@Component({
    selector: 'app-committee-detail',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <button class="btn btn-outline" (click)="goBack()">← Back</button>
          <h1 class="title">{{ isNew() ? 'Create Committee' : 'Edit Committee' }}</h1>
        </div>
      </div>

      <div class="card detail-card">
        <form [formGroup]="committeeForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Committee Name</label>
              <input type="text" formControlName="name" placeholder="e.g. Executive Committee">
            </div>
            
            <div class="form-group">
              <label>Status</label>
              <select formControlName="status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Formation Date</label>
              <input type="date" formControlName="formedDate">
            </div>

            <div class="form-group full-width">
              <label>Description</label>
              <textarea formControlName="description" rows="4" placeholder="Purpose of this committee..."></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="committeeForm.invalid || isSaving">
              {{ isSaving ? 'Saving...' : (isNew() ? 'Create Committee' : 'Update Committee') }}
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
export class CommitteeDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private committeeService = inject(CommitteeService);
    private fb = inject(FormBuilder);

    isNew = signal(true);
    committeeId: number | null = null;
    isSaving = false;

    committeeForm = this.fb.group({
        name: ['', Validators.required],
        status: ['active', Validators.required],
        formedDate: ['', Validators.required],
        description: ['']
    });

    ngOnInit() {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam && idParam !== 'new') {
            this.isNew.set(false);
            this.committeeId = Number(idParam);
            this.loadCommittee(this.committeeId);
        }
    }

    loadCommittee(id: number) {
        this.committeeService.getCommitteeById(id).subscribe(committee => {
            this.committeeForm.patchValue(committee);
        });
    }

    onSubmit() {
        if (this.committeeForm.valid) {
            this.isSaving = true;
            const committeeData = this.committeeForm.value as any;

            if (this.isNew()) {
                this.committeeService.createCommittee(committeeData).subscribe({
                    next: () => this.goBack(),
                    error: () => this.isSaving = false
                });
            } else {
                this.committeeService.updateCommittee(this.committeeId!, committeeData).subscribe({
                    next: () => this.goBack(),
                    error: () => this.isSaving = false
                });
            }
        }
    }

    goBack() {
        this.router.navigate(['/committees']);
    }
}
