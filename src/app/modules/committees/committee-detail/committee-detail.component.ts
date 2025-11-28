import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommitteeService } from '../../../core/services/committee.service';

@Component({
  selector: 'app-committee-detail',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center gap-4 mb-6">
        <button class="btn btn-outline flex items-center gap-2" (click)="goBack()">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        <h1 class="text-2xl font-bold text-[var(--text-color)]">{{ isNew() ? 'Create Committee' : 'Edit Committee' }}</h1>
      </div>

      <div class="card p-6">
        <form [formGroup]="committeeForm" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Committee Name</label>
              <input type="text" formControlName="name" placeholder="e.g. Executive Committee" class="input-field">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Status</label>
              <select formControlName="status" class="input-field">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Formation Date</label>
              <input type="date" formControlName="formedDate" class="input-field">
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Description</label>
              <textarea formControlName="description" rows="4" placeholder="Purpose of this committee..." class="input-field"></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-4 pt-6 border-t border-[var(--border-color)]">
            <button type="button" class="btn btn-outline" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="committeeForm.invalid || isSaving">
              {{ isSaving ? 'Saving...' : (isNew() ? 'Create Committee' : 'Update Committee') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
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
