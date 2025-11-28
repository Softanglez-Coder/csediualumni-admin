import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    template: `
    <aside class="w-64 h-screen bg-[var(--surface-color)] border-r border-[var(--border-color)] flex flex-col fixed left-0 top-0 z-50 transition-colors duration-200">
      <div class="p-6 border-b border-[var(--border-color)] flex items-center gap-3">
        <div class="w-8 h-8 bg-[var(--primary-color)] rounded-lg flex items-center justify-center text-white font-bold text-xl">
          A
        </div>
        <span class="text-xl font-bold text-[var(--text-color)]">Alumni Admin</span>
      </div>

      <nav class="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
          <i class="fas fa-home w-5 text-center"></i>
          <span>Dashboard</span>
        </a>
        
        <div class="px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mt-4">
          Management
        </div>
        
        <a routerLink="/users" routerLinkActive="active" class="nav-link">
          <i class="fas fa-users w-5 text-center"></i>
          <span>Users</span>
        </a>
        <a routerLink="/membership-requests" routerLinkActive="active" class="nav-link">
          <i class="fas fa-user-plus w-5 text-center"></i>
          <span>Requests</span>
        </a>
        
        <div class="px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mt-4">
          Modules
        </div>
        
        <a routerLink="/events" routerLinkActive="active" class="nav-link">
          <i class="fas fa-calendar-alt w-5 text-center"></i>
          <span>Events</span>
        </a>
        <a routerLink="/payments" routerLinkActive="active" class="nav-link">
          <i class="fas fa-credit-card w-5 text-center"></i>
          <span>Payments</span>
        </a>
        <a routerLink="/expenses" routerLinkActive="active" class="nav-link">
          <i class="fas fa-file-invoice-dollar w-5 text-center"></i>
          <span>Expenses</span>
        </a>
        <a routerLink="/blogs" routerLinkActive="active" class="nav-link">
          <i class="fas fa-newspaper w-5 text-center"></i>
          <span>Blogs</span>
        </a>
        <a routerLink="/committees" routerLinkActive="active" class="nav-link">
          <i class="fas fa-sitemap w-5 text-center"></i>
          <span>Committees</span>
        </a>

        <div class="px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mt-4">
          System
        </div>

        <a routerLink="/reporting" routerLinkActive="active" class="nav-link">
          <i class="fas fa-chart-line w-5 text-center"></i>
          <span>Reporting</span>
        </a>
        <a routerLink="/settings" routerLinkActive="active" class="nav-link">
          <i class="fas fa-cog w-5 text-center"></i>
          <span>Settings</span>
        </a>
        <a routerLink="/documentation" routerLinkActive="active" class="nav-link">
          <i class="fas fa-book w-5 text-center"></i>
          <span>Documentation</span>
        </a>
      </nav>

      <div class="p-4 border-t border-[var(--border-color)]">
        <div class="flex items-center gap-3 p-2 rounded-lg bg-[var(--bg-color)]">
          <div class="w-8 h-8 rounded-full bg-[var(--primary-color)] text-white flex items-center justify-center text-sm font-bold">
            AD
          </div>
          <div class="flex-1 overflow-hidden">
            <p class="text-sm font-medium text-[var(--text-color)] truncate">Admin User</p>
            <p class="text-xs text-[var(--text-secondary)] truncate">admin@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  `,
    styles: [`
    .nav-link {
      @apply flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--text-secondary)] font-medium transition-colors duration-200 hover:bg-[var(--bg-color)] hover:text-[var(--text-color)];
      
      &.active {
        @apply bg-[var(--primary-color)] text-white;
        
        i {
          @apply text-white;
        }
      }
    }
  `]
})
export class SidebarComponent { }
