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
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-[var(--text-color)]">Committees</h1>
        <a routerLink="/committees/new" class="btn btn-primary flex items-center gap-2">
          <i class="fas fa-plus"></i> Create Committee
        </a>
      </div>
    
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (committee of committees(); track committee) {
          <div class="card flex flex-col h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-lg font-semibold text-[var(--text-color)]">{{ committee.name }}</h3>
              <span class="px-2 py-1 rounded-full text-xs font-bold uppercase" 
                [ngClass]="{
                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': committee.status === 'active',
                  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300': committee.status === 'inactive'
                }">
                {{ committee.status | titlecase }}
              </span>
            </div>
            <p class="text-[var(--text-secondary)] text-sm mb-6 flex-grow">{{ committee.description }}</p>
            
            <div class="flex gap-6 py-4 border-t border-b border-[var(--border-color)] mb-4">
              <div class="flex flex-col">
                <span class="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Members</span>
                <span class="font-semibold text-[var(--text-color)]">{{ committee.membersCount }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Formed</span>
                <span class="font-semibold text-[var(--text-color)]">{{ committee.formedDate | date }}</span>
              </div>
            </div>

            <div class="flex gap-3 mt-auto">
              <a [routerLink]="['/committees', committee.id]" class="btn btn-outline btn-sm flex-1 text-center">Manage</a>
              <button class="btn btn-outline btn-sm text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20" (click)="deleteCommittee(committee)">Delete</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
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
