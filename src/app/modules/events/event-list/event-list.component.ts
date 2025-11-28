import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService, Event } from '../../../core/services/event.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-[var(--text-color)]">Events Management</h1>
        <a routerLink="/events/new" class="btn btn-primary flex items-center gap-2">
          <i class="fas fa-plus"></i> Create Event
        </a>
      </div>
    
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (event of events(); track event) {
          <div class="card hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
            <div class="flex justify-between items-start mb-4">
              <span class="px-2 py-1 rounded-full text-xs font-bold uppercase" 
                [ngClass]="{
                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': event.status === 'upcoming',
                  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300': event.status === 'completed',
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': event.status === 'cancelled'
                }">
                {{ event.status | titlecase }}
              </span>
              <div class="flex gap-2">
                <a [routerLink]="['/events', event.id]" class="btn-icon text-blue-500 hover:text-blue-600">
                  <i class="fas fa-edit"></i>
                </a>
                <button class="btn-icon text-red-500 hover:text-red-600" (click)="deleteEvent(event)">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-[var(--text-color)] mb-3">{{ event.title }}</h3>
            <div class="flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
              <div class="flex items-center gap-2">
                <i class="fas fa-calendar-alt w-5 text-center"></i>
                <span>{{ event.date | date:'mediumDate' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-map-marker-alt w-5 text-center"></i>
                <span>{{ event.location }}</span>
              </div>
            </div>
          </div>
        }
    
        <a routerLink="/events/new" class="card border-2 border-dashed border-[var(--border-color)] bg-transparent hover:border-[var(--primary-color)] hover:bg-[var(--bg-color)] flex flex-col items-center justify-center min-h-[200px] cursor-pointer group transition-all duration-200">
          <div class="w-12 h-12 rounded-full bg-[var(--bg-color)] group-hover:bg-[var(--primary-color)] text-[var(--text-secondary)] group-hover:text-white flex items-center justify-center text-2xl mb-2 transition-colors duration-200">
            <i class="fas fa-plus"></i>
          </div>
          <span class="font-medium text-[var(--text-secondary)] group-hover:text-[var(--primary-color)] transition-colors duration-200">Create New Event</span>
        </a>
      </div>
    </div>
  `,
  styles: []
})
export class EventListComponent implements OnInit {
  private eventService = inject(EventService);
  events = signal<Event[]>([]);

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getEvents().subscribe(data => {
      this.events.set(data);
    });
  }

  deleteEvent(event: Event) {
    if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
      // Mock delete
      this.events.update(list => list.filter(e => e.id !== event.id));
    }
  }
}
