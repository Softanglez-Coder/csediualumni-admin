import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../../core/services/user.service';

@Component({
    selector: 'app-membership-requests',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-container">
      <h1 class="title">Membership Requests</h1>
    
      <div class="card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Date Requested</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (request of requests(); track request) {
              <tr>
                <td>
                  <div class="user-cell">
                    <div class="avatar-sm">{{ request.name.charAt(0) }}</div>
                    <span>{{ request.name }}</span>
                  </div>
                </td>
                <td>{{ request.email }}</td>
                <td>{{ request.joinedDate | date }}</td>
                <td>
                  <div class="actions-cell">
                    <button class="btn btn-sm btn-success" (click)="approve(request)">Approve</button>
                    <button class="btn btn-sm btn-danger" (click)="reject(request)">Reject</button>
                  </div>
                </td>
              </tr>
            }
            @if (requests().length === 0) {
              <tr>
                <td colspan="4" class="empty-state">No pending requests</td>
              </tr>
            }
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
    .title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-color);
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
      }
      td {
        color: var(--text-color);
        font-size: 0.875rem;
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
      background-color: var(--accent-color);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .actions-cell {
      display: flex;
      gap: 0.5rem;
    }
    .btn-sm {
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
    }
    .btn-success {
      background-color: var(--secondary-color);
      color: white;
      border: none;
      &:hover { filter: brightness(0.9); }
    }
    .btn-danger {
      background-color: var(--danger-color);
      color: white;
      border: none;
      &:hover { filter: brightness(0.9); }
    }
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);
    }
  `]
})
export class MembershipRequestsComponent implements OnInit {
    private userService = inject(UserService);
    requests = signal<User[]>([]);

    ngOnInit() {
        this.loadRequests();
    }

    loadRequests() {
        // In a real app, we'd pass a filter param to the API
        this.userService.getUsers().subscribe(users => {
            this.requests.set(users.filter(u => u.status === 'pending'));
        });
    }

    approve(user: User) {
        if (confirm(`Approve membership for ${user.name}?`)) {
            this.userService.updateUser(user.id, { status: 'active' }).subscribe(() => {
                this.loadRequests();
            });
        }
    }

    reject(user: User) {
        if (confirm(`Reject membership for ${user.name}?`)) {
            this.userService.updateUser(user.id, { status: 'rejected' }).subscribe(() => {
                this.loadRequests();
            });
        }
    }
}
