import { Component, OnInit, inject, signal } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, Event } from '../../../core/services/event.service';

@Component({
    selector: 'app-event-detail',
    standalone: true,
    imports: [ReactiveFormsModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <button class="btn btn-outline" (click)="goBack()">← Back</button>
          <h1 class="title">{{ isNew() ? 'Create Event' : 'Edit Event' }}</h1>
        </div>
      </div>

      <div class="card detail-card">
        <form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Event Title</label>
              <input type="text" formControlName="title" placeholder="e.g. Annual Alumni Meetup">
            </div>
            
            <div class="form-group">
              <label>Date</label>
              <input type="date" formControlName="date">
            </div>
            
            <div class="form-group">
              <label>Location</label>
              <input type="text" formControlName="location" placeholder="e.g. Dhaka or Online">
            </div>
            
            <div class="form-group">
              <label>Status</label>
              <select formControlName="status">
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label>Description</label>
              <textarea formControlName="description" rows="4" placeholder="Event details..."></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="eventForm.invalid || isSaving">
              {{ isSaving ? 'Saving...' : (isNew() ? 'Create Event' : 'Update Event') }}
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
export class EventDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private eventService = inject(EventService);
    private fb = inject(FormBuilder);

    isNew = signal(true);
    eventId: number | null = null;
    isSaving = false;

    eventForm = this.fb.group({
        title: ['', Validators.required],
        date: ['', Validators.required],
        location: ['', Validators.required],
        status: ['upcoming', Validators.required],
        description: ['']
    });

    ngOnInit() {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam && idParam !== 'new') {
            this.isNew.set(false);
            this.eventId = Number(idParam);
            this.loadEvent(this.eventId);
        }
    }

    loadEvent(id: number) {
        this.eventService.getEventById(id).subscribe(event => {
            this.eventForm.patchValue(event);
        });
    }

    onSubmit() {
        if (this.eventForm.valid) {
            this.isSaving = true;
            const eventData = this.eventForm.value as any;

            if (this.isNew()) {
                this.eventService.createEvent(eventData).subscribe({
                    next: () => this.goBack(),
                    error: () => this.isSaving = false
                });
            } else {
                this.eventService.updateEvent(this.eventId!, eventData).subscribe({
                    next: () => this.goBack(),
                    error: () => this.isSaving = false
                });
            }
        }
    }

    goBack() {
        this.router.navigate(['/events']);
    }
}
