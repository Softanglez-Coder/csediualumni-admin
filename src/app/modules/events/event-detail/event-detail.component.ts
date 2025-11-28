import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, Event } from '../../../core/services/event.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center gap-4 mb-6">
        <button class="btn btn-outline flex items-center gap-2" (click)="goBack()">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        <h1 class="text-2xl font-bold text-[var(--text-color)]">{{ isNew() ? 'Create Event' : 'Edit Event' }}</h1>
      </div>

      <div class="card p-6">
        <form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Event Title</label>
              <input type="text" formControlName="title" placeholder="e.g. Annual Alumni Meetup" class="input-field">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Date</label>
              <input type="date" formControlName="date" class="input-field">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Location</label>
              <input type="text" formControlName="location" placeholder="e.g. Dhaka or Online" class="input-field">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Status</label>
              <select formControlName="status" class="input-field">
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Description</label>
              <textarea formControlName="description" rows="4" placeholder="Event details..." class="input-field"></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-4 pt-6 border-t border-[var(--border-color)]">
            <button type="button" class="btn btn-outline" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="eventForm.invalid || isSaving">
              {{ isSaving ? 'Saving...' : (isNew() ? 'Create Event' : 'Update Event') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
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
