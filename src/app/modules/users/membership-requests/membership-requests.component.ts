import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../../core/services/user.service';

@Component({
  selector: 'app-membership-requests',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1 class="text-2xl font-bold text-[var(--text-color)] mb-6">Membership Requests</h1>
    
      <div class="card overflow-hidden p-0">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-[var(--bg-color)] border-b border-[var(--border-color)]">
              <tr>
                <th class="p-4 font-semibold text-sm text-[var(--text-secondary)]">Name</th>
                <th class="p-4 font-semibold text-sm text-[var(--text-secondary)]">Email</th>
                <th class="p-4 font-semibold text-sm text-[var(--text-secondary)]">Date Requested</th>
                <th class="p-4 font-semibold text-sm text-[var(--text-secondary)]">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--border-color)]">
              @for (request of requests(); track request) {
                <tr class="hover:bg-[var(--bg-color)] transition-colors">
                  <td class="p-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
                        {{ request.name.charAt(0) }}
                      </div>
                      <span class="font-medium text-[var(--text-color)]">{{ request.name }}</span>
                    </div>
                  </td>
                  <td class="p-4 text-[var(--text-color)]">{{ request.email }}</td>
                  <td class="p-4 text-[var(--text-color)]">{{ request.joinedDate | date }}</td>
                  <td class="p-4">
                    <div class="flex gap-2">
                      <button class="px-3 py-1 rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 text-xs font-medium transition-colors" (click)="approve(request)">
                        Approve
                      </button>
                      <button class="px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 text-xs font-medium transition-colors" (click)="reject(request)">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              }
              @if (requests().length === 0) {
                <tr>
                  <td colspan="4" class="p-8 text-center text-[var(--text-secondary)]">No pending requests</td>
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
