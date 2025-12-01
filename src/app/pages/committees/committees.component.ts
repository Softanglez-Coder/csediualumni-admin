import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommitteeService, Committee, CreateCommitteeDto } from '../../services/committee.service';

@Component({
  selector: 'app-admin-committees',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Committee Management</h1>
              <p class="text-gray-600 mt-2">Manage alumni committees, designations, and members</p>
            </div>
            <button
              (click)="showCreateModal = true"
              class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
            >
              <i class="fas fa-plus mr-2"></i>
              Create Committee
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"
          ></div>
          <p class="mt-4 text-gray-600">Loading committees...</p>
        </div>

        <!-- Committees List -->
        <div *ngIf="!loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            *ngFor="let committee of committees"
            class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-xl font-bold text-gray-900">{{ committee.name }}</h3>
                  <span
                    *ngIf="committee.isCurrent"
                    class="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full"
                  >
                    Current
                  </span>
                </div>
                <p class="text-purple-600 font-semibold">{{ committee.year }}</p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  (click)="toggleCurrent(committee)"
                  [class.bg-green-100]="committee.isCurrent"
                  [class.text-green-600]="committee.isCurrent"
                  [class.bg-gray-100]="!committee.isCurrent"
                  [class.text-gray-600]="!committee.isCurrent"
                  class="p-2 rounded-lg hover:shadow-md transition-all"
                  title="Toggle Current"
                >
                  <i class="fas fa-star"></i>
                </button>
              </div>
            </div>

            <p *ngIf="committee.description" class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ committee.description }}
            </p>

            <div class="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <div class="flex items-center gap-1">
                  <i class="fas fa-user-tie"></i>
                  <span>{{ committee.designations.length }} Roles</span>
                </div>
                <div class="flex items-center gap-1">
                  <i class="fas fa-users"></i>
                  <span>{{ committee.members.length }} Members</span>
                </div>
              </div>
            </div>

            <div class="flex gap-2">
              <button
                (click)="viewDetails(committee._id)"
                class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-semibold"
              >
                <i class="fas fa-eye mr-2"></i>
                Manage
              </button>
              <button
                (click)="deleteCommittee(committee)"
                class="px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                title="Delete"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          *ngIf="!loading && committees.length === 0"
          class="text-center py-12 bg-white rounded-2xl shadow-lg"
        >
          <i class="fas fa-users text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-bold text-gray-900 mb-2">No Committees Yet</h3>
          <p class="text-gray-600 mb-6">Create your first committee to get started</p>
          <button
            (click)="showCreateModal = true"
            class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
          >
            <i class="fas fa-plus mr-2"></i>
            Create Committee
          </button>
        </div>
      </div>
    </div>

    <!-- Create Committee Modal -->
    <div
      *ngIf="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      (click)="showCreateModal = false"
    >
      <div
        class="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl"
        (click)="$event.stopPropagation()"
      >
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Create New Committee</h2>

        <form (ngSubmit)="createCommittee()" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Committee Name</label>
            <input
              type="text"
              [(ngModel)]="newCommittee.name"
              name="name"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Executive Committee 2025"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Year</label>
            <input
              type="number"
              [(ngModel)]="newCommittee.year"
              name="year"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="2025"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Description (Optional)</label
            >
            <textarea
              [(ngModel)]="newCommittee.description"
              name="description"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Brief description of the committee"
            ></textarea>
          </div>

          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              [(ngModel)]="newCommittee.isCurrent"
              name="isCurrent"
              id="isCurrent"
              class="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label for="isCurrent" class="text-sm font-semibold text-gray-700"
              >Set as current committee</label
            >
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              (click)="showCreateModal = false"
              class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="creating"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50"
            >
              <span *ngIf="!creating">Create</span>
              <span *ngIf="creating">Creating...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `,
  ],
})
export class AdminCommitteesComponent implements OnInit {
  committees: Committee[] = [];
  loading = false;
  creating = false;
  showCreateModal = false;

  newCommittee: CreateCommitteeDto = {
    name: '',
    year: new Date().getFullYear(),
    description: '',
    isCurrent: false,
  };

  constructor(
    private router: Router,
    private committeeService: CommitteeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCommittees();
  }

  loadCommittees(): void {
    this.loading = true;
    this.committeeService.getAllCommittees().subscribe({
      next: (committees) => {
        this.committees = committees;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading committees:', error);
        alert('Failed to load committees');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  createCommittee(): void {
    if (!this.newCommittee.name || !this.newCommittee.year) {
      alert('Please fill in all required fields');
      return;
    }

    this.creating = true;
    this.committeeService.createCommittee(this.newCommittee).subscribe({
      next: (committee) => {
        this.committees = [committee, ...this.committees];
        this.showCreateModal = false;
        this.resetForm();
        this.creating = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error creating committee:', error);
        alert('Failed to create committee');
        this.creating = false;
        this.cdr.detectChanges();
      },
    });
  }

  toggleCurrent(committee: Committee): void {
    this.committeeService.toggleCurrentCommittee(committee._id).subscribe({
      next: (updated) => {
        // Update the committees list
        this.committees = this.committees.map((c) =>
          c._id === updated._id ? updated : { ...c, isCurrent: false }
        );
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error toggling current committee:', error);
        alert('Failed to toggle current committee');
        this.cdr.detectChanges();
      },
    });
  }

  viewDetails(committeeId: string): void {
    this.router.navigate(['/committees', committeeId]);
  }

  deleteCommittee(committee: Committee): void {
    if (!confirm(`Are you sure you want to delete "${committee.name}"?`)) {
      return;
    }

    this.committeeService.deleteCommittee(committee._id).subscribe({
      next: () => {
        this.committees = this.committees.filter((c) => c._id !== committee._id);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error deleting committee:', error);
        alert('Failed to delete committee');
        this.cdr.detectChanges();
      },
    });
  }

  resetForm(): void {
    this.newCommittee = {
      name: '',
      year: new Date().getFullYear(),
      description: '',
      isCurrent: false,
    };
  }
}
