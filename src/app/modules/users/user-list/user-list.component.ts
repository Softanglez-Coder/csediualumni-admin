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
      <div class="page-header">
        <h1 class="title">User Management</h1>
        <button class="btn btn-primary">
          <span>+</span> Add User
        </button>
      </div>

      <div class="filters-bar card">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search users..." 
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
          >
        </div>
        <div class="filter-actions">
          <select [(ngModel)]="roleFilter" (change)="onFilterChange()">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
          <select [(ngModel)]="statusFilter" (change)="onFilterChange()">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div class="table-container card">
        <table class="data-table">
          <thead>
            <tr>
              <th (click)="sort('name')" [class.sorted]="sortField() === 'name'">
                Name <span class="sort-icon">{{ getSortIcon('name') }}</span>
              </th>
              <th (click)="sort('email')" [class.sorted]="sortField() === 'email'">
                Email <span class="sort-icon">{{ getSortIcon('email') }}</span>
              </th>
              <th (click)="sort('role')" [class.sorted]="sortField() === 'role'">
                Role <span class="sort-icon">{{ getSortIcon('role') }}</span>
              </th>
              <th (click)="sort('status')" [class.sorted]="sortField() === 'status'">
                Status <span class="sort-icon">{{ getSortIcon('status') }}</span>
              </th>
              <th (click)="sort('joinedDate')" [class.sorted]="sortField() === 'joinedDate'">
                Joined Date <span class="sort-icon">{{ getSortIcon('joinedDate') }}</span>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of filteredUsers()">
              <td>
                <div class="user-cell">
                  <div class="avatar-sm">{{ user.name.charAt(0) }}</div>
                  <span>{{ user.name }}</span>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <span class="badge" [ngClass]="'badge-' + user.role">{{ user.role }}</span>
              </td>
              <td>
                <span class="status-dot" [ngClass]="user.status"></span>
                {{ user.status | titlecase }}
              </td>
              <td>{{ user.joinedDate | date }}</td>
              <td>
                <div class="actions-cell">
                  <button class="btn-icon" title="Edit">✏️</button>
                  <button class="btn-icon danger" title="Delete">🗑️</button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredUsers().length === 0">
              <td colspan="6" class="empty-state">No users found</td>
            </tr>
          </tbody>
        </table>
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
    .filters-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .search-box {
      flex: 1;
      min-width: 200px;
      input {
        width: 100%;
        padding: 0.5rem 1rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        background-color: var(--bg-color);
        color: var(--text-color);
        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }
    }
    .filter-actions {
      display: flex;
      gap: 0.75rem;
      select {
        padding: 0.5rem 2rem 0.5rem 1rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        background-color: var(--bg-color);
        color: var(--text-color);
        cursor: pointer;
      }
    }
    .table-container {
      overflow-x: auto;
      padding: 0;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      
      th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
      }
      th {
        font-weight: 600;
        color: var(--text-secondary);
        font-size: 0.875rem;
        cursor: pointer;
        user-select: none;
        &:hover {
          color: var(--text-color);
        }
        &.sorted {
          color: var(--primary-color);
        }
      }
      td {
        color: var(--text-color);
        font-size: 0.875rem;
      }
      tbody tr:hover {
        background-color: var(--bg-color);
      }
    }
    .user-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 500;
    }
    .avatar-sm {
      width: 32px;
      height: 32px;
      background-color: var(--primary-color);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      &.badge-admin { background-color: #e0e7ff; color: #4f46e5; }
      &.badge-member { background-color: #f3f4f6; color: #374151; }
    }
    .status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 0.5rem;
      &.active { background-color: var(--secondary-color); }
      &.pending { background-color: var(--accent-color); }
      &.rejected { background-color: var(--danger-color); }
    }
    .actions-cell {
      display: flex;
      gap: 0.5rem;
    }
    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      opacity: 0.7;
      transition: opacity 0.2s;
      &:hover { opacity: 1; }
      &.danger:hover { filter: grayscale(0) saturate(1000%) hue-rotate(-50deg); } 
    }
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);
    }
  `]
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

    getSortIcon(field: string): string {
        if (this.sortField() !== field) return '↕️';
        return this.sortDirection() === 'asc' ? '↑' : '↓';
    }
}
