import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CommitteeService,
  Committee,
  Designation,
  CreateDesignationDto,
  AddCommitteeMemberDto,
} from '../../services/committee.service';

const AVAILABLE_ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'reviewer', label: 'Reviewer' },
  { value: 'member', label: 'Member' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'event_manager', label: 'Event Manager' },
  { value: 'system_admin', label: 'System Admin' },
];

@Component({
  selector: 'app-committee-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Back Button -->
        <button
          routerLink="/committees"
          class="mb-6 px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all border border-gray-200"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Back to Committees
        </button>

        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"
          ></div>
          <p class="mt-4 text-gray-600">Loading committee details...</p>
        </div>

        <!-- Committee Details -->
        <div *ngIf="!loading && committee">
          <!-- Header -->
          <div class="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <h1 class="text-3xl font-bold text-gray-900">{{ committee.name }}</h1>
                  <span
                    *ngIf="committee.isCurrent"
                    class="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full"
                  >
                    Current Committee
                  </span>
                </div>
                <p class="text-xl text-purple-600 font-semibold mb-2">{{ committee.year }}</p>
                <p *ngIf="committee.description" class="text-gray-600">
                  {{ committee.description }}
                </p>
              </div>
              <div class="flex gap-3">
                <button
                  (click)="showEditModal = true"
                  class="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all"
                >
                  <i class="fas fa-edit mr-2"></i>
                  Edit
                </button>
              </div>
            </div>

            <div class="flex gap-6 mt-6 pt-6 border-t border-gray-100">
              <div class="text-center">
                <p class="text-3xl font-bold text-purple-600">
                  {{ committee.designations.length }}
                </p>
                <p class="text-sm text-gray-600">Designations</p>
              </div>
              <div class="text-center">
                <p class="text-3xl font-bold text-pink-600">{{ committee.members.length }}</p>
                <p class="text-sm text-gray-600">Members</p>
              </div>
            </div>
          </div>

          <!-- Designations Section -->
          <div class="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-900">Designations</h2>
              <button
                (click)="showDesignationModal = true"
                class="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all"
              >
                <i class="fas fa-plus mr-2"></i>
                Add Designation
              </button>
            </div>

            <div *ngIf="committee.designations.length === 0" class="text-center py-8 text-gray-500">
              <i class="fas fa-user-tie text-4xl mb-2"></i>
              <p>No designations yet. Add one to get started.</p>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div
                *ngFor="let designation of committee.designations"
                class="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <h3 class="text-lg font-bold text-gray-900">{{ designation.name }}</h3>
                    <div class="flex flex-wrap gap-2 mt-2">
                      <span
                        *ngFor="let role of designation.roles"
                        class="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full"
                      >
                        {{ getRoleLabel(role) }}
                      </span>
                    </div>
                  </div>
                  <button
                    (click)="deleteDesignation(designation)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
                <p class="text-sm text-gray-600">
                  {{ getMemberCountForDesignation(designation._id) }} member(s)
                </p>
              </div>
            </div>
          </div>

          <!-- Members Section -->
          <div class="bg-white rounded-2xl p-8 shadow-lg">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-900">Members</h2>
              <button
                (click)="showMemberModal = true"
                class="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all"
              >
                <i class="fas fa-plus mr-2"></i>
                Add Member
              </button>
            </div>

            <div *ngIf="committee.members.length === 0" class="text-center py-8 text-gray-500">
              <i class="fas fa-users text-4xl mb-2"></i>
              <p>No members yet. Add one to get started.</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                *ngFor="let member of getPopulatedMembers()"
                class="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div class="flex items-start gap-3">
                  <img
                    *ngIf="member.userId.avatar"
                    [src]="member.userId.avatar"
                    [alt]="member.userId.firstName"
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div
                    *ngIf="!member.userId.avatar"
                    class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold"
                  >
                    {{ member.userId.firstName.charAt(0) }}{{ member.userId.lastName.charAt(0) }}
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-gray-900">
                      {{ member.userId.firstName }} {{ member.userId.lastName }}
                    </h4>
                    <p class="text-sm text-purple-600 font-semibold">
                      {{ getDesignationName(member.designationId) }}
                    </p>
                    <p class="text-xs text-gray-500">{{ member.userId.email }}</p>
                  </div>
                  <button
                    (click)="removeMember(member.userId._id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Remove"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Designation Modal -->
    <div
      *ngIf="showDesignationModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      (click)="showDesignationModal = false"
    >
      <div
        class="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl"
        (click)="$event.stopPropagation()"
      >
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Add Designation</h2>

        <form (ngSubmit)="addDesignation()" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Designation Name</label>
            <input
              type="text"
              [(ngModel)]="newDesignation.name"
              name="name"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., President, Vice President"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Roles</label>
            <div class="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-3">
              <div *ngFor="let role of availableRoles" class="flex items-center gap-2">
                <input
                  type="checkbox"
                  [id]="'role-' + role.value"
                  [value]="role.value"
                  (change)="toggleRole(role.value, $event)"
                  class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label [for]="'role-' + role.value" class="text-sm text-gray-700">
                  {{ role.label }}
                </label>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              (click)="showDesignationModal = false"
              class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="saving"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50"
            >
              <span *ngIf="!saving">Add</span>
              <span *ngIf="saving">Adding...</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Member Modal -->
    <div
      *ngIf="showMemberModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      (click)="showMemberModal = false"
    >
      <div
        class="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl"
        (click)="$event.stopPropagation()"
      >
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Add Member</h2>

        <form (ngSubmit)="addMember()" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">User Email</label>
            <input
              type="email"
              [(ngModel)]="newMember.email"
              name="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter user email address"
            />
            <p class="text-xs text-gray-500 mt-1">Enter the email of the user you want to add</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Designation</label>
            <select
              [(ngModel)]="newMember.designationId"
              name="designationId"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select a designation</option>
              <option *ngFor="let designation of committee?.designations" [value]="designation._id">
                {{ designation.name }}
              </option>
            </select>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              (click)="showMemberModal = false"
              class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="saving"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50"
            >
              <span *ngIf="!saving">Add</span>
              <span *ngIf="saving">Adding...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class CommitteeDetailsComponent implements OnInit {
  committee: Committee | null = null;
  loading = false;
  saving = false;
  committeeId: string = '';

  showDesignationModal = false;
  showMemberModal = false;
  showEditModal = false;

  availableRoles = AVAILABLE_ROLES;

  newDesignation: CreateDesignationDto = {
    name: '',
    roles: [],
  };

  newMember: AddCommitteeMemberDto = {
    email: '',
    designationId: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private committeeService: CommitteeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.committeeId = params['id'];
      if (this.committeeId) {
        this.loadCommittee();
      }
    });
  }

  loadCommittee(): void {
    this.loading = true;
    this.committeeService.getCommittee(this.committeeId).subscribe({
      next: (committee) => {
        this.committee = committee;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading committee:', error);
        alert('Failed to load committee details');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  toggleRole(roleValue: string, event: any): void {
    if (event.target.checked) {
      if (!this.newDesignation.roles.includes(roleValue)) {
        this.newDesignation.roles.push(roleValue);
      }
    } else {
      this.newDesignation.roles = this.newDesignation.roles.filter((r) => r !== roleValue);
    }
  }

  addDesignation(): void {
    if (!this.newDesignation.name || this.newDesignation.roles.length === 0) {
      alert('Please fill in all fields and select at least one role');
      return;
    }

    this.saving = true;
    this.committeeService.addDesignation(this.committeeId, this.newDesignation).subscribe({
      next: (updated) => {
        this.committee = updated;
        this.showDesignationModal = false;
        this.resetDesignationForm();
        this.saving = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error adding designation:', error);
        alert(error.error?.message || 'Failed to add designation');
        this.saving = false;
        this.cdr.detectChanges();
      },
    });
  }

  deleteDesignation(designation: Designation): void {
    if (!confirm(`Are you sure you want to delete the "${designation.name}" designation?`)) {
      return;
    }

    this.committeeService.removeDesignation(this.committeeId, designation._id).subscribe({
      next: () => {
        this.loadCommittee();
      },
      error: (error) => {
        console.error('Error deleting designation:', error);
        alert(error.error?.message || 'Failed to delete designation');
        this.cdr.detectChanges();
      },
    });
  }

  addMember(): void {
    if (!this.newMember.email || !this.newMember.designationId) {
      alert('Please fill in all fields');
      return;
    }

    this.saving = true;
    this.committeeService.addMember(this.committeeId, this.newMember).subscribe({
      next: (updated) => {
        this.committee = updated;
        this.showMemberModal = false;
        this.resetMemberForm();
        this.saving = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error adding member:', error);
        alert(error.error?.message || 'Failed to add member');
        this.saving = false;
        this.cdr.detectChanges();
      },
    });
  }

  removeMember(userId: string): void {
    if (!confirm('Are you sure you want to remove this member?')) {
      return;
    }

    this.committeeService.removeMember(this.committeeId, userId).subscribe({
      next: () => {
        this.loadCommittee();
      },
      error: (error) => {
        console.error('Error removing member:', error);
        alert('Failed to remove member');
        this.cdr.detectChanges();
      },
    });
  }

  getDesignationName(designationId: string): string {
    const designation = this.committee?.designations.find((d) => d._id === designationId);
    return designation?.name || 'Unknown';
  }

  getRoleLabel(roleValue: string): string {
    const role = this.availableRoles.find((r) => r.value === roleValue);
    return role?.label || roleValue;
  }

  getMemberCountForDesignation(designationId: string): number {
    return this.committee?.members.filter((m) => m.designationId === designationId).length || 0;
  }

  getPopulatedMembers() {
    return (
      (this.committee?.members.filter((m) => typeof m.userId !== 'string') as Array<{
        userId: {
          _id: string;
          firstName: string;
          lastName: string;
          email: string;
          avatar?: string;
        };
        designationId: string;
        joinedAt: Date;
      }>) || []
    );
  }

  resetDesignationForm(): void {
    this.newDesignation = {
      name: '',
      roles: [],
    };
  }

  resetMemberForm(): void {
    this.newMember = {
      email: '',
      designationId: '',
    };
  }
}
