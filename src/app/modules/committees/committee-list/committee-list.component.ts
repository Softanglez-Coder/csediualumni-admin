import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommitteeService, Committee } from '../../../core/services/committee.service';

@Component({
    selector: 'app-committee-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="title">Committees</h1>
        <a routerLink="/committees/new" class="btn btn-primary">
          <span>+</span> Create Committee
        </a>
      </div>
    
      <div class="grid-container">
        @for (committee of committees(); track committee) {
          <div class="card committee-card">
            <div class="card-header">
              <h3 class="committee-name">{{ committee.name }}</h3>
              <span class="status-badge" [ngClass]="committee.status">{{ committee.status | titlecase }}</span>
            </div>
            <p class="description">{{ committee.description }}</p>
            <div class="stats">
              <div class="stat">
                <span class="label">Members</span>
                <span class="value">{{ committee.membersCount }}</span>
              </div>
              <div class="stat">
                <span class="label">Formed</span>
                <span class="value">{{ committee.formedDate | date }}</span>
              </div>
            </div>
            <div class="actions">
              <a [routerLink]="['/committees', committee.id]" class="btn btn-outline btn-sm">Manage</a>
              <button class="btn btn-outline btn-sm danger" (click)="deleteCommittee(committee)">Delete</button>
            </div>
          </div>
        }
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
    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .committee-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
    }
    .committee-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-color);
      margin: 0;
    }
    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      &.active { background-color: #d1fae5; color: #059669; }
      &.inactive { background-color: #f3f4f6; color: #4b5563; }
    }
    .description {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: 0;
      line-height: 1.5;
    }
    .stats {
      display: flex;
      gap: 1.5rem;
      padding: 1rem 0;
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
    }
    .stat {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      .label { font-size: 0.75rem; color: var(--text-secondary); }
      .value { font-weight: 600; color: var(--text-color); }
    }
    .actions {
      display: flex;
      gap: 0.5rem;
      margin-top: auto;
    }
    .btn-sm {
      padding: 0.25rem 0.75rem;
      font-size: 0.875rem;
      flex: 1;
    }
    .danger {
      color: var(--danger-color);
      border-color: var(--danger-color);
      &:hover {
        background-color: #fee2e2;
      }
    }
  `]
})
export class CommitteeListComponent implements OnInit {
    private committeeService = inject(CommitteeService);
    committees = signal<Committee[]>([]);

    ngOnInit() {
        this.loadCommittees();
    }

    loadCommittees() {
        this.committeeService.getCommittees().subscribe(data => {
            this.committees.set(data);
        });
    }

    deleteCommittee(committee: Committee) {
        if (confirm(`Delete committee "${committee.name}"?`)) {
            this.committees.update(list => list.filter(c => c.id !== committee.id));
        }
    }
}
