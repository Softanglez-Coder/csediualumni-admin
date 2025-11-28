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
      <div class="page-header">
        <h1 class="title">Events Management</h1>
        <a routerLink="/events/new" class="btn btn-primary">
          <span>+</span> Create Event
        </a>
      </div>
    
      <div class="events-grid">
        @for (event of events(); track event) {
          <div class="card event-card">
            <div class="event-header">
              <span class="status-badge" [ngClass]="event.status">{{ event.status | titlecase }}</span>
              <div class="actions">
                <a [routerLink]="['/events', event.id]" class="btn-icon">✏️</a>
                <button class="btn-icon danger" (click)="deleteEvent(event)">🗑️</button>
              </div>
            </div>
            <h3 class="event-title">{{ event.title }}</h3>
            <div class="event-details">
              <div class="detail-item">
                <span class="icon">📅</span>
                <span>{{ event.date | date:'mediumDate' }}</span>
              </div>
              <div class="detail-item">
                <span class="icon">📍</span>
                <span>{{ event.location }}</span>
              </div>
            </div>
          </div>
        }
    
        <div class="card event-card add-card" routerLink="/events/new">
          <div class="add-content">
            <span class="plus-icon">+</span>
            <span>Create New Event</span>
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
    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .event-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: transform 0.2s, box-shadow 0.2s;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }
    }
    .event-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      
      &.upcoming { background-color: #d1fae5; color: #059669; }
      &.completed { background-color: #f3f4f6; color: #4b5563; }
      &.cancelled { background-color: #fee2e2; color: #dc2626; }
    }
    .event-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-color);
      margin: 0;
    }
    .event-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
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
    .add-card {
      border: 2px dashed var(--border-color);
      background-color: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      
      &:hover {
        border-color: var(--primary-color);
        background-color: var(--bg-color);
        .add-content { color: var(--primary-color); }
      }
    }
    .add-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-weight: 500;
      
      .plus-icon {
        font-size: 2rem;
        font-weight: 300;
      }
    }
  `]
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
