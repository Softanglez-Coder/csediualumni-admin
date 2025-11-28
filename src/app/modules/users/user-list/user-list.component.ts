import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-[var(--text-color)]">User Management</h1>
        <button class="btn btn-primary flex items-center gap-2">
          <i class="fas fa-plus"></i> Add User
        </button>
      </div>
    
      <div class="card mb-6 p-4 flex flex-wrap gap-4 items-center justify-between">
        <div class="flex-1 min-w-[200px] relative">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"></i>
          <input
            type="text"
            placeholder="Search users..."
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            class="input-field pl-10"
          >
        </div>
        <div class="flex gap-3">
          <select [(ngModel)]="roleFilter" (change)="onFilterChange()" class="input-field w-auto">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
          <select [(ngModel)]="statusFilter" (change)="onFilterChange()" class="input-field w-auto">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
    
      <div class="card overflow-hidden p-0">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-[var(--bg-color)] border-b border-[var(--border-color)]">
              <tr>
                <th (click)="sort('name')" class="p-4 font-semibold text-sm text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-color)] select-none">
                  Name <i class="fas ml-1" [ngClass]="getSortIconClass('name')"></i>
                </th>
                <th (click)="sort('email')" class="p-4 font-semibold text-sm text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-color)] select-none">
                  Email <i class="fas ml-1" [ngClass]="getSortIconClass('email')"></i>
                </th>
                <th (click)="sort('role')" class="p-4 font-semibold text-sm text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-color)] select-none">
                  Role <i class="fas ml-1" [ngClass]="getSortIconClass('role')"></i>
                </th>
                <th (click)="sort('status')" class="p-4 font-semibold text-sm text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-color)] select-none">
                  Status <i class="fas ml-1" [ngClass]="getSortIconClass('status')"></i>
                </th>
                <th (click)="sort('joinedDate')" class="p-4 font-semibold text-sm text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-color)] select-none">
                  Joined Date <i class="fas ml-1" [ngClass]="getSortIconClass('joinedDate')"></i>
                </th>
                <th class="p-4 font-semibold text-sm text-[var(--text-secondary)]">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--border-color)]">
              @for (user of filteredUsers(); track user) {
                <tr class="hover:bg-[var(--bg-color)] transition-colors">
                  <td class="p-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-[var(--primary-color)] text-white flex items-center justify-center text-xs font-bold">
                        {{ user.name.charAt(0) }}
                      </div>
                      <span class="font-medium text-[var(--text-color)]">{{ user.name }}</span>
                    </div>
                  </td>
                  <td class="p-4 text-[var(--text-color)]">{{ user.email }}</td>
                  <td class="p-4">
                    <span class="px-2 py-1 rounded-full text-xs font-medium" 
                      [ngClass]="{
                        'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400': user.role === 'admin',
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300': user.role === 'member'
                      }">
                      {{ user.role | titlecase }}
                    </span>
                  </td>
                  <td class="p-4">
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full" 
                        [ngClass]="{
                          'bg-emerald-500': user.status === 'active',
                          'bg-amber-500': user.status === 'pending',
                          'bg-red-500': user.status === 'rejected'
                        }">
                      </span>
                      <span class="text-[var(--text-color)]">{{ user.status | titlecase }}</span>
                    </div>
                  </td>
                  <td class="p-4 text-[var(--text-color)]">{{ user.joinedDate | date }}</td>
                  <td class="p-4">
                    <div class="flex gap-2">
                      <button class="btn-icon text-blue-500 hover:text-blue-600" title="Edit">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn-icon text-red-500 hover:text-red-600" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              }
              @if (filteredUsers().length === 0) {
                <tr>
                  <td colspan="6" class="p-8 text-center text-[var(--text-secondary)]">No users found</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);

  users = signal<User[]>([]);
  searchQuery = '';
  roleFilter = '';
  statusFilter = '';

  sortField = signal<string>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(data => {
      this.users.set(data);
    });
  }

  filteredUsers = computed(() => {
    let result = this.users();

    // Filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
      );
    }
    if (this.roleFilter) {
      result = result.filter(u => u.role === this.roleFilter);
    }
    if (this.statusFilter) {
      result = result.filter(u => u.status === this.statusFilter);
    }

    // Sort
    const field = this.sortField();
    const direction = this.sortDirection();

    if (field) {
      result = [...result].sort((a, b) => {
        const aValue = (a as any)[field];
        const bValue = (b as any)[field];

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  });

  onSearch() {
    // Trigger computed
  }

  onFilterChange() {
    // Trigger computed
  }

  sort(field: string) {
    if (this.sortField() === field) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
  }

  getSortIconClass(field: string): string {
    if (this.sortField() !== field) return 'fa-sort text-gray-300';
    return this.sortDirection() === 'asc' ? 'fa-sort-up text-[var(--primary-color)]' : 'fa-sort-down text-[var(--primary-color)]';
  }
}
